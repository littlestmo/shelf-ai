"use client";

import React from "react";
import PhoneInputReact from "react-phone-number-input";
import "react-phone-number-input/style.css";
import styles from "./phone-input.module.css";

export function PhoneInput(
  props: React.ComponentProps<typeof PhoneInputReact>,
) {
  return (
    <div className={styles.container}>
      <PhoneInputReact
        {...props}
        className={styles.reactPhoneInput}
        numberInputProps={{
          className: styles.input,
        }}
      />
    </div>
  );
}
