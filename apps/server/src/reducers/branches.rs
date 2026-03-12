use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn add_branch(
    ctx: &ReducerContext,
    name: String,
    address: String,
    city: String,
    phone: String,
    email: String,
    manager: String,
    open_hours: String,
) {
    let id = generate_id("branch", ctx);
    ctx.db.branch().insert(Branch {
        id,
        name,
        address,
        city,
        phone,
        email,
        manager,
        total_books: 0,
        total_members: 0,
        status: BranchStatus::Active,
        open_hours,
    });
}

#[reducer]
#[allow(clippy::too_many_arguments)]
pub fn update_branch(
    ctx: &ReducerContext,
    id: String,
    name: String,
    address: String,
    city: String,
    phone: String,
    email: String,
    manager: String,
    open_hours: String,
    status: BranchStatus,
) {
    if let Some(existing) = ctx.db.branch().id().find(&id) {
        let updated = Branch {
            name,
            address,
            city,
            phone,
            email,
            manager,
            open_hours,
            status,
            ..existing
        };
        ctx.db.branch().id().update(updated);
    }
}
