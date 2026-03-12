use crate::models::enums::AiGenerationStatus;
use spacetimedb::{Timestamp, table};

#[table(accessor = ai_generation, public)]
pub struct AiGeneration {
    #[primary_key]
    pub id: String,
    pub user_id: String,
    pub prompt: String,
    pub result_book_id: Option<String>,
    pub status: AiGenerationStatus,
    pub created_at: Timestamp,
}
