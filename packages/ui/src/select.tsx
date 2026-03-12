"use client";

import React from "react";
import ReactSelect, {
  type Props as SelectProps,
  type GroupBase,
} from "react-select";
import styles from "./select.module.css";

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: SelectProps<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      {...props}
      classNames={{
        control: (state) =>
          `${styles.control || ""} ${state.isFocused ? styles.controlFocused || "" : ""}`.trim(),
        menu: () => styles.menu || "",
        option: (state) =>
          `${styles.option || ""} ${state.isSelected ? styles.optionSelected || "" : state.isFocused ? styles.optionFocused || "" : ""}`.trim(),
        singleValue: () => styles.singleValue || "",
        input: () => styles.input || "",
        placeholder: () => styles.placeholder || "",
        indicatorSeparator: () => styles.indicatorSeparator || "",
        dropdownIndicator: () => styles.dropdownIndicator || "",
      }}
    />
  );
}
