"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Sparkles, Shuffle, Star } from "lucide-react";
import { PageHeader } from "@shelf-ai/ui/page-header";
import { Button } from "@shelf-ai/ui/button";
import { BookCover } from "@shelf-ai/ui/book-cover";
import { Badge } from "@shelf-ai/ui/badge";
import { FilterPills } from "@shelf-ai/ui/filter-pills";
import { EmptyState } from "@shelf-ai/ui/empty-state";
import { useBooks } from "@shelf-ai/shared/hooks";
import { BOOK_CATEGORIES } from "@shelf-ai/shared/constants";
import { useTranslation } from "react-i18next";
import { SearchInput } from "@shelf-ai/ui/search-input";
import styles from "./page.module.css";

interface SearchResultMeta {
  id: string;
  relevanceScore: number;
  reason: string;
}

export default function AiSearchPage() {
  const { t } = useTranslation();
  const suggestions =
    (t("user.aiSearch.suggestions", { returnObjects: true }) as string[]) || [];

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialQuery = searchParams.get("q") || "";

  const books = useBooks();
  const [query, setQuery] = useState(initialQuery);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<typeof books>([]);
  const [resultMeta, setResultMeta] = useState<Map<string, SearchResultMeta>>(
    new Map(),
  );
  const [categoryFilter, setCategoryFilter] = useState("");
  const [shuffleTheme, setShuffleTheme] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buildCatalog = useCallback(() => {
    return books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      category: b.category.tag,
      description: b.description,
    }));
  }, [books]);

  const handleSearch = useCallback(
    async (q?: string) => {
      const searchQuery = q || query;
      if (!searchQuery.trim() || books.length === 0) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set("q", searchQuery);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      setSearching(true);
      setError(null);
      setShuffleTheme(null);

      try {
        const response = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery.trim(),
            catalog: buildCatalog(),
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Search failed");
        }

        const data = await response.json();
        const metaMap = new Map<string, SearchResultMeta>();
        const sortedBooks: typeof books = [];

        for (const item of data.results) {
          const book = books.find((b) => b.id === item.id);
          if (book) {
            sortedBooks.push(book);
            metaMap.set(item.id, item);
          }
        }

        setResults(sortedBooks.length > 0 ? sortedBooks : []);
        setResultMeta(metaMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        const words = searchQuery.toLowerCase().split(/\s+/);
        const scored = books.map((book) => {
          let score = 0;
          words.forEach((w) => {
            if (book.title.toLowerCase().includes(w)) score += 3;
            if (book.author.toLowerCase().includes(w)) score += 2;
            if (book.category.tag.toLowerCase().includes(w)) score += 2;
            if (book.description?.toLowerCase().includes(w)) score += 1;
          });
          return { book, score };
        });
        const filtered = scored
          .filter((s) => s.score > 0)
          .sort((a, b) => b.score - a.score)
          .map((s) => s.book);
        setResults(filtered.length > 0 ? filtered : books.slice(0, 6));
      } finally {
        setSearching(false);
      }
    },
    [query, books, searchParams, router, pathname, buildCatalog],
  );

  const handleShuffle = useCallback(async () => {
    if (books.length === 0) return;
    setSearching(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/shuffle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalog: buildCatalog() }),
      });

      if (!response.ok) {
        throw new Error("Shuffle failed");
      }

      const data = await response.json();
      const shuffledBooks: typeof books = [];

      for (const pick of data.picks) {
        const book = books.find((b) => b.id === pick.id);
        if (book) {
          shuffledBooks.push(book);
          setResultMeta((prev) => {
            const next = new Map(prev);
            next.set(pick.id, {
              id: pick.id,
              relevanceScore: 85,
              reason: pick.reason,
            });
            return next;
          });
        }
      }

      setResults(shuffledBooks);
      setShuffleTheme(data.theme);
      setQuery(t("user.aiSearch.randomDiscovery"));
    } catch {
      const shuffled = [...books].sort(() => Math.random() - 0.5).slice(0, 6);
      setResults(shuffled);
      setQuery(t("user.aiSearch.randomDiscovery"));
      setShuffleTheme(null);
    } finally {
      setSearching(false);
    }
  }, [books, buildCatalog, t]);

  useEffect(() => {
    if (
      initialQuery &&
      books.length > 0 &&
      results.length === 0 &&
      !searching
    ) {
      handleSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books.length]);

  const displayResults = useMemo(() => {
    if (!categoryFilter) return results;
    return results.filter((b) => b.category.tag === categoryFilter);
  }, [results, categoryFilter]);

  return (
    <div className={styles.container}>
      <PageHeader
        title={t("user.aiSearch.title")}
        subtitle={t("user.aiSearch.subtitle")}
        icon={<Sparkles size={22} />}
      />

      <div className={styles.searchPanel}>
        <div className={styles.searchBarWrapper}>
          <SearchInput
            value={query}
            onChange={(val) => setQuery(val)}
            placeholder={t("user.aiSearch.searchPlaceholder")}
          />
          <Button
            onClick={() => handleSearch()}
            loading={searching}
            aria-label="Search with AI"
          >
            <Sparkles
              size={15}
              className={styles.searchIcon}
              aria-hidden="true"
            />{" "}
            {t("user.aiSearch.searchButton")}
          </Button>
          <Button
            variant="secondary"
            onClick={handleShuffle}
            aria-label="Magic shuffle"
            disabled={searching}
          >
            <Shuffle size={15} aria-hidden="true" />
          </Button>
        </div>

        <div
          className={styles.suggestionsWrapper}
          aria-label="Suggested Searches"
        >
          {suggestions.map((s) => (
            <Button
              key={s}
              variant="ghost"
              onClick={() => {
                setQuery(s);
                handleSearch(s);
              }}
              className={styles.suggestionBtn}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <section aria-live="polite">
        {shuffleTheme && results.length > 0 && (
          <div
            style={{
              background: "var(--surface-alt)",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              marginBottom: "1rem",
              fontSize: "0.85rem",
              color: "var(--accent)",
              fontWeight: 600,
            }}
          >
            ✨ Theme: {shuffleTheme}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "var(--surface-alt)",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              marginBottom: "0.75rem",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
            role="status"
          >
            Using local search (AI unavailable)
          </div>
        )}

        {results.length > 0 && (
          <>
            <FilterPills
              options={BOOK_CATEGORIES.slice(0, 8)}
              selected={categoryFilter}
              onChange={setCategoryFilter}
            />

            <div className={styles.resultsGrid}>
              {displayResults.map((book, idx) => {
                const meta = resultMeta.get(book.id);
                return (
                  <div
                    key={book.id}
                    className={styles.bookCard}
                    style={{
                      animation: `fadeIn 0.3s ease ${idx * 0.04}s both`,
                      cursor: "pointer",
                    }}
                    onClick={() => router.push(`/book/${book.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") router.push(`/book/${book.id}`);
                    }}
                  >
                    <BookCover title={book.title} size="md" />
                    <div className={styles.bookInfo}>
                      <div className={styles.bookTitle}>{book.title}</div>
                      <div className={styles.bookAuthor}>{book.author}</div>
                      <Badge label={book.category.tag} color="var(--accent)" />
                      <div className={styles.ratingWrapper}>
                        <Star size={12} color="#f59e0b" fill="#f59e0b" />
                        <span className={styles.ratingValue}>
                          {book.rating.toFixed(1)}
                        </span>
                      </div>
                      {meta?.reason && (
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                            marginTop: "0.25rem",
                          }}
                        >
                          {meta.reason}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {results.length === 0 && !searching && (
          <EmptyState
            icon={<Sparkles size={40} />}
            title={t("user.aiSearch.emptyTitle")}
            message={t("user.aiSearch.emptySubtitle")}
          />
        )}
      </section>
    </div>
  );
}
