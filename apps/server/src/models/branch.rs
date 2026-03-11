use crate::models::enums::BranchStatus;
use spacetimedb::table;

#[table(accessor = branch, public)]
pub struct Branch {
    #[primary_key]
    pub id: String,
    pub name: String,
    pub address: String,
    pub city: String,
    pub phone: String,
    pub email: String,
    pub manager: String,
    pub total_books: i32,
    pub total_members: i32,
    pub status: BranchStatus,
    pub open_hours: String,
}
