use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn add_user(
    ctx: &ReducerContext,
    clerk_id: String,
    name: String,
    email: String,
    role: UserRole,
    phone: Option<String>,
    membership_type: MembershipType,
) {
    let now = ctx.timestamp;
    let id = generate_id("user", ctx);
    let borrow_limit = match membership_type {
        MembershipType::Basic => 3,
        MembershipType::Premium => 7,
        MembershipType::Scholar => 10,
    };

    ctx.db.library_user().insert(LibraryUser {
        id,
        clerk_id,
        name,
        email,
        role,
        phone,
        address: None,
        avatar: None,
        member_since: format!(
            "{}",
            now.to_duration_since_unix_epoch().unwrap().as_secs() / 86400
        ),
        membership_type,
        borrow_limit,
        bio: None,
        register_number: None,
        department: None,
        status: UserStatus::Active,
        created_at: now,
    });
}

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn update_user(
    ctx: &ReducerContext,
    id: String,
    name: String,
    email: String,
    phone: Option<String>,
    address: Option<String>,
    bio: Option<String>,
    register_number: Option<String>,
    department: Option<String>,
) {
    if let Some(existing) = ctx.db.library_user().id().find(&id) {
        let updated = LibraryUser {
            name,
            email,
            phone,
            address,
            bio,
            register_number,
            department,
            ..existing
        };
        ctx.db.library_user().id().update(updated);
    }
}

#[reducer]
pub fn suspend_user(ctx: &ReducerContext, id: String) {
    if let Some(existing) = ctx.db.library_user().id().find(&id) {
        let updated = LibraryUser {
            status: UserStatus::Suspended,
            ..existing
        };
        ctx.db.library_user().id().update(updated);
    }
}

#[reducer]
pub fn activate_user(ctx: &ReducerContext, id: String) {
    if let Some(existing) = ctx.db.library_user().id().find(&id) {
        let updated = LibraryUser {
            status: UserStatus::Active,
            ..existing
        };
        ctx.db.library_user().id().update(updated);
    }
}
