"use client";

import React, { useState } from "react";
import { Wand2, BookOpen } from "lucide-react";
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

      <section className={styles.panel} aria-label={t("user.aiGenerate.modes.ai")}>
        <h2 className={styles.panelTitle}>{t("user.aiGenerate.ai.promptTitle")}</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className={textareaClass}
          placeholder={t("user.aiGenerate.ai.placeholder") || "e.g. A dystopian novel about a society where books are banned..."}
          aria-label={t("user.aiGenerate.ai.promptTitle")}
        />
        <div className={styles.marginTop12}>
          <Button onClick={handleGenerate} disabled={loading} loading={loading}>
            {loading ? t("user.aiGenerate.ai.generating") : t("user.aiGenerate.ai.generate")}
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
          <p className={styles.resultAuthor}>{t("user.bookDetails.by")} {result.author}</p>

          <h3 className={styles.resultHeading}>{t("user.aiGenerate.ai.synopsis")}</h3>
          <p className={styles.resultText}>{result.synopsis}</p>

          <h3 className={styles.resultHeading}>{t("user.aiGenerate.ai.chapters")}</h3>
          <ol className={styles.chapterList}>
            {result.chapters.map((ch, i) => (
              <li key={i}>{ch}</li>
            ))}
          </ol>

          <div className={styles.formActions}>
            {saved ? (
              <span className={styles.savedText} role="status">
                {t("user.aiGenerate.ai.saved")}
              </span>
            ) : (
              <Button onClick={handleSaveGenerated}>
                {t("user.aiGenerate.ai.save")}
              </Button>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
