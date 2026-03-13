"use client";

import { useCallback, useEffect, useState } from "react";
import { type DbConnection } from "./module_bindings";
import type {
  Book,
  LibraryUser,
  Branch,
  BorrowRecord,
  Notification,
  AiGeneration,
} from "./module_bindings/types";
import { useSpacetimeDB } from "./spacetimedb";

function useTableData<T>(
  tableName: string,
  queryFn: (conn: DbConnection) => Iterable<T>,
): T[] {
  const { connection, connected } = useSpacetimeDB();
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    if (!connection || !connected) return;

    const refresh = () => {
      try {
        setData([...queryFn(connection)]);
      } catch {
        setData([]);
      }
    };

    refresh();

    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [connection, connected, queryFn]);

  return data;
}

export function useBooks(): Book[] {
  return useTableData(
    "book",
    useCallback((conn: DbConnection) => conn.db.book.iter(), []),
  );
}

export function useUsers(): LibraryUser[] {
  return useTableData(
    "library_user",
    useCallback((conn: DbConnection) => conn.db.library_user.iter(), []),
  );
}

export function useBranches(): Branch[] {
  return useTableData(
    "branch",
    useCallback((conn: DbConnection) => conn.db.branch.iter(), []),
  );
}

export function useBorrowRecords(): BorrowRecord[] {
  return useTableData(
    "borrow_record",
    useCallback((conn: DbConnection) => conn.db.borrow_record.iter(), []),
  );
}

export function useNotifications(userId?: string): Notification[] {
  const all = useTableData(
    "notification",
    useCallback((conn: DbConnection) => conn.db.notification.iter(), []),
  );
  if (!userId) return all;
  return all.filter((n) => n.userId === userId);
}

export function useAiGenerations(): AiGeneration[] {
  return useTableData(
    "ai_generation",
    useCallback((conn: DbConnection) => conn.db.ai_generation.iter(), []),
  );
}

export function useAddBook() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (args: {
      title: string;
      author: string;
      isbn: string;
      category: string;
      publisher: string;
      totalCopies: number;
      description?: string;
      location: string;
      branchId: string;
      format: string[];
      pages?: number;
      language?: string;
      edition?: string;
      coverUrl?: string;
      pdfData?: string;
      coverData?: string;
      publishedDate: string;
    }) => {
      if (!connection || !connected) return;
      connection.reducers.addBook({
        title: args.title,
        author: args.author,
        isbn: args.isbn,
        category: { tag: args.category } as never,
        publishedDate: args.publishedDate,
        publisher: args.publisher,
        totalCopies: args.totalCopies,
        description: args.description ?? undefined,
        location: args.location,
        branchId: args.branchId,
        format: args.format.map((f) => ({ tag: f })) as never,
        pages: args.pages ?? undefined,
        language: args.language ?? undefined,
        edition: args.edition ?? undefined,
        coverUrl: args.coverUrl ?? undefined,
        pdfData: args.pdfData ?? undefined,
        coverData: args.coverData ?? undefined,
      });
    },
    [connection, connected],
  );
}

export function useUpdateBook() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (args: {
      id: string;
      title: string;
      author: string;
      isbn: string;
      category: string;
      publishedDate: string;
      publisher: string;
      totalCopies: number;
      availableCopies: number;
      status: string;
      description?: string;
      location: string;
      branchId: string;
      format: string[];
      pages?: number;
      language?: string;
      edition?: string;
      coverUrl?: string;
      pdfData?: string;
      coverData?: string;
    }) => {
      if (!connection || !connected) return;
      connection.reducers.updateBook({
        id: args.id,
        title: args.title,
        author: args.author,
        isbn: args.isbn,
        category: { tag: args.category } as never,
        publishedDate: args.publishedDate,
        publisher: args.publisher,
        totalCopies: args.totalCopies,
        availableCopies: args.availableCopies,
        status: { tag: args.status } as never,
        description: args.description ?? undefined,
        location: args.location,
        branchId: args.branchId,
        format: args.format.map((f) => ({ tag: f })) as never,
        pages: args.pages ?? undefined,
        language: args.language ?? undefined,
        edition: args.edition ?? undefined,
        coverUrl: args.coverUrl ?? undefined,
        pdfData: args.pdfData ?? undefined,
        coverData: args.coverData ?? undefined,
      });
    },
    [connection, connected],
  );
}

export function useDeleteBook() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (id: string) => {
      if (!connection || !connected) return;
      connection.reducers.deleteBook({ id });
    },
    [connection, connected],
  );
}

export function useCheckoutBook() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (bookId: string, userId: string, branchId: string, dueDate: string) => {
      if (!connection || !connected) return;
      connection.reducers.checkoutBook({ bookId, userId, branchId, dueDate });
    },
    [connection, connected],
  );
}

export function useCheckinBook() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (recordId: string, fine?: number) => {
      if (!connection || !connected) return;
      connection.reducers.checkinBook({ recordId, fine: fine ?? undefined });
    },
    [connection, connected],
  );
}

export function useRenewBook() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (recordId: string, newDueDate: string) => {
      if (!connection || !connected) return;
      connection.reducers.renewBook({ recordId, newDueDate });
    },
    [connection, connected],
  );
}

export function useAddRating() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (bookId: string, userId: string, rating: number) => {
      if (!connection || !connected) return;
      connection.reducers.addRating({ bookId, userId, rating });
    },
    [connection, connected],
  );
}

export function useAddUser() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (args: {
      clerkId: string;
      name: string;
      email: string;
      role: string;
      phone?: string;
      membershipType: string;
    }) => {
      if (!connection || !connected) return;
      connection.reducers.addUser({
        clerkId: args.clerkId,
        name: args.name,
        email: args.email,
        role: { tag: args.role } as never,
        phone: args.phone ?? undefined,
        membershipType: { tag: args.membershipType } as never,
      });
    },
    [connection, connected],
  );
}

export function useUpdateUser() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (args: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      address?: string;
      bio?: string;
      registerNumber?: string;
      department?: string;
    }) => {
      if (!connection || !connected) return;
      connection.reducers.updateUser({
        id: args.id,
        name: args.name,
        email: args.email,
        phone: args.phone ?? undefined,
        address: args.address ?? undefined,
        bio: args.bio ?? undefined,
        registerNumber: args.registerNumber ?? undefined,
        department: args.department ?? undefined,
      });
    },
    [connection, connected],
  );
}

export function useSuspendUser() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (id: string) => {
      if (!connection || !connected) return;
      connection.reducers.suspendUser({ id });
    },
    [connection, connected],
  );
}

export function useActivateUser() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (id: string) => {
      if (!connection || !connected) return;
      connection.reducers.activateUser({ id });
    },
    [connection, connected],
  );
}

export function useAddBranch() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (args: {
      name: string;
      address: string;
      city: string;
      phone: string;
      email: string;
      manager: string;
      openHours: string;
    }) => {
      if (!connection || !connected) return;
      connection.reducers.addBranch({
        name: args.name,
        address: args.address,
        city: args.city,
        phone: args.phone,
        email: args.email,
        manager: args.manager,
        openHours: args.openHours,
      });
    },
    [connection, connected],
  );
}

export function useUpdateBranch() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (args: {
      id: string;
      name: string;
      address: string;
      city: string;
      phone: string;
      email: string;
      manager: string;
      openHours: string;
      status: string;
    }) => {
      if (!connection || !connected) return;
      connection.reducers.updateBranch({
        id: args.id,
        name: args.name,
        address: args.address,
        city: args.city,
        phone: args.phone,
        email: args.email,
        manager: args.manager,
        openHours: args.openHours,
        status: { tag: args.status } as never,
      });
    },
    [connection, connected],
  );
}

export function useCreateNotification() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (args: {
      userId: string;
      notificationType: string;
      title: string;
      message: string;
      date: string;
    }) => {
      if (!connection || !connected) return;
      connection.reducers.createNotification({
        userId: args.userId,
        notificationType: { tag: args.notificationType } as never,
        title: args.title,
        message: args.message,
        date: args.date,
      });
    },
    [connection, connected],
  );
}

export function useMarkNotificationRead() {
  const { connection, connected } = useSpacetimeDB();
  return useCallback(
    (id: string) => {
      if (!connection || !connected) return;
      connection.reducers.markNotificationRead({ id });
    },
    [connection, connected],
  );
}

export * from "./hooks/use-debounce";
export * from "./hooks/use-ensure-user";
