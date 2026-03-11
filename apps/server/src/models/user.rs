use crate::models::enums::{MembershipType, UserRole, UserStatus};
use spacetimedb::{Timestamp, table};

#[table(accessor = library_user, public)]
pub struct LibraryUser {
    #[primary_key]
    pub id: String,
    pub clerk_id: String,
    pub name: String,
    pub email: String,
    pub role: UserRole,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub avatar: Option<String>,
    pub member_since: String,
    pub membership_type: MembershipType,
    pub borrow_limit: i32,
    pub bio: Option<String>,
    pub register_number: Option<String>,
    pub department: Option<String>,
    pub status: UserStatus,
    pub created_at: Timestamp,
}
