use spacetimedb::table;

#[table(accessor = book_rating, public)]
pub struct BookRating {
    #[primary_key]
    pub id: String,
    pub book_id: String,
    pub user_id: String,
    pub rating: f64,
    pub created_at: String,
}
