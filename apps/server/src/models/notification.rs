use crate::models::enums::NotificationType;
use spacetimedb::table;

#[table(accessor = notification, public)]
pub struct Notification {
    #[primary_key]
    pub id: String,
    pub user_id: String,
    pub notification_type: NotificationType,
    pub title: String,
    pub message: String,
    pub date: String,
    pub read: bool,
}
