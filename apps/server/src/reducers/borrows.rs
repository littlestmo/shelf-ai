use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn checkout_book(
    ctx: &ReducerContext,
    book_id: String,
    user_id: String,
    branch_id: String,
    due_date: String,
) {
    let now = ctx.timestamp;

    if let Some(existing_book) = ctx.db.book().id().find(&book_id) {
        if existing_book.available_copies <= 0 {
            log::warn!("No available copies for book {}", book_id);
            return;
        }

        let updated_book = Book {
            available_copies: existing_book.available_copies - 1,
            status: if existing_book.available_copies - 1 == 0 {
                BookStatus::Borrowed
            } else {
                existing_book.status.clone()
            },
            updated_at: now,
            ..existing_book
        };
        ctx.db.book().id().update(updated_book);

        let record_id = generate_id("borrow", ctx);
        let borrow_date = format!(
            "{}",
            now.to_duration_since_unix_epoch().unwrap().as_secs() / 86400
        );

        ctx.db.borrow_record().insert(BorrowRecord {
            id: record_id,
            book_id,
            user_id,
            borrow_date,
            due_date,
            return_date: None,
            status: BorrowStatus::Active,
            branch_id,
            fine: None,
            renew_count: 0,
        });
    }
}

#[reducer]
pub fn checkin_book(ctx: &ReducerContext, record_id: String, fine: Option<f64>) {
    let now = ctx.timestamp;

    if let Some(existing_record) = ctx.db.borrow_record().id().find(&record_id) {
        let return_date = format!(
            "{}",
            now.to_duration_since_unix_epoch().unwrap().as_secs() / 86400
        );

        let updated_record = BorrowRecord {
            return_date: Some(return_date),
            status: BorrowStatus::Returned,
            fine,
            ..existing_record.clone()
        };
        ctx.db.borrow_record().id().update(updated_record);

        if let Some(existing_book) = ctx.db.book().id().find(&existing_record.book_id) {
            let updated_book = Book {
                available_copies: existing_book.available_copies + 1,
                status: BookStatus::Available,
                updated_at: now,
                ..existing_book
            };
            ctx.db.book().id().update(updated_book);
        }
    }
}

#[reducer]
pub fn renew_book(ctx: &ReducerContext, record_id: String, new_due_date: String) {
    if let Some(existing) = ctx.db.borrow_record().id().find(&record_id) {
        let updated = BorrowRecord {
            due_date: new_due_date,
            renew_count: existing.renew_count + 1,
            ..existing
        };
        ctx.db.borrow_record().id().update(updated);
    }
}
