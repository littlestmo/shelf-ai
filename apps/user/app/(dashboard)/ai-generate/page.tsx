"use client";

import React, { useState } from "react";
import { Wand2, BookOpen, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@shelf-ai/ui/page-header";
import { Button } from "@shelf-ai/ui/button";
import { Select } from "@shelf-ai/ui/select";
import { DatePicker } from "@shelf-ai/ui/date-picker";
import { format } from "date-fns";
import { FormField, inputClass, textareaClass } from "@shelf-ai/ui/form-field";
import { useAddBook, useBranches } from "@shelf-ai/shared/hooks";
import { addBookSchema, type AddBookInput } from "@shelf-ai/shared/schemas";
import { BOOK_CATEGORIES } from "@shelf-ai/shared/constants";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

interface AiBookResult {
  title: string;
  author: string;
  synopsis: string;
  chapters: string[];
  category: string;
  isbn: string;
  pages: number;
  language: string;
  publisher: string;
  edition: string;
}

export default function AiGeneratePage() {
  const { t } = useTranslation();
  const addBook = useAddBook();
  const branches = useBranches();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiBookResult | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<"ai" | "manual">("ai");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<AddBookInput>({
    resolver: zodResolver(addBookSchema),
  });

  const handleGenerate = async () => {
    if (prompt.trim().length < 10) {
      setError("Prompt must be at least 10 characters.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setSaved(false);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Generation failed");
      }

      const data: AiBookResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGenerated = () => {
    if (!result) return;
    addBook({
      title: result.title,
      author: result.author,
      isbn: result.isbn,
      category: result.category,
      publishedDate: format(new Date(), "yyyy-MM-dd"),
      publisher: result.publisher,
      totalCopies: 1,
      description: result.synopsis,
      location: "Digital",
      branchId: branches[0]?.id || "",
      format: ["Ebook"],
      pages: result.pages,
      language: result.language,
      edition: result.edition,
    });
    setSaved(true);
  };

  const handleManualSubmit = (data: AddBookInput) => {
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
      format: data.format ? [data.format] : ["Hardcopy"],
      pages: data.pages,
      language: data.language,
      edition: data.edition,
    });
    resetForm();
  };

  return (
    <main className={styles.container} role="main" aria-label="AI Book Generator">
      <PageHeader
        title={t("user.aiGenerate.title") || "AI Book Generator"}
        subtitle={t("user.aiGenerate.subtitle") || "Generate or manually add books to the library"}
        icon={<Wand2 size={22} aria-hidden="true" />}
      />

      <nav className={styles.modeToggle} aria-label="Creation mode">
        {(["ai", "manual"] as const).map((m) => (
          <button
            key={m}
            className={`${styles.modeButton} ${mode === m ? styles.modeButtonActive : styles.modeButtonInactive}`}
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            type="button"
          >
            {m === "ai" ? (
              <Wand2 size={14} className={styles.buttonIcon} aria-hidden="true" />
            ) : (
              <BookOpen size={14} className={styles.buttonIcon} aria-hidden="true" />
            )}
            {m === "ai" ? "AI Generate" : "Manual Entry"}
          </button>
        ))}
      </nav>

      {mode === "ai" && (
        <>
          <section className={styles.panel} aria-label="AI prompt">
            <h2 className={styles.panelTitle}>Describe the book you want to generate</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className={textareaClass}
              placeholder="e.g. A dystopian novel about a society where books are banned..."
              aria-label="Book description prompt"
            />
            <div className={styles.marginTop12}>
              <Button onClick={handleGenerate} disabled={loading} loading={loading}>
                {loading ? "Generating..." : "Generate Book"}
              </Button>
            </div>
            {error && (
              <p className={styles.errorText} role="alert">
                {error}
              </p>
            )}
          </section>

          {result && (
            <section className={styles.resultPanel} aria-label="Generated book result">
              <h2 className={styles.resultTitle}>{result.title}</h2>
              <p className={styles.resultAuthor}>by {result.author}</p>

              <h3 className={styles.resultHeading}>Synopsis</h3>
              <p className={styles.resultText}>{result.synopsis}</p>

              <h3 className={styles.resultHeading}>Chapters</h3>
              <ol className={styles.chapterList}>
                {result.chapters.map((ch, i) => (
                  <li key={i}>{ch}</li>
                ))}
              </ol>

              <div className={styles.formActions}>
                {saved ? (
                  <span className={styles.savedText} role="status">
                    ✓ Saved to library
                  </span>
                ) : (
                  <Button onClick={handleSaveGenerated}>
                    Save to Library
                  </Button>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {mode === "manual" && (
        <section className={styles.panel} aria-label="Manual book entry">
          <form onSubmit={handleSubmit(handleManualSubmit)} className={styles.form}>
            <div className={styles.formGrid2}>
              <FormField label="Title" error={errors.title?.message}>
                <input {...register("title")} className={inputClass} />
              </FormField>
              <FormField label="Author" error={errors.author?.message}>
                <input {...register("author")} className={inputClass} />
              </FormField>
            </div>
            <div className={styles.formGrid2}>
              <FormField label="ISBN" error={errors.isbn?.message}>
                <input {...register("isbn")} className={inputClass} />
              </FormField>
              <FormField label="Category" error={errors.category?.message}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={BOOK_CATEGORIES.map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      value={field.value ? { label: field.value, value: field.value } : null}
                      onChange={(val) => field.onChange(val?.value)}
                      onBlur={field.onBlur}
                      placeholder="Select category"
                    />
                  )}
                />
              </FormField>
            </div>
            <div className={styles.formGrid3}>
              <FormField label="Publisher" error={errors.publisher?.message}>
                <input {...register("publisher")} className={inputClass} />
              </FormField>
              <FormField label="Published Date" error={errors.publishedDate?.message}>
                <Controller
                  name="publishedDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      placeholder="Select date"
                    />
                  )}
                />
              </FormField>
              <FormField label="Copies" error={errors.totalCopies?.message}>
                <input
                  type="number"
                  {...register("totalCopies", { valueAsNumber: true })}
                  className={inputClass}
                />
              </FormField>
            </div>
            <div className={styles.formGrid2}>
              <FormField label="Location">
                <input {...register("location")} className={inputClass} />
              </FormField>
              <FormField label="Branch">
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
                              label: branches.find((b) => b.id === field.value)?.name || "",
                              value: field.value,
                            }
                          : null
                      }
                      onChange={(val) => field.onChange(val?.value)}
                      onBlur={field.onBlur}
                      placeholder="Select branch"
                    />
                  )}
                />
              </FormField>
            </div>
            <FormField label="Description">
              <textarea {...register("description")} rows={3} className={textareaClass} />
            </FormField>
            <div className={styles.formActions}>
              <Button type="submit">Add Book</Button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
