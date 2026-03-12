"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable } from "@shelf-ai/ui/data-table";
import { PageHeader } from "@shelf-ai/ui/page-header";
import { SearchInput } from "@shelf-ai/ui/search-input";
import { FilterPills } from "@shelf-ai/ui/filter-pills";
import { Button } from "@shelf-ai/ui/button";
import { Modal } from "@shelf-ai/ui/modal";
import { Select } from "@shelf-ai/ui/select";
import { DatePicker } from "@shelf-ai/ui/date-picker";
import { format } from "date-fns";
import { FormField, inputClass, textareaClass } from "@shelf-ai/ui/form-field";
import { Badge } from "@shelf-ai/ui/badge";
import { BookCover } from "@shelf-ai/ui/book-cover";
import {
  useBooks,
  useAddBook,
  useUpdateBook,
  useDeleteBook,
  useBranches,
} from "@shelf-ai/shared/hooks";
import { addBookSchema, type AddBookInput } from "@shelf-ai/shared/schemas";
import {
  BOOK_CATEGORIES,
  STATUS_COLORS,
  BOOK_FORMATS,
} from "@shelf-ai/shared/constants";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

type BookRow = ReturnType<typeof useBooks>[number];

export default function BooksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";

  const books = useBooks();
  const branches = useBranches();
  const addBook = useAddBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<BookRow | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddBookInput>({
    resolver: zodResolver(addBookSchema),
  });

  const filtered = useMemo(() => {
    let result = books;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q),
      );
    }
    if (categoryFilter) {
      result = result.filter((b) => b.category.tag === categoryFilter);
    }
    return result;
  }, [books, search, categoryFilter]);

  const setSearch = (q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    router.replace(`/books?${params.toString()}`);
  };

  const setCategory = (c: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (c) params.set("category", c);
    else params.delete("category");
    router.replace(`/books?${params.toString()}`);
  };

  const onSubmit = (data: AddBookInput) => {
    const formatArr = data.format ? [data.format] : ["Hardcopy"];
    if (editBook) {
      updateBook({
        id: editBook.id,
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        publishedDate: data.publishedDate,
        publisher: data.publisher,
        totalCopies: data.totalCopies,
        availableCopies: editBook.availableCopies,
        status: editBook.status.tag,
        description: data.description,
        location: data.location,
        branchId: data.branchId,
        format: formatArr,
        pages: data.pages,
        language: data.language,
        edition: data.edition,
        coverUrl: data.coverUrl,
      });
    } else {
      addBook({
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        publishedDate: data.publishedDate,
        publisher: data.publisher,
        totalCopies: data.totalCopies,
        description: data.description,
        location: data.location,
        branchId: data.branchId,
        format: formatArr,
        pages: data.pages,
        language: data.language,
        edition: data.edition,
        coverUrl: data.coverUrl,
      });
    }
    setModalOpen(false);
    setEditBook(null);
    reset();
  };

  const columns: ColumnDef<BookRow, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: t("admin.books.columns.book"),
        cell: ({ row }) => (
          <div className={styles.bookCell}>
            <BookCover title={row.original.title} size="sm" />
            <div>
              <div className={styles.bookTitle}>{row.original.title}</div>
              <div className={styles.bookAuthor}>{row.original.author}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "isbn",
        header: t("admin.books.columns.isbn"),
        cell: ({ getValue }) => (
          <span className={styles.isbnText}>{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "category",
        header: t("admin.books.columns.category"),
        cell: ({ row }) => (
          <Badge label={row.original.category.tag} color="var(--accent)" />
        ),
      },
      {
        accessorKey: "status",
        header: t("admin.books.columns.status"),
        cell: ({ row }) => {
          const tag = row.original.status.tag;
          const color =
            STATUS_COLORS[tag as keyof typeof STATUS_COLORS] ||
            "var(--text-muted)";
          return <Badge label={tag} color={color} />;
        },
      },
      {
        accessorKey: "availableCopies",
        header: t("admin.books.columns.available"),
        cell: ({ row }) => (
          <span>
            {row.original.availableCopies} / {row.original.totalCopies}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className={styles.actionCell}>
            <Button
              variant="secondary"
              onClick={() => {
                setEditBook(row.original);
                reset({
                  title: row.original.title,
                  author: row.original.author,
                  isbn: row.original.isbn,
                  category: row.original.category.tag,
                  publishedDate: row.original.publishedDate,
                  publisher: row.original.publisher,
                  totalCopies: row.original.totalCopies,
                  description: row.original.description ?? undefined,
                  location: row.original.location,
                  branchId: row.original.branchId,
                  format: row.original.format[0]?.tag,
                  pages: row.original.pages ?? undefined,
                  language: row.original.language ?? undefined,
                  edition: row.original.edition ?? undefined,
                  coverUrl: row.original.coverUrl ?? undefined,
                } as AddBookInput);
                setModalOpen(true);
              }}
              className={`${styles.actionButton} ${styles.editButton}`}
              aria-label={`Edit book ${row.original.title}`}
            >
              <Edit size={15} aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => deleteBook(row.original.id)}
              className={`${styles.actionButton} ${styles.deleteButton}`}
              aria-label={`Delete book ${row.original.title}`}
            >
              <Trash2 size={15} aria-hidden="true" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteBook, reset, t],
  );

  return (
    <main
      className={styles.container}
      role="main"
      aria-label={t("admin.books.title")}
    >
      <PageHeader
        title={t("admin.books.title")}
        subtitle={t("admin.books.subtitle", { count: books.length })}
        icon={<BookOpen size={22} />}
        action={
          <Button
            onClick={() => {
              setEditBook(null);
              reset();
              setModalOpen(true);
            }}
          >
            <Plus size={16} className={styles.marginRight} />{" "}
            {t("admin.books.addBook")}
          </Button>
        }
      />

      <section
        className={styles.searchFilterContainer}
        aria-label="Search and Filters"
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("admin.books.search")}
        />
        <FilterPills
          options={BOOK_CATEGORIES}
          selected={categoryFilter}
          onChange={setCategory}
        />
      </section>

      <section aria-label="Books Data">
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={10}
          emptyMessage={t("admin.books.noBooks")}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditBook(null);
          }}
          title={
            editBook ? t("admin.books.editBook") : t("admin.books.addBook")
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGrid2}>
              <FormField
                label={t("admin.books.form.title")}
                error={errors.title?.message}
              >
                <input
                  {...register("title")}
                  defaultValue={editBook?.title}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label={t("admin.books.form.author")}
                error={errors.author?.message}
              >
                <input
                  {...register("author")}
                  defaultValue={editBook?.author}
                  className={inputClass}
                />
              </FormField>
            </div>
            <div className={styles.formGrid2}>
              <FormField
                label={t("admin.books.form.isbn")}
                error={errors.isbn?.message}
              >
                <input
                  {...register("isbn")}
                  defaultValue={editBook?.isbn}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label={t("admin.books.form.category")}
                error={errors.category?.message}
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={BOOK_CATEGORIES.map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      value={
                        field.value
                          ? { label: field.value, value: field.value }
                          : null
                      }
                      onChange={(val) => field.onChange(val?.value)}
                      onBlur={field.onBlur}
                      placeholder={t("admin.books.form.selectCategory")}
                    />
                  )}
                />
              </FormField>
            </div>
            <div className={styles.formGrid3}>
              <FormField
                label={t("admin.books.form.publisher")}
                error={errors.publisher?.message}
              >
                <input
                  {...register("publisher")}
                  defaultValue={editBook?.publisher}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label={t("admin.books.form.publishedDate")}
                error={errors.publishedDate?.message}
              >
                <Controller
                  name="publishedDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      placeholder={t("admin.books.form.selectDate")}
                    />
                  )}
                />
              </FormField>
              <FormField
                label={t("admin.books.form.copies")}
                error={errors.totalCopies?.message}
              >
                <input
                  type="number"
                  {...register("totalCopies", { valueAsNumber: true })}
                  defaultValue={editBook?.totalCopies}
                  className={inputClass}
                />
              </FormField>
            </div>
            <div className={styles.formGrid2}>
              <FormField
                label={t("admin.books.form.location")}
                error={errors.location?.message}
              >
                <input
                  {...register("location")}
                  defaultValue={editBook?.location}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label={t("admin.books.form.branch")}
                error={errors.branchId?.message}
              >
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={branches.map((b) => ({
                        label: b.name,
                        value: b.id,
                      }))}
                      value={
                        field.value
                          ? {
                              label:
                                branches.find((b) => b.id === field.value)
                                  ?.name || "",
                              value: field.value,
                            }
                          : null
                      }
                      onChange={(val) => field.onChange(val?.value)}
                      onBlur={field.onBlur}
                      placeholder={t("admin.books.form.selectBranch")}
                    />
                  )}
                />
              </FormField>
            </div>
            <FormField label={t("admin.books.form.description")}>
              <textarea
                {...register("description")}
                defaultValue={editBook?.description ?? ""}
                rows={3}
                className={textareaClass}
              />
            </FormField>
            <div className={styles.formGrid3}>
              <FormField label={t("admin.books.form.pages")}>
                <input
                  type="number"
                  {...register("pages", { valueAsNumber: true })}
                  defaultValue={editBook?.pages ?? undefined}
                  className={inputClass}
                />
              </FormField>
              <FormField label={t("admin.books.form.language")}>
                <input
                  {...register("language")}
                  defaultValue={editBook?.language ?? ""}
                  className={inputClass}
                />
              </FormField>
              <FormField label={t("admin.books.form.format")}>
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={BOOK_FORMATS.map((f) => ({
                        label: f,
                        value: f,
                      }))}
                      value={
                        field.value
                          ? { label: field.value, value: field.value }
                          : null
                      }
                      onChange={(val) => field.onChange(val?.value)}
                      onBlur={field.onBlur}
                      placeholder={t("admin.books.form.selectFormat")}
                    />
                  )}
                />
              </FormField>
            </div>
            <div className={styles.formActions}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditBook(null);
                }}
              >
                {t("admin.books.form.cancel")}
              </Button>
              <Button type="submit">
                {editBook
                  ? t("admin.books.form.update")
                  : t("admin.books.form.add")}
              </Button>
            </div>
          </form>
        </Modal>
      </section>
    </main>
  );
}
