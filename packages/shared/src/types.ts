import type React from "react";

export type BookStatus =
  | "available"
  | "borrowed"
  | "overdue"
  | "reserved"
  | "lost";
export type BookFormat = "hardcopy" | "ebook" | "audiobook";
export type BookCategory =
  | "Fiction"
  | "Non-Fiction"
  | "Technology"
  | "Science"
  | "History"
  | "Self-Help"
  | "Academic"
  | "Thriller"
  | "Mystery"
  | "Fantasy"
  | "Biography"
  | "Philosophy"
  | "Art"
  | "Romance"
  | "Dystopian"
  | "Journal"
  | "Poetry"
  | "Comics"
  | "Other";

export type UserRole = "admin" | "librarian" | "member";
export type BorrowStatus = "active" | "returned" | "overdue";
export type MembershipType = "Basic" | "Premium" | "Scholar";
export type NotificationType = "overdue" | "available" | "reminder" | "system";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: BookCategory;
  publishedYear: number;
  publisher: string;
  totalCopies: number;
  availableCopies: number;
  status: BookStatus;
  coverUrl?: string;
  description?: string;
  location: string;
  branchId: string;
  format: BookFormat[];
  pages?: number;
  language?: string;
  edition?: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryUser {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
  memberSince: string;
  membershipType: MembershipType;
  borrowLimit: number;
  bio?: string;
  registerNumber?: string;
  department?: string;
  status: "active" | "suspended";
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  manager: string;
  totalBooks: number;
  totalMembers: number;
  status: "active" | "inactive";
  openHours: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: BorrowStatus;
  branchId: string;
  fine?: number;
  renewCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AiGeneration {
  id: string;
  userId: string;
  prompt: string;
  resultBookId?: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export type SortDirection = "asc" | "desc";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

export interface FilterState {
  search: string;
  status: string;
  category?: string;
  branch?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface StatCardData {
  id: string;
  label: string;
  value: number;
  unit?: string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  icon: string;
  color: string;
}

export interface MonthlyData {
  month: string;
  borrowed: number;
  returned: number;
  overdue: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export type ModalType =
  | "addBook"
  | "editBook"
  | "deleteBook"
  | "borrow"
  | "return"
  | "renew"
  | "addUser"
  | "addBranch"
  | "changePassword"
  | "payFine"
  | null;

export interface ModalState {
  type: ModalType;
  data?: unknown;
}
