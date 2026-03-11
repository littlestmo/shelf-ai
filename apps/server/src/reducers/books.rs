use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn add_book(
    ctx: &ReducerContext,
    title: String,
    author: String,
    isbn: String,
    category: BookCategory,
    published_date: String,
    publisher: String,
    total_copies: i32,
    description: Option<String>,
    location: String,
    branch_id: String,
    format: Vec<BookFormat>,
    pages: Option<i32>,
    language: Option<String>,
    edition: Option<String>,
    cover_url: Option<String>,
) {
    let now = ctx.timestamp;
    let id = generate_id("book", ctx);

    ctx.db.book().insert(Book {
        id,
        title,
        author,
        isbn,
        category,
        published_date,
        publisher,
        total_copies,
        available_copies: total_copies,
        status: BookStatus::Available,
        cover_url,
        description,
        location,
        branch_id,
        format,
        pages,
        language,
        edition,
        rating: 0.0,
        created_at: now,
        updated_at: now,
    });
}

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn update_book(
    ctx: &ReducerContext,
    id: String,
    title: String,
    author: String,
    isbn: String,
    category: BookCategory,
    published_date: String,
    publisher: String,
    total_copies: i32,
    available_copies: i32,
    status: BookStatus,
    description: Option<String>,
    location: String,
    branch_id: String,
    format: Vec<BookFormat>,
    pages: Option<i32>,
    language: Option<String>,
    edition: Option<String>,
    cover_url: Option<String>,
) {
    let now = ctx.timestamp;

    if let Some(existing) = ctx.db.book().id().find(&id) {
        let updated = Book {
            id: existing.id,
            title,
            author,
            isbn,
            category,
            published_date,
            publisher,
            total_copies,
            available_copies,
            status,
            cover_url,
            description,
            location,
            branch_id,
            format,
            pages,
            language,
            edition,
            rating: existing.rating,
            created_at: existing.created_at,
            updated_at: now,
        };
        ctx.db.book().id().update(updated);
    }
}

#[reducer]
pub fn delete_book(ctx: &ReducerContext, id: String) {
    if let Some(existing) = ctx.db.book().id().find(&id) {
        ctx.db.book().id().delete(&existing.id);
    }
}
