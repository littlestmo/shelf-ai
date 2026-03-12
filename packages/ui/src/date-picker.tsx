"use client";

import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Calendar as CalendarIcon } from "lucide-react";
import "react-day-picker/dist/style.css";
import styles from "./date-picker.module.css";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder,
  className,
}: DatePickerProps) {
  const { t } = useTranslation();
  const finalPlaceholder = placeholder || t("ui.datePicker.placeholder");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ""}`.trim()}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.button} ${value ? styles.buttonHasValue : styles.buttonPlaceholder} ${isOpen ? styles.buttonOpen : styles.buttonClosed}`}
      >
        <span>{value ? format(value, "PP") : finalPlaceholder}</span>
        <CalendarIcon size={16} className={styles.icon} />
      </button>

      {isOpen && (
        <div className={styles.popover}>
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (date) {
                onChange?.(date);
                setIsOpen(false);
              }
            }}
            hidden={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            showOutsideDays
          />
        </div>
      )}
    </div>
  );
}
