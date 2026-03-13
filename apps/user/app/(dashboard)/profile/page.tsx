"use client";

import React, { useState, useEffect, useCallback } from "react";
import { User } from "lucide-react";
import { PageHeader } from "@shelf-ai/ui/page-header";
import { FormField, inputClass, textareaClass } from "@shelf-ai/ui/form-field";
import { Button } from "@shelf-ai/ui/button";
import { ToggleSwitch } from "@shelf-ai/ui/toggle-switch";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@shelf-ai/ui/select";
import { PhoneInput } from "@shelf-ai/ui/phone-input";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@shelf-ai/shared/schemas";
import { StudentCard } from "@shelf-ai/ui/student-card";
import { TabNavigation, type Tab } from "@shelf-ai/ui/tab-navigation";
import { useUser } from "@clerk/nextjs";
import { useUpdateUser, useEnsureUser } from "@shelf-ai/shared/hooks";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import styles from "./page.module.css";

const NOTIF_STORAGE_KEY = "shelf-ai-notif-settings";

interface NotifSettings {
  email: boolean;
  push: boolean;
  overdue: boolean;
  available: boolean;
  newsletter: boolean;
}

const DEFAULT_NOTIF: NotifSettings = {
  email: true,
  push: true,
  overdue: true,
  available: false,
  newsletter: false,
};

function loadNotifSettings(): NotifSettings {
  if (typeof window === "undefined") return DEFAULT_NOTIF;
  try {
    const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as NotifSettings;
  } catch {
    /* ignored */
  }
  return DEFAULT_NOTIF;
}

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const updateUser = useUpdateUser();

  const TABS: Tab[] = [
    { id: "account", label: t("user.profile.tabs.account") },
    { id: "notifications", label: t("user.profile.tabs.notifications") },
    { id: "interface", label: t("user.profile.tabs.interface") },
  ];

  const [activeTab, setActiveTab] = useState("account");
  const [notifSettings, setNotifSettings] =
    useState<NotifSettings>(DEFAULT_NOTIF);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setNotifSettings(loadNotifSettings());
  }, []);

  const handleNotifChange = useCallback(
    (key: keyof NotifSettings, value: boolean) => {
      setNotifSettings((prev) => {
        const next = { ...prev, [key]: value };
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const dbUser = useEnsureUser(user);

  const getDefaultValues = useCallback((): UpdateProfileInput => {
    if (dbUser) {
      return {
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone ?? "",
        address: dbUser.address ?? "",
        bio: dbUser.bio ?? "",
        registerNumber: dbUser.registerNumber ?? "",
        department: dbUser.department ?? "",
      };
    }
    if (user) {
      return {
        name: user.fullName || "Student Name",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: "+19952508995",
        address: "",
        bio: "I'm a Student",
        registerNumber: "",
        department: "General",
      };
    }
    return {
      name: "",
      department: "General",
      email: "",
      phone: "+19952508995",
      bio: "I'm a Student",
    };
  }, [dbUser, user]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    reset(getDefaultValues());
  }, [dbUser, user, reset, getDefaultValues]);

  const onSubmit = (data: UpdateProfileInput) => {
    if (!dbUser) return;
    updateUser({
      id: dbUser.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      bio: data.bio,
      registerNumber: data.registerNumber,
      department: data.department,
    });
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleReset = () => {
    reset(getDefaultValues());
  };

  const currentName = watch("name") || "Student Name";
  const currentDept = watch("department") || "General";
  const currentPhone = watch("phone");

  const currentLang = i18n.language || "en";

  const handleLanguageChange = (
    val: { label: string; value: string } | null,
  ) => {
    if (!val) return;
    i18n.changeLanguage(val.value);
    localStorage.setItem("shelf-ai-locale", val.value);
    document.documentElement.dir = val.value === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = val.value;
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme.toLowerCase());
  };



  const themeOptions = [
    { key: "dark", label: t("user.profile.interface.themes.dark") },
    { key: "light", label: t("user.profile.interface.themes.light") },
    { key: "system", label: t("user.profile.interface.themes.system") },
  ];

  const langOptions = [
    { label: t("user.profile.interface.languages.en"), value: "en" },
    { label: t("user.profile.interface.languages.ar"), value: "ar" },
  ];

  const notifItems = [
    {
      key: "email" as const,
      label: t("user.profile.notifications.emailLabel"),
      desc: t("user.profile.notifications.emailDesc"),
    },
    {
      key: "push" as const,
      label: t("user.profile.notifications.pushLabel"),
      desc: t("user.profile.notifications.pushDesc"),
    },
    {
      key: "overdue" as const,
      label: t("user.profile.notifications.overdueLabel"),
      desc: t("user.profile.notifications.overdueDesc"),
    },
    {
      key: "available" as const,
      label: t("user.profile.notifications.availableLabel"),
      desc: t("user.profile.notifications.availableDesc"),
    },
    {
      key: "newsletter" as const,
      label: t("user.profile.notifications.newsletterLabel"),
      desc: t("user.profile.notifications.newsletterDesc"),
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeader
        title={t("user.profile.title")}
        subtitle={t("user.profile.subtitle")}
        icon={<User size={22} />}
      />

      <div className={styles.tabsContainer}>
        <TabNavigation
          tabs={TABS}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Profile settings sections"
        />
      </div>

      <div
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className={styles.tabPanel}
      >
        {activeTab === "account" && (
          <div className={styles.accountContainer}>
            <div className={styles.profileHeader}>
              <div className={styles.studentCardWrapper}>
                <StudentCard
                  name={currentName}
                  department={currentDept}
                  studentId={user?.id || "unknown-id"}
                  contactNumber={currentPhone}
                  photoUrl={user?.imageUrl}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.formGrid}>
                <FormField
                  label={t("user.profile.account.fullName")}
                  error={errors.name?.message}
                >
                  <input {...register("name")} className={inputClass} />
                </FormField>
                <FormField
                  label={t("user.profile.account.email")}
                  error={errors.email?.message}
                >
                  <input
                    type="email"
                    {...register("email")}
                    className={inputClass}
                    disabled
                  />
                </FormField>
                <FormField label={t("user.profile.account.registerNum")}>
                  <input
                    value={user?.id || "unknown"}
                    className={inputClass}
                    disabled
                    readOnly
                  />
                </FormField>
                <FormField
                  label={t("user.profile.account.phone")}
                  error={errors.phone?.message}
                >
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        defaultCountry="US"
                        value={field.value as string | undefined}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </FormField>
                <FormField label={t("user.profile.account.department")}>
                  <input {...register("department")} className={inputClass} />
                </FormField>
              </div>

              <FormField label={t("user.profile.account.bio")}>
                <textarea
                  {...register("bio")}
                  rows={4}
                  className={textareaClass}
                  placeholder={t("user.profile.account.bioPlaceholder")}
                />
              </FormField>

              <div className={styles.formActions}>
                <Button type="submit">
                  {t("user.profile.account.update")}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  disabled={!isDirty}
                >
                  {t("user.profile.account.reset")}
                </Button>
                {submitSuccess && (
                  <span
                    role="status"
                    style={{ color: "var(--stat-green)", fontSize: "0.85rem" }}
                  >
                    ✓ Profile updated
                  </span>
                )}
              </div>
            </form>
          </div>
        )}



        {activeTab === "notifications" && (
          <div className={styles.notificationsContainer}>
            {notifItems.map((item) => (
              <div key={item.key} className={styles.notificationItem}>
                <div>
                  <div className={styles.notificationLabel}>{item.label}</div>
                  <div className={styles.notificationDesc}>{item.desc}</div>
                </div>
                <ToggleSwitch
                  checked={notifSettings[item.key]}
                  onChange={(v) => handleNotifChange(item.key, v)}
                  label={`Toggle ${item.label}`}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "interface" && (
          <div className={styles.tabContainer}>
            <div>
              <h3 className={styles.interfaceSectionTitle}>
                {t("user.profile.interface.themeTitle")}
              </h3>
              <div
                className={styles.themeButtonsContainer}
                role="radiogroup"
                aria-label="Theme selection"
              >
                {themeOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    role="radio"
                    aria-checked={theme === opt.key}
                    onClick={() => handleThemeChange(opt.key)}
                    className={`${styles.themeButton} ${theme === opt.key ? styles.themeButtonDark : styles.themeButtonDefault}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.divider}>
              <h3 className={styles.interfaceSectionTitle}>
                {t("user.profile.interface.langTitle")}
              </h3>
              <div className={styles.langSelectWrapper}>
                <Select
                  options={langOptions}
                  value={
                    langOptions.find((o) => o.value === currentLang) ||
                    langOptions[0]
                  }
                  onChange={handleLanguageChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
