"use client";

import React, { useState } from "react";
import { Upload, FileText, BookPlus } from "lucide-react";
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

export default function ContributePage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"upload" | "manual">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.name.endsWith(".epub"))
    ) {
      setUploadedFile(file);
    }
  };

  const onSubmit = (data: AddBookInput) => {
    const formatArr = data.format ? [data.format] : ["Hardcopy"];
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
    reset();
    setUploadedFile(null);
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title={t("user.contribute.title")}
        subtitle={t("user.contribute.subtitle")}
        icon={<Upload size={22} />}
      />

      <div className={styles.modeToggle}>
        <button
          onClick={() => setMode("upload")}
          className={`${styles.modeButton} ${mode === "upload" ? styles.modeButtonActive : styles.modeButtonInactive}`}
        >
          <Upload size={14} className={styles.buttonIcon} />{" "}
          {t("user.contribute.modes.upload")}
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`${styles.modeButton} ${mode === "manual" ? styles.modeButtonActive : styles.modeButtonInactive}`}
        >
          <BookPlus size={14} className={styles.buttonIcon} />{" "}
          {t("user.contribute.modes.manual")}
        </button>
      </div>

      {mode === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : styles.dropzoneInactive}`}
        >
          {uploadedFile ? (
            <>
              <FileText size={40} color="var(--accent)" />
              <div className={styles.fileTitle}>{uploadedFile.name}</div>
              <div className={styles.fileSize}>
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
              <Button
                onClick={() => setUploadedFile(null)}
                variant="secondary"
                size="sm"
              >
                {t("user.contribute.upload.remove")}
              </Button>
            </>
          ) : (
            <>
              <Upload
                size={40}
                color="var(--text-muted)"
                className={styles.uploadIcon}
              />
              <div className={styles.fileTitle}>
                {t("user.contribute.upload.dragDrop")}
              </div>
              <div className={styles.fileSize}>
                {t("user.contribute.upload.supports")}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {t("user.contribute.upload.browseFiles")}
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.epub"
                className={styles.hiddenInput}
                onChange={(e) => {
                  if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
                }}
              />
            </>
          )}
        </div>
      )}

      {mode === "manual" && (
        <div className={styles.panel}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGrid2}>
              <FormField
                label={t("user.contribute.form.title")}
                error={errors.title?.message}
              >
                <input {...register("title")} className={inputClass} />
              </FormField>
              <FormField
                label={t("user.contribute.form.author")}
                error={errors.author?.message}
              >
                <input {...register("author")} className={inputClass} />
              </FormField>
            </div>
            <div className={styles.formGrid2}>
              <FormField
                label={t("user.contribute.form.isbn")}
                error={errors.isbn?.message}
              >
                <input {...register("isbn")} className={inputClass} />
              </FormField>
              <FormField
                label={t("user.contribute.form.category")}
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
                      placeholder={t("user.contribute.form.selectCategory")}
                    />
                  )}
                />
              </FormField>
            </div>
            <div className={styles.formGrid3}>
              <FormField
                label={t("user.contribute.form.publisher")}
                error={errors.publisher?.message}
              >
                <input {...register("publisher")} className={inputClass} />
              </FormField>
              <FormField
                label={t("user.contribute.form.publishedDate")}
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
                      placeholder={t("user.contribute.form.selectDate")}
                    />
                  )}
                />
              </FormField>
              <FormField
                label={t("user.contribute.form.copies")}
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
                label={t("user.contribute.form.location")}
                error={errors.location?.message}
              >
                <input {...register("location")} className={inputClass} />
              </FormField>
              <FormField
                label={t("user.contribute.form.branch")}
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
                      placeholder={t("user.contribute.form.selectBranch")}
                    />
                  )}
                />
              </FormField>
            </div>
            <FormField label={t("user.contribute.form.description")}>
              <textarea
                {...register("description")}
                rows={3}
                className={textareaClass}
              />
            </FormField>
            <div className={styles.formActions}>
              <Button type="submit">{t("user.contribute.form.submit")}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
