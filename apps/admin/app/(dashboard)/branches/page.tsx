"use client";

import React, { useState } from "react";
import { Building2, Plus, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@shelf-ai/ui/page-header";
import { Button } from "@shelf-ai/ui/button";
import { Modal } from "@shelf-ai/ui/modal";
import { FormField, inputClass } from "@shelf-ai/ui/form-field";
import { PhoneInput } from "@shelf-ai/ui/phone-input";
import { Badge } from "@shelf-ai/ui/badge";
import { useBranches, useAddBranch } from "@shelf-ai/shared/hooks";
import { addBranchSchema, type AddBranchInput } from "@shelf-ai/shared/schemas";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

export default function BranchesPage() {
  const { t } = useTranslation();
  const branches = useBranches();
  const addBranch = useAddBranch();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddBranchInput>({
    resolver: zodResolver(addBranchSchema),
  });

  const onSubmit = (data: AddBranchInput) => {
    addBranch({
      name: data.name,
      address: data.address,
      city: data.city,
      phone: data.phone,
      email: data.email,
      manager: data.manager,
      openHours: data.openHours,
    });
    setModalOpen(false);
    reset();
  };

  return (
    <main
      className={styles.container}
      role="main"
      aria-label={t("admin.branches.title")}
    >
      <PageHeader
        title={t("admin.branches.title")}
        subtitle={t("admin.branches.subtitle", { count: branches.length })}
        icon={<Building2 size={22} />}
        action={
          <Button
            onClick={() => {
              reset();
              setModalOpen(true);
            }}
          >
            <Plus size={16} className={styles.marginRight} />{" "}
            {t("admin.branches.addBranch")}
          </Button>
        }
      />

      <section className={styles.grid} aria-label="Branches List">
        {branches.map((branch, idx) => (
          <article
            key={branch.id}
            className={styles.card}
            style={{ animation: `fadeIn 0.4s ease ${idx * 0.05}s both` }}
          >
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{branch.name}</h2>
              <Badge
                label={branch.status.tag}
                color={
                  branch.status.tag === "Active"
                    ? "var(--stat-green)"
                    : "var(--stat-red)"
                }
              />
            </div>
            <div className={styles.cardDetails}>
              <div className={styles.detailRow}>
                <MapPin size={13} aria-hidden="true" /> {branch.address},{" "}
                {branch.city}
              </div>
              <div className={styles.detailRow}>
                <Phone size={13} aria-hidden="true" /> {branch.phone}
              </div>
              <div className={styles.detailRow}>
                <Mail size={13} aria-hidden="true" /> {branch.email}
              </div>
              <div className={styles.detailRow}>
                <Clock size={13} aria-hidden="true" /> {branch.openHours}
              </div>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.footerText}>
                {t("admin.branches.details.books")}:{" "}
                <strong>{branch.totalBooks}</strong>
              </span>
              <span className={styles.footerText}>
                {t("admin.branches.details.members")}:{" "}
                <strong>{branch.totalMembers}</strong>
              </span>
              <span className={styles.footerText}>
                {t("admin.branches.details.manager")}:{" "}
                <strong>{branch.manager}</strong>
              </span>
            </div>
          </article>
        ))}
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t("admin.branches.addBranch")}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <FormField
            label={t("admin.branches.form.name")}
            error={errors.name?.message}
          >
            <input {...register("name")} className={inputClass} />
          </FormField>
          <div className={styles.formGrid}>
            <FormField
              label={t("admin.branches.form.address")}
              error={errors.address?.message}
            >
              <input {...register("address")} className={inputClass} />
            </FormField>
            <FormField
              label={t("admin.branches.form.city")}
              error={errors.city?.message}
            >
              <input {...register("city")} className={inputClass} />
            </FormField>
          </div>
          <div className={styles.formGrid}>
            <FormField
              label={t("admin.branches.form.phone")}
              error={errors.phone?.message}
            >
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    defaultCountry="US"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormField>
            <FormField
              label={t("admin.branches.form.email")}
              error={errors.email?.message}
            >
              <input
                type="email"
                {...register("email")}
                className={inputClass}
              />
            </FormField>
          </div>
          <div className={styles.formGrid}>
            <FormField
              label={t("admin.branches.form.manager")}
              error={errors.manager?.message}
            >
              <input {...register("manager")} className={inputClass} />
            </FormField>
            <FormField
              label={t("admin.branches.form.openHours")}
              error={errors.openHours?.message}
            >
              <input {...register("openHours")} className={inputClass} />
            </FormField>
          </div>
          <div className={styles.formActions}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              {t("admin.branches.form.cancel")}
            </Button>
            <Button type="submit">{t("admin.branches.form.add")}</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
