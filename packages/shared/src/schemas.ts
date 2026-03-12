import { z } from "zod";

export const addBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  author: z.string().min(1, "Author is required").max(100),
  isbn: z.string().min(10, "Invalid ISBN").max(17),
  category: z.string().min(1, "Category is required"),
  publishedDate: z.string().min(1, "Published date is required"),
  publisher: z.string().min(1, "Publisher is required").max(100),
  totalCopies: z.coerce.number().min(1, "At least 1 copy required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  branchId: z.string().min(1, "Branch is required"),
  format: z.string().optional(),
  pages: z.coerce.number().min(1).optional(),
  language: z.string().optional(),
  edition: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
});

export type AddBookInput = z.infer<typeof addBookSchema>;

export const editBookSchema = addBookSchema.extend({
  id: z.string(),
  availableCopies: z.coerce.number().min(0),
  status: z.enum(["Available", "Borrowed", "Overdue", "Reserved", "Lost"]),
});

export type EditBookInput = z.infer<typeof editBookSchema>;

export const checkoutSchema = z.object({
  bookId: z.string().min(1, "Book is required"),
  userId: z.string().min(1, "User is required"),
  branchId: z.string().min(1, "Branch is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const checkinSchema = z.object({
  recordId: z.string().min(1, "Record ID is required"),
  fine: z.coerce.number().min(0).optional(),
});

export type CheckinInput = z.infer<typeof checkinSchema>;

export const addUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  role: z.enum(["Admin", "Librarian", "Member"]),
  phone: z.string().optional(),
  membershipType: z.enum(["Basic", "Premium", "Scholar"]),
});

export type AddUserInput = z.infer<typeof addUserSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500).optional(),
  registerNumber: z.string().optional(),
  department: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const addBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required").max(100),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  manager: z.string().min(1, "Manager name is required"),
  openHours: z.string().min(1, "Open hours required"),
});

export type AddBranchInput = z.infer<typeof addBranchSchema>;

export const aiPromptSchema = z.object({
  prompt: z
    .string()
    .min(10, "Describe the book in at least 10 characters")
    .max(2000),
});

export type AiPromptInput = z.infer<typeof aiPromptSchema>;

export const searchSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  branch: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  perPage: z.coerce.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;
