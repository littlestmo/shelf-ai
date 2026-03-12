use spacetimedb::SpacetimeType;

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum BookStatus {
    Available,
    Borrowed,
    Overdue,
    Reserved,
    Lost,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum BookFormat {
    Hardcopy,
    Ebook,
    Audiobook,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum BookCategory {
    Fiction,
    NonFiction,
    Technology,
    Science,
    History,
    SelfHelp,
    Academic,
    Thriller,
    Mystery,
    Fantasy,
    Biography,
    Philosophy,
    Art,
    Romance,
    Dystopian,
    Journal,
    Poetry,
    Comics,
    Other,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum UserRole {
    Admin,
    Librarian,
    Member,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum BorrowStatus {
    Active,
    Returned,
    Overdue,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum MembershipType {
    Basic,
    Premium,
    Scholar,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum NotificationType {
    Overdue,
    Available,
    Reminder,
    System,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum UserStatus {
    Active,
    Suspended,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum BranchStatus {
    Active,
    Inactive,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum AiGenerationStatus {
    Pending,
    Completed,
    Failed,
}
