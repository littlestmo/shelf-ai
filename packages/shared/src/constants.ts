export const BOOK_CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Technology",
  "Science",
  "History",
  "Self-Help",
  "Academic",
  "Thriller",
  "Mystery",
  "Fantasy",
  "Biography",
  "Philosophy",
  "Art",
  "Romance",
  "Dystopian",
  "Journal",
  "Poetry",
  "Comics",
  "Other",
] as const;

export const BOOK_FORMATS = ["Hardcopy", "Ebook", "Audiobook"] as const;

export const BOOK_STATUSES = [
  "Available",
  "Borrowed",
  "Overdue",
  "Reserved",
  "Lost",
] as const;

export const USER_ROLES = ["Admin", "Librarian", "Member"] as const;

export const MEMBERSHIP_TYPES = ["Basic", "Premium", "Scholar"] as const;

export const STATUS_COLORS: Record<string, string> = {
  Available: "#10b981",
  Borrowed: "#3b82f6",
  Overdue: "#ef4444",
  Reserved: "#f59e0b",
  Lost: "#6b7280",
  Active: "#10b981",
  Returned: "#10b981",
  Suspended: "#ef4444",
  Inactive: "#6b7280",
  Pending: "#f59e0b",
  Completed: "#10b981",
  Failed: "#ef4444",
};

export const CATEGORY_COLORS: Record<string, string> = {
  Fiction: "#8b5cf6",
  "Non-Fiction": "#3b82f6",
  Technology: "#06b6d4",
  Science: "#10b981",
  History: "#f59e0b",
  "Self-Help": "#ec4899",
  Academic: "#6366f1",
  Thriller: "#ef4444",
  Mystery: "#a855f7",
  Fantasy: "#14b8a6",
  Biography: "#f97316",
  Philosophy: "#84cc16",
  Art: "#e879f9",
  Romance: "#fb7185",
  Dystopian: "#64748b",
  Journal: "#0ea5e9",
  Poetry: "#c084fc",
  Comics: "#fbbf24",
  Other: "#94a3b8",
};

export const ADMIN_MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
  },
  { id: "books", label: "Books", icon: "BookOpen", path: "/books" },
  { id: "users", label: "Users", icon: "Users", path: "/users" },
  { id: "branches", label: "Branches", icon: "Building2", path: "/branches" },
  { id: "catalog", label: "Catalog", icon: "Library", path: "/catalog" },
  {
    id: "ai-generate",
    label: "AI Generate",
    icon: "Sparkles",
    path: "/ai-generate",
  },
] as const;

export const USER_MENU_ITEMS = [
  { id: "home", label: "Home", icon: "Home", path: "/home" },
  { id: "search", label: "Search", icon: "Search", path: "/search" },
  { id: "shelf", label: "My Shelf", icon: "BookMarked", path: "/shelf" },
  { id: "ai-search", label: "AI Search", icon: "Sparkles", path: "/ai-search" },
  {
    id: "contribute",
    label: "Contribute",
    icon: "Upload",
    path: "/contribute",
  },
  { id: "profile", label: "Profile", icon: "User", path: "/profile" },
] as const;

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50] as const;

export const DAILY_QUOTES = [
  {
    text: "There is more treasure in books than in all the pirate's loot on Treasure Island.",
    author: "Walt Disney",
  },
  {
    text: "A room without books is like a body without a soul.",
    author: "Marcus Tullius Cicero",
  },
  {
    text: "The only thing you absolutely have to know, is the location of the library.",
    author: "Albert Einstein",
  },
  {
    text: "I have always imagined that Paradise will be a kind of library.",
    author: "Jorge Luis Borges",
  },
  { text: "So many books, so little time.", author: "Frank Zappa" },
  {
    text: "A book is a dream that you hold in your hand.",
    author: "Neil Gaiman",
  },
  {
    text: "Reading is essential for those who seek to rise above the ordinary.",
    author: "Jim Rohn",
  },
] as const;
