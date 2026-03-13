use crate::models::enums::{BookCategory, BookFormat, BookStatus};
use spacetimedb::{Timestamp, table};

#[table(accessor = book, public)]
pub struct Book {
    #[primary_key]
    pub id: String,
    pub title: String,
    pub author: String,
    pub isbn: String,
    pub category: BookCategory,
    pub published_date: String,
    pub publisher: String,
    pub total_copies: i32,
    pub available_copies: i32,
    pub status: BookStatus,
    pub cover_url: Option<String>,
    pub description: Option<String>,
    pub location: String,
    pub branch_id: String,
    pub format: Vec<BookFormat>,
    pub pages: Option<i32>,
    pub language: Option<String>,
    pub edition: Option<String>,
    pub pdf_data: Option<String>,
    pub cover_data: Option<String>,
    pub rating: f64,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
