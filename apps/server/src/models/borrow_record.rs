use crate::models::enums::BorrowStatus;
use spacetimedb::table;

#[table(accessor = borrow_record, public)]
#[derive(Clone)]
pub struct BorrowRecord {
    #[primary_key]
    pub id: String,
    pub book_id: String,
    pub user_id: String,
    pub borrow_date: String,
    pub due_date: String,
    pub return_date: Option<String>,
    pub status: BorrowStatus,
    pub branch_id: String,
    pub fine: Option<f64>,
    pub renew_count: i32,
}
