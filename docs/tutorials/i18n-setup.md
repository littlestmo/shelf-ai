# i18n Setup with react-i18next

Shelf AI supports English (`en`) and Arabic (`ar`) with RTL layout switching.

## How It Works

Translations live in the shared package at:

- `packages/shared/locales/en.json`
- `packages/shared/locales/ar.json`

Each Next.js app initializes `i18next` in its `providers.tsx`:

```typescript
import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import enTranslations from "@shelf-ai/shared/locales/en.json";
import arTranslations from "@shelf-ai/shared/locales/ar.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslations },
      ar: { translation: arTranslations },
    },
    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("shelf-ai-locale") || "en"
        : "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}
```

## Adding New Translations

1. Add the key-value pair to both `en.json` and `ar.json`.
1. Use the `useTranslation` hook in your component:

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("my.new.key")}</h1>;
}
```

## RTL Support

When the language switches to Arabic, the `dir` attribute on `<html>` is set to `rtl`. CSS modules use `[dir="rtl"]` selectors to flip layouts, padding, and margins.

## Language Persistence

The selected language is stored in `localStorage` under the key `shelf-ai-locale` and restored on page reload.
