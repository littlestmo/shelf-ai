use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn create_notification(
    ctx: &ReducerContext,
    user_id: String,
    notification_type: NotificationType,
    title: String,
    message: String,
    date: String,
) {
    let id = generate_id("notif", ctx);
    ctx.db.notification().insert(Notification {
        id,
        user_id,
        notification_type,
        title,
        message,
        date,
        read: false,
    });
}

#[reducer]
pub fn mark_notification_read(ctx: &ReducerContext, id: String) {
    if let Some(existing) = ctx.db.notification().id().find(&id) {
        let updated = Notification {
            read: true,
            ..existing
        };
        ctx.db.notification().id().update(updated);
    }
}
