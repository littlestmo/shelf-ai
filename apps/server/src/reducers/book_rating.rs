use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn add_rating(ctx: &ReducerContext, book_id: String, user_id: String, rating: f64) {
    let now = ctx.timestamp;

    let existing_rating = ctx
        .db
        .book_rating()
        .iter()
        .find(|r| r.book_id == book_id && r.user_id == user_id);

    let created_at = format!("{}", now.to_duration_since_unix_epoch().unwrap().as_secs());

    if let Some(existing) = existing_rating {
        let updated = BookRating {
            rating,
            created_at: created_at.clone(),
            ..existing
        };
        ctx.db.book_rating().id().update(updated);
    } else {
        let id = generate_id("rating", ctx);
        ctx.db.book_rating().insert(BookRating {
            id,
            book_id: book_id.clone(),
            user_id: user_id.clone(),
            rating,
            created_at: created_at.clone(),
        });
    }

    if let Some(existing_book) = ctx.db.book().id().find(&book_id) {
        let all_ratings: Vec<f64> = ctx
            .db
            .book_rating()
            .iter()
            .filter(|r| r.book_id == book_id)
            .map(|r| r.rating)
            .collect();

        let new_rating = if all_ratings.is_empty() {
            0.0
        } else {
            let sum: f64 = all_ratings.iter().sum();
            sum / (all_ratings.len() as f64)
        };

        let updated_book = Book {
            rating: new_rating,
            updated_at: now,
            ..existing_book
        };
        ctx.db.book().id().update(updated_book);
    }
}
