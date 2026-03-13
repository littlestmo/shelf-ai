<h1 align="center">Shelf AI | Intelligent Library Management System</h1>

<p align="center">
  <strong>AI-Powered Library System with Real-Time Data Sync</strong>
</p>

| <a href="https://shelfai.up.railway.app"><img src="https://img.shields.io/badge/🚀_User_Dashboard-Live_on_Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white&labelColor=10B981" height="42" alt="User Dashboard" /></a> | <a href="https://shelfaiadmin.up.railway.app"><img src="https://img.shields.io/badge/🚀_Admin_Dashboard-Live_on_Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white&labelColor=8B5CF6" height="42" alt="Admin Dashboard" /></a> |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                <a href="https://shelfai.up.railway.app"><img src="./docs/assets/user.png" alt="User Dashboard" /></a>                                                                |                                                                <a href="https://shelfaiadmin.up.railway.app"><img src="./docs/assets/admin.png" alt="Admin Dashboard" /></a>                                                                |

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/SpacetimeDB-2.0-10b981?style=for-the-badge" alt="SpacetimeDB" />
  <img src="https://img.shields.io/badge/Vercel_AI_SDK-6.0-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel AI SDK" />
  <img src="https://img.shields.io/badge/Clerk-6.12-6C47FF?style=for-the-badge" alt="Clerk" />
  <img src="https://img.shields.io/badge/Turborepo-2.8-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
  <img src="https://img.shields.io/badge/Rust-2024_Edition-DEA584?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/Zod-3.23-3E67B1?style=for-the-badge" alt="Zod" />
  <img src="https://img.shields.io/badge/pnpm-9.0-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
  <a href="https://creativecommons.org/licenses/by-nc/4.0/">
    <img src="https://img.shields.io/badge/License-CC_BY--NC_4.0-EF9421?style=for-the-badge&logo=creative-commons&logoColor=white" alt="CC BY-NC 4.0" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/littlestmo/shelf-ai/actions/workflows/admin-build.yml"><img src="https://img.shields.io/github/actions/workflow/status/littlestmo/shelf-ai/admin-build.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=Admin Build" alt="Admin Build" /></a>
  <a href="https://github.com/littlestmo/shelf-ai/actions/workflows/user-build.yml"><img src="https://img.shields.io/github/actions/workflow/status/littlestmo/shelf-ai/user-build.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=User Build" alt="User Build" /></a>
  <a href="https://github.com/littlestmo/shelf-ai/actions/workflows/lint.yml"><img src="https://img.shields.io/github/actions/workflow/status/littlestmo/shelf-ai/lint.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=Lint Check" alt="Lint Check" /></a>
  <a href="https://github.com/littlestmo/shelf-ai/actions/workflows/typecheck.yml"><img src="https://img.shields.io/github/actions/workflow/status/littlestmo/shelf-ai/typecheck.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=Typecheck" alt="Typecheck" /></a>
  <a href="https://github.com/littlestmo/shelf-ai/actions/workflows/prettier.yml"><img src="https://img.shields.io/github/actions/workflow/status/littlestmo/shelf-ai/prettier.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=Prettier" alt="Prettier Check" /></a>
  <br />
  <a href="https://github.com/littlestmo/shelf-ai/actions/workflows/security-audit.yml"><img src="https://img.shields.io/github/actions/workflow/status/littlestmo/shelf-ai/security-audit.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=Security Audit" alt="Security Audit" /></a>
  <a href="https://github.com/littlestmo/shelf-ai/actions/workflows/server-clippy.yml"><img src="https://img.shields.io/github/actions/workflow/status/littlestmo/shelf-ai/server-clippy.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=Server Clippy" alt="Server Clippy" /></a>
  <a href="https://github.com/littlestmo/shelf-ai/actions/workflows/server-fmt.yml"><img src="https://img.shields.io/github/actions/workflow/status/littlestmo/shelf-ai/server-fmt.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=Server Fmt" alt="Server Fmt" /></a>
</p>

## Overview

Shelf AI is an AI-powered library management system built as a Turborepo monorepo. It features two Next.js 16 dashboards (admin and user), a Rust-based SpacetimeDB server module, and shared UI/logic packages. AI capabilities, semantic search, book generation, and magic shuffle, are powered by Google Gemini via the Vercel AI SDK.

## Monorepo Structure

```
shelf-ai/
├── apps/
│   ├── admin/          → Admin dashboard (Next.js, port 3001)
│   ├── user/           → User dashboard (Next.js, port 3002)
│   └── server/         → SpacetimeDB module (Rust/WASM)
├── packages/
│   ├── ui/             → Shared React component library
│   ├── shared/         → Hooks, types, schemas, constants, i18n
│   ├── eslint-config/  → Shared ESLint configuration
│   └── typescript-config/ → Shared TSConfig presets
├── docs/tutorials/     → Setup and integration guides
├── turbo.json          → Turborepo pipeline config
└── pnpm-workspace.yaml → Workspace definition
```

## Architecture

Traditional library apps use REST APIs with PostgreSQL. Shelf AI replaces this with **SpacetimeDB**, a serverless database where backend logic runs as WASN modules. Clients subscribe to table changes over WebSockets and receive real-time delta updates, eliminating polling and HTTP round-trips entirely.

### Data Synchronization Flow

```mermaid
sequenceDiagram
    participant C as Next.js Client
    participant WS as WebSocket Connection
    participant W as WASM Reducer
    participant T as In-Memory Tables

    rect rgb(15, 42, 30)
    Note over C: Action Dispatched
    C->>WS: Call Reducer (e.g. addBook)
    WS->>W: Execute WASM Logic
    W->>T: Mutate In-Memory State
    T-->>WS: Broadcast Delta to Subscribers
    WS-->>C: onUpdate Callback → React Re-render
    Note over C: UI Updated Instantly
    end
```

### AI Features Architecture

```mermaid
sequenceDiagram
    participant UC as Client (React)
    participant RH as Next.js Route Handler
    participant AI as Google Gemini 2.5 Flash
    participant SDB as SpacetimeDB

    UC->>RH: POST /api/ai/search { query, catalog }
    RH->>AI: generateObject(prompt + zod schema)
    AI-->>RH: Structured JSON (ranked results)
    RH-->>UC: Return matches with relevance scores

    opt Admin: Book Generation
        UC->>RH: POST /api/ai/generate { prompt }
        RH->>AI: generateObject(book metadata schema)
        AI-->>RH: Complete book object
        RH-->>UC: Return generated book
        UC->>SDB: Persist via useAddBook reducer
    end

    opt Magic Shuffle
        UC->>RH: POST /api/ai/shuffle { catalog }
        RH->>AI: generateObject(themed picks schema)
        AI-->>RH: Thematically linked books
        RH-->>UC: Return picks + theme name
    end
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Next.js App
    participant CK as Clerk
    participant SDB as SpacetimeDB

    U->>C: Visit /sign-in
    C->>CK: Render Clerk Sign-In Component
    U->>CK: Enter Credentials
    CK-->>C: Session Token + User Object
    C->>SDB: Connect WebSocket (with clerkId)
    SDB-->>C: Subscription Sync (user data, books, etc.)
    C-->>U: Render Dashboard
```

## User Flows

### Book Search and Issue

```mermaid
graph LR
    A([Home]) --> B([Search])
    B --> C([Book Details])
    C --> D{Available?}
    D -->|Yes| E([Issue Book])
    D -->|No| F([Reserve])
    E --> G([Confirm + Student ID])
    G --> H([Issued ✓])

    style A fill:#10b981,color:#fff
    style H fill:#10b981,color:#fff
    style F fill:#f59e0b,color:#fff
```

### AI-Powered Search

```mermaid
graph LR
    A([Home]) --> B([AI Search])
    B --> C([Write Prompt])
    C --> D([AI Ranked Suggestions])
    D --> E([Book Details])
    E --> F{Available?}
    F -->|Yes| G([Issue])
    F -->|No| H([Reserve])
    G --> I([Confirm])
    I --> J([Issued ✓])

    style A fill:#10b981,color:#fff
    style J fill:#10b981,color:#fff
    style H fill:#f59e0b,color:#fff
```

### Magic Shuffle Discovery

```mermaid
graph LR
    A([Home]) --> B([Search])
    B --> C([Magic Shuffle 🎲])
    C --> D([Themed Suggestions])
    D --> E([Book Details])
    E --> F{Available?}
    F -->|Yes| G([Issue])
    F -->|No| H([Reserve])
    G --> I([Confirm])
    I --> J([Issued ✓])

    style A fill:#10b981,color:#fff
    style J fill:#10b981,color:#fff
    style C fill:#8b5cf6,color:#fff
    style H fill:#f59e0b,color:#fff
```

### Book Return

```mermaid
graph LR
    A([Home]) --> B([My Books])
    B --> C([Select Book])
    C --> D([Return])
    D --> E([Rate Book ⭐])
    E --> F([Returned ✓])

    style A fill:#10b981,color:#fff
    style F fill:#10b981,color:#fff
    style E fill:#f59e0b,color:#fff
```

### Admin: AI Book Generation

```mermaid
graph LR
    A([Admin Dashboard]) --> B([AI Generate])
    B --> C([Enter Prompt])
    C --> D([AI Generates Metadata])
    D --> E([Review Book])
    E --> F([Save to Library])
    F --> G([Persisted in SpacetimeDB ✓])

    style A fill:#6366f1,color:#fff
    style G fill:#10b981,color:#fff
    style D fill:#8b5cf6,color:#fff
```

## Database Schema

```mermaid
erDiagram
    LibraryUser {
        string id PK
        string clerk_id UK
        string name
        string email
        UserRole role
        string phone
        string address
        string avatar
        string member_since
        MembershipType membership_type
        int borrow_limit
        string bio
        string register_number
        string department
        UserStatus status
        timestamp created_at
    }
    Book {
        string id PK
        string title
        string author
        string isbn
        BookCategory category
        string published_date
        string publisher
        int total_copies
        int available_copies
        BookStatus status
        string cover_url
        string description
        string location
        string branch_id FK
        BookFormat format
        int pages
        string language
        string edition
        float rating
        timestamp created_at
        timestamp updated_at
    }
    Branch {
        string id PK
        string name
        string address
        string city
        string phone
        string email
        string manager
        int total_books
        int total_members
        BranchStatus status
        string open_hours
    }
    BorrowRecord {
        string id PK
        string book_id FK
        string user_id FK
        string borrow_date
        string due_date
        string return_date
        BorrowStatus status
        string branch_id FK
        float fine
        int renew_count
    }
    Notification {
        string id PK
        string user_id FK
        NotificationType notification_type
        string title
        string message
        string date
        bool read
    }
    BookRating {
        string id PK
        string book_id FK
        string user_id FK
        float rating
        string created_at
    }
    AiGeneration {
        string id PK
        string user_id FK
        string prompt
        string result_book_id FK
        AiGenerationStatus status
        timestamp created_at
    }
    Branch ||--o{ Book : houses
    LibraryUser ||--o{ BorrowRecord : borrows
    Book ||--o{ BorrowRecord : tracked_in
    Branch ||--o{ BorrowRecord : processed_at
    LibraryUser ||--o{ Notification : receives
    LibraryUser ||--o{ BookRating : rates
    Book ||--o{ BookRating : rated_by
    LibraryUser ||--o{ AiGeneration : requests
    Book ||--o{ AiGeneration : generated_as
```

## AI Capabilities

| Feature         | Endpoint                | Description                                  |
| :-------------- | :---------------------- | :------------------------------------------- |
| Semantic Search | `POST /api/ai/search`   | Natural language queries ranked by relevance |
| Book Generation | `POST /api/ai/generate` | Complete book metadata from a text prompt    |
| Magic Shuffle   | `POST /api/ai/shuffle`  | Thematically linked book discovery           |

## Scripts

| Command            | Description                                    |
| :----------------- | :--------------------------------------------- |
| `pnpm dev`         | Start all dev servers via Turborepo            |
| `pnpm build`       | TypeScript check + production build (all apps) |
| `pnpm lint`        | ESLint strict checks across monorepo           |
| `pnpm check-types` | TypeScript verification for all packages       |
| `pnpm format`      | Prettier formatting                            |

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- Rust toolchain (for SpacetimeDB server module)
- SpacetimeDB CLI (`spacetime`)

### Quick Start

```sh
git clone <repo-url>
cd turbo
pnpm install
```

### Environment Setup

Copy and configure `.env.local` in both `apps/user/` and `apps/admin/`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home
NEXT_PUBLIC_SPACETIMEDB_URI=http://localhost:3000
NEXT_PUBLIC_SPACETIMEDB_MODULE=shelf-ai
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

### Deploy SpacetimeDB Module

```sh
cd apps/server
spacetime start

# on a separate terminal:
spacetime publish -s local shelf-ai
```

### Run Development Servers

```sh
pnpm dev
```

Admin: `http://localhost:3001` · User: `http://localhost:3002`

## Tutorials

| Guide                                                | Description                                   |
| :--------------------------------------------------- | :-------------------------------------------- |
| [Environment Setup](docs/tutorials/setup-env.md)     | Configure all environment variables           |
| [Clerk Auth Setup](docs/tutorials/clerk-setup.md)    | Get Clerk API keys step by step               |
| [Google AI Setup](docs/tutorials/google-ai-setup.md) | Get Gemini API key from Google AI Studio      |
| [SpacetimeDB Setup](docs/tutorials/spacetime-db.md)  | Install CLI, publish module, connect client   |
| [AI Integration](docs/tutorials/ai-integration.md)   | How the Vercel AI SDK is used in the codebase |
| [i18n Setup](docs/tutorials/i18n-setup.md)           | Internationalization with react-i18next       |

## License

<p>
  <a href="https://creativecommons.org/licenses/by-nc/4.0/">
    <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc.png" alt="CC BY-NC 4.0" />
  </a>
</p>

This work is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).
