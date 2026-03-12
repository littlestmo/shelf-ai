use crate::models::*;
use spacetimedb::{ReducerContext, Table, reducer};

#[reducer]
pub fn register_ai_generation(ctx: &ReducerContext, user_id: String, prompt: String) {
    let now = ctx.timestamp;
    let id = generate_id("aigen", ctx);
    ctx.db.ai_generation().insert(AiGeneration {
        id,
        user_id,
        prompt,
        result_book_id: None,
        status: AiGenerationStatus::Pending,
        created_at: now,
    });
}

#[reducer]
pub fn complete_ai_generation(
    ctx: &ReducerContext,
    id: String,
    result_book_id: Option<String>,
    status: AiGenerationStatus,
) {
    if let Some(existing) = ctx.db.ai_generation().id().find(&id) {
        let updated = AiGeneration {
            result_book_id,
            status,
            ..existing
        };
        ctx.db.ai_generation().id().update(updated);
    }
}
