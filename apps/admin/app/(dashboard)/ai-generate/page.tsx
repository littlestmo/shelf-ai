"use client";

import React, { useState } from "react";
import { Sparkles, Wand2, Upload, FileText } from "lucide-react";
import { PageHeader } from "@shelf-ai/ui/page-header";
import { Button } from "@shelf-ai/ui/button";
import { Select } from "@shelf-ai/ui/select";
import { FormField, inputClass, textareaClass } from "@shelf-ai/ui/form-field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddBook, useBranches } from "@shelf-ai/shared/hooks";
import { addBookSchema, type AddBookInput } from "@shelf-ai/shared/schemas";
import { BOOK_CATEGORIES } from "@shelf-ai/shared/constants";
import { DatePicker } from "@shelf-ai/ui/date-picker";
import { format } from "date-fns";
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AiGeneratePage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AiBookResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const addBook = useAddBook();
  const branches = useBranches();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddBookInput>({
    resolver: zodResolver(addBookSchema),
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setAiResult(null);
    setAiError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Generation failed");
      }

      const result: AiBookResult = await response.json();
      setAiResult(result);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAiBook = () => {
    if (!aiResult || branches.length === 0) return;
    addBook({
      title: aiResult.title,
      author: aiResult.author,
      isbn: aiResult.isbn,
      category: aiResult.category,
      publishedDate: format(new Date(), "yyyy-MM-dd"),
      publisher: aiResult.publisher,
      totalCopies: 3,
      description: aiResult.synopsis,
      location: "A-1",
      branchId: branches[0]!.id,
      format: ["Hardcopy"],
      pages: aiResult.pages,
      language: aiResult.language,
      edition: aiResult.edition,
    });
    setSaved(true);
  };

  const onManualSubmit = async (data: AddBookInput) => {
    const formatArr = data.format ? [data.format] : ["Hardcopy"];
    let pdfBase64Data: string | undefined;

    if (pdfFile) {
      if (!formatArr.includes("Ebook")) formatArr.push("Ebook");
      pdfBase64Data = await fileToBase64(pdfFile);
    }

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
      pdfData: pdfBase64Data,
    });
    reset();
    setPdfFile(null);
  };

  return (
    <main
      className={styles.container}
      role="main"
      aria-label={t("admin.aiGenerate.title")}
    >
      <PageHeader
        title={t("admin.aiGenerate.title")}
        subtitle={t("admin.aiGenerate.subtitle")}
        icon={<Sparkles size={22} aria-hidden="true" />}
      />

      <nav className={styles.modeToggle} aria-label="Generation Mode">
        <Button
          variant="secondary"
          onClick={() => setMode("ai")}
          className={`${styles.modeButton} ${mode === "ai" ? styles.modeButtonActive : styles.modeButtonInactive}`}
          aria-pressed={mode === "ai"}
        >
          <Wand2 size={14} className={styles.buttonIcon} aria-hidden="true" />{" "}
          {t("admin.aiGenerate.tabs.ai")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setMode("manual")}
          className={`${styles.modeButton} ${mode === "manual" ? styles.modeButtonActive : styles.modeButtonInactive}`}
          aria-pressed={mode === "manual"}
        >
          <Upload size={14} className={styles.buttonIcon} aria-hidden="true" />{" "}
          {t("admin.aiGenerate.tabs.manual")}
        </Button>
      </nav>

      <section aria-live="polite">
        {mode === "ai" ? (
          <div className={styles.form}>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>
                {t("admin.aiGenerate.ai.promptTitle")}
              </h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("admin.aiGenerate.ai.placeholder")}
                rows={4}
                className={textareaClass}
              />
              <div className={styles.marginTop12}>
                <Button
                  onClick={handleGenerate}
                  loading={generating}
                  disabled={!prompt.trim() || prompt.trim().length < 10}
                >
                  <Sparkles size={15} className={styles.buttonIcon} />{" "}
                  {t("admin.aiGenerate.ai.generate")}
                </Button>
              </div>
            </div>

            {aiError && (
              <div
                className={styles.resultPanel}
                role="alert"
                style={{ borderLeft: "3px solid var(--stat-red)" }}
              >
                <p style={{ color: "var(--stat-red)" }}>{aiError}</p>
              </div>
            )}

            {aiResult && (
              <div className={styles.resultPanel}>
                <h3 className={styles.resultTitle}>{aiResult.title}</h3>
                <p className={styles.resultAuthor}>
                  {t("admin.aiGenerate.ai.by", { author: aiResult.author })}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                    margin: "0.75rem 0",
                  }}
                >
                  <span
                    style={{
                      background: "var(--surface-alt)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {aiResult.category}
                  </span>
                  <span
                    style={{
                      background: "var(--surface-alt)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {aiResult.pages} pages
                  </span>
                  <span
                    style={{
                      background: "var(--surface-alt)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    ISBN: {aiResult.isbn}
                  </span>
                </div>

                <h4 className={styles.resultHeading}>
                  {t("admin.aiGenerate.ai.synopsis")}
                </h4>
                <p className={styles.resultText}>{aiResult.synopsis}</p>

                <h4 className={styles.resultHeading}>
                  {t("admin.aiGenerate.ai.chapters")}
                </h4>
                <ol className={styles.chapterList}>
                  {aiResult.chapters.map((ch, i) => (
                    <li key={i}>{ch}</li>
                  ))}
                </ol>

                <div style={{ marginTop: "1rem" }}>
                  {saved ? (
                    <span
                      role="status"
                      style={{ color: "var(--stat-green)", fontWeight: 600 }}
                    >
                      ✓ Book saved to library
                    </span>
                  ) : (
                    <Button
                      onClick={handleSaveAiBook}
                      disabled={branches.length === 0}
                    >
                      <Sparkles size={14} className={styles.buttonIcon} /> Save
                      to Library
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.panel}>
            <form
              onSubmit={handleSubmit(onManualSubmit)}
              className={styles.form}
            >
              <div
                className={`${styles.dropzone} ${pdfFile ? styles.dropzoneActive : styles.dropzoneInactive}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file?.type === "application/pdf") setPdfFile(file);
                }}
                role="region"
                aria-label="PDF upload area"
              >
                {pdfFile ? (
                  <>
                    <FileText size={36} color="var(--accent)" aria-hidden="true" />
                    <div className={styles.panelTitle}>{pdfFile.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPdfFile(null)}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload size={36} color="var(--text-muted)" aria-hidden="true" />
                    <div className={styles.panelTitle}>Upload PDF (optional)</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Drag and drop or browse for a PDF file
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => document.getElementById("admin-pdf-upload")?.click()}
                    >
                      Browse Files
                    </Button>
                    <input
                      id="admin-pdf-upload"
                      type="file"
                      accept=".pdf"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) setPdfFile(e.target.files[0]);
                      }}
                    />
                  </>
                )}
              </div>
              <div className={styles.formGrid2}>
                <FormField
                  label={t("admin.books.form.title")}
                  error={errors.title?.message}
                >
                  <input {...register("title")} className={inputClass} />
                </FormField>
                <FormField
                  label={t("admin.books.form.author")}
                  error={errors.author?.message}
                >
                  <input {...register("author")} className={inputClass} />
                </FormField>
              </div>
              <div className={styles.formGrid2}>
                <FormField
                  label={t("admin.books.form.isbn")}
                  error={errors.isbn?.message}
                >
                  <input {...register("isbn")} className={inputClass} />
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
                  <input {...register("publisher")} className={inputClass} />
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
                    className={inputClass}
                  />
                </FormField>
              </div>
              <div className={styles.formGrid2}>
                <FormField
                  label={t("admin.books.form.location")}
                  error={errors.location?.message}
                >
                  <input {...register("location")} className={inputClass} />
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
                  rows={3}
                  className={textareaClass}
                />
              </FormField>
              <div className={styles.formActions}>
                <Button type="submit">{t("admin.books.form.add")}</Button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
