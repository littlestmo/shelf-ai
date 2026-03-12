"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BookOpen,
  BookMarked,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Star,
  Bell,
  Bookmark,
  Clock,
} from "lucide-react";
import {
  useBooks,
  useBorrowRecords,
  useNotifications,
} from "@shelf-ai/shared/hooks";
import { DAILY_QUOTES } from "@shelf-ai/shared/constants";
import { useCountUp } from "@shelf-ai/shared/use-count-up";
import { BookCover } from "@shelf-ai/ui/book-cover";
import { Button } from "@shelf-ai/ui/button";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";

const CATEGORY_COLORS: Record<string, string> = {
  Fiction: "#f97316",
  NonFiction: "#3b82f6",
  Technology: "#8b5cf6",
  Science: "#10b981",
  History: "#eab308",
  SelfHelp: "#ec4899",
  Academic: "#6366f1",
  Thriller: "#ef4444",
  Mystery: "#14b8a6",
  Fantasy: "#a855f7",
  Biography: "#f59e0b",
  Philosophy: "#64748b",
  Art: "#e11d48",
  Romance: "#fb7185",
  Dystopian: "#475569",
  Journal: "#84cc16",
  Poetry: "#d946ef",
  Comics: "#22d3ee",
  Other: "#94a3b8",
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
  delay?: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  trendUp,
  delay,
}: StatCardProps) {
  const displayed = useCountUp(value, 1100);
  return (
    <article
      style={{
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-lg, 16px)",
        padding: "20px",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        animation: `fadeIn 0.4s ease ${delay ?? "0s"} both`,
        flex: "1",
        minWidth: "200px",
      }}
      aria-label={`${label}: ${value}`}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "var(--text-muted)",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} color={iconColor} aria-hidden="true" />
        </div>
      </div>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          fontFamily: "var(--font-display)",
          lineHeight: 1,
        }}
      >
        {displayed}
      </div>
      {trend && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.75rem",
          }}
        >
          <TrendingUp
            size={12}
            style={{
              color: trendUp ? "var(--stat-green)" : "var(--stat-red)",
              transform: trendUp ? "none" : "rotate(180deg)",
            }}
            aria-hidden="true"
          />
          <span
            style={{
              color: trendUp ? "var(--stat-green)" : "var(--stat-red)",
              fontWeight: 600,
            }}
          >
            {trend}
          </span>
        </div>
      )}
    </article>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md, 12px)",
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
        fontSize: "0.8rem",
      }}
    >
      <p
        style={{
          fontWeight: 700,
          marginBottom: 6,
          color: "var(--text-primary)",
          margin: "0 0 6px 0",
        }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          style={{ color: entry.color, marginBottom: 3, margin: "0 0 3px 0" }}
        >
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const books = useBooks();
  const records = useBorrowRecords();
  const notifications = useNotifications();
  const router = useRouter();
  const { user } = useUser();

  const quote = DAILY_QUOTES[new Date().getDay() % DAILY_QUOTES.length];

  const totalBooks = books.length;
  const activeBorrows = records.filter((r) => r.status.tag === "Active").length;
  const overdueBooks = records.filter((r) => r.status.tag === "Overdue").length;
  const returnedTotal = records.filter(
    (r) => r.status.tag === "Returned",
  ).length;

  const recentBorrows = useMemo(
    () =>
      records
        .filter((r) => r.status.tag === "Active" || r.status.tag === "Overdue")
        .slice(0, 5),
    [records],
  );

  const recommendations = useMemo(
    () =>
      books
        .filter((b) => b.status.tag === "Available" && b.rating >= 3.5)
        .slice(0, 8),
    [books],
  );

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    books.forEach((b) => {
      const cat = b.category.tag;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [books]);

  const chartData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const thisYearRecords = records.filter((r) => {
      const d = new Date(r.borrowDate);
      return d.getFullYear() === currentYear;
    });

    return months.map((month, i) => {
      const monthRecords = thisYearRecords.filter((r) => {
        const d = new Date(r.borrowDate);
        return d.getMonth() === i;
      });
      return {
        month,
        borrowed: monthRecords.length,
        returned: monthRecords.filter((r) => r.status.tag === "Returned")
          .length,
        overdue: monthRecords.filter((r) => r.status.tag === "Overdue").length,
      };
    });
  }, [records]);

  const recentNotifications = useMemo(
    () => notifications.slice(0, 5),
    [notifications],
  );

  const userName = user?.firstName || user?.fullName?.split(" ")[0] || "Reader";

  const handleBookClick = (id: string) => {
    router.push(`/book/${id}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("user.home.greeting.morning");
    if (hour < 17) return t("user.home.greeting.afternoon");
    return t("user.home.greeting.evening");
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        paddingBottom: "40px",
      }}
      role="region"
      aria-label="Dashboard overview"
    >
      <section
        aria-label="Welcome"
        style={{
          background: "linear-gradient(135deg, #a21caf, #e11d48, #be123c)",
          borderRadius: "var(--radius-lg, 16px)",
          padding: "28px 32px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(225, 29, 72, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            minWidth: "200px",
          }}
        >
          <h1
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              margin: "0 0 8px 0",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("user.home.greeting.welcome", {
              greeting: getGreeting(),
              name: userName,
            })}
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              margin: "0 0 4px 0",
              opacity: 0.9,
            }}
          >
            {t("user.home.greeting.borrowsStatus", {
              active: activeBorrows,
              overdueText:
                overdueBooks > 0
                  ? t("user.home.greeting.andOverdue", {
                      overdue: overdueBooks,
                    })
                  : "",
            })}
          </p>
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "400px",
            flex: 1,
            minWidth: "200px",
          }}
          aria-label="Quote of the day"
        >
          <blockquote
            style={{
              fontSize: "1rem",
              fontStyle: "italic",
              lineHeight: 1.5,
              margin: 0,
              opacity: 0.9,
            }}
          >
            &quot;
            {quote?.text || t("user.home.quote")}
            &quot;
          </blockquote>
          <cite
            style={{
              display: "block",
              marginTop: "8px",
              fontSize: "0.82rem",
              fontWeight: 600,
              opacity: 0.7,
              fontStyle: "normal",
            }}
          >
            , {quote?.author || t("user.home.quoteAuthor")}
          </cite>
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-10%",
            bottom: "-50%",
            width: "50%",
            height: "200%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            transform: "rotate(20deg)",
            pointerEvents: "none",
          }}
        />
      </section>

      <section aria-label="Key statistics">
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <StatCard
            label={t("user.home.stats.totalBooks")}
            value={totalBooks}
            icon={BookOpen}
            iconBg="rgba(249,115,22,0.15)"
            iconColor="var(--accent)"
            trend={t("user.home.stats.inLibrary", { count: totalBooks })}
            trendUp
            delay="0s"
          />
          <StatCard
            label={t("user.home.stats.activeBorrows")}
            value={activeBorrows}
            icon={BookMarked}
            iconBg="rgba(59,130,246,0.15)"
            iconColor="var(--stat-blue)"
            trend={t("user.home.stats.dueThisWeek")}
            delay="0.05s"
          />
          <StatCard
            label={t("user.home.stats.returned")}
            value={returnedTotal}
            icon={RotateCcw}
            iconBg="rgba(16,185,129,0.15)"
            iconColor="var(--stat-green)"
            trend={t("user.home.stats.allOnTime")}
            trendUp
            delay="0.10s"
          />
          <StatCard
            label={t("user.home.stats.overdue")}
            value={overdueBooks}
            icon={AlertTriangle}
            iconBg="rgba(239,68,68,0.15)"
            iconColor="var(--stat-red)"
            trend={
              overdueBooks > 0
                ? t("user.home.stats.returnImmediately")
                : t("user.home.stats.none")
            }
            trendUp={overdueBooks === 0}
            delay="0.15s"
          />
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "16px",
        }}
        aria-label="Activity charts"
      >
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg, 16px)",
            padding: "20px",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              marginBottom: "4px",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("user.home.stats.borrowActivity")}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginBottom: "16px",
            }}
          >
            {t("user.home.stats.borrowActivitySub")}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradBorrow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradReturn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="borrowed"
                name={t("user.home.stats.borrowed")}
                stroke="#f97316"
                fill="url(#gradBorrow)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="returned"
                name={t("user.home.stats.returned")}
                stroke="#10b981"
                fill="url(#gradReturn)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="overdue"
                name={t("user.home.stats.overdue")}
                stroke="#ef4444"
                fill="none"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg, 16px)",
            padding: "20px",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              marginBottom: "4px",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("user.home.stats.byCategory")}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginBottom: "16px",
            }}
          >
            {t("user.home.stats.categorySub")}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {v as string}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section
        style={{
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-lg, 16px)",
          padding: "20px",
          border: "1px solid var(--border)",
        }}
        aria-label="Monthly stats bar chart"
      >
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            marginBottom: "4px",
            fontFamily: "var(--font-display)",
          }}
        >
          {t("user.home.stats.monthlyOverview")}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginBottom: "16px",
          }}
        >
          {t("user.home.stats.monthlyOverviewSub")}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="borrowed"
              name={t("user.home.stats.borrowed")}
              fill="#f97316"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="returned"
              name={t("user.home.stats.returned")}
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="overdue"
              name={t("user.home.stats.overdue")}
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        <section
          style={{
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg, 16px)",
            padding: "20px",
            border: "1px solid var(--border)",
          }}
          aria-label="Currently borrowed books"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                margin: 0,
                fontFamily: "var(--font-display)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <BookMarked
                size={15}
                style={{ color: "var(--accent)" }}
                aria-hidden="true"
              />
              {t("user.home.sections.currentlyBorrowed")}
            </h2>
            <Button
              variant="ghost"
              style={{
                color: "var(--accent)",
                fontSize: "0.78rem",
                fontWeight: 600,
              }}
              onClick={() => router.push("/shelf")}
            >
              {t("user.home.sections.showAll")}
            </Button>
          </div>
          {recentBorrows.length === 0 ? (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.82rem",
              }}
            >
              {t("user.home.sections.noActiveBorrows")}
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {recentBorrows.map((record, i) => {
                const book = books.find((b) => b.id === record.bookId);
                if (!book) return null;
                const isOverdue = record.status.tag === "Overdue";
                return (
                  <div
                    key={record.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px",
                      borderRadius: "var(--radius-md, 12px)",
                      background: isOverdue
                        ? "rgba(239,68,68,0.04)"
                        : "var(--bg-body)",
                      border: `1px solid ${isOverdue ? "rgba(239,68,68,0.15)" : "transparent"}`,
                      animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                      cursor: "pointer",
                    }}
                    onClick={() => handleBookClick(book.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${book.title} by ${book.author}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleBookClick(book.id);
                    }}
                  >
                    <BookCover title={book.title} size="sm" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {book.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {book.author}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "4px",
                        }}
                      >
                        {isOverdue ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "0.7rem",
                              color: "#ef4444",
                              fontWeight: 600,
                            }}
                          >
                            <AlertTriangle size={10} aria-hidden="true" />
                            {t("user.home.sections.overdue")}
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            <Clock size={10} aria-hidden="true" />
                            {t("user.home.sections.due", {
                              date: record.dueDate,
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "#f59e0b",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                      aria-label={`Rating: ${book.rating}`}
                    >
                      <Star size={11} fill="currentColor" aria-hidden="true" />
                      {book.rating.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section
          style={{
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg, 16px)",
            padding: "20px",
            border: "1px solid var(--border)",
          }}
          aria-label="Notifications"
          aria-live="polite"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                margin: 0,
                fontFamily: "var(--font-display)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Bell
                size={15}
                style={{ color: "var(--accent)" }}
                aria-hidden="true"
              />
              {t("user.home.sections.notifications")}
            </h2>
            <Button
              variant="ghost"
              style={{
                color: "var(--accent)",
                fontSize: "0.78rem",
                fontWeight: 600,
              }}
            >
              {t("user.home.sections.markAllRead")}
            </Button>
          </div>
          {recentNotifications.length === 0 ? (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.82rem",
              }}
            >
              {t("user.home.sections.noNotifications")}
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
              role="list"
            >
              {recentNotifications.map((n) => {
                const dotColor: Record<string, string> = {
                  Overdue: "#ef4444",
                  Available: "#10b981",
                  System: "#f97316",
                  Reminder: "#3b82f6",
                };
                return (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "10px",
                      borderRadius: "var(--radius-md, 12px)",
                      background: n.read
                        ? "transparent"
                        : "rgba(249,115,22,0.04)",
                    }}
                    role="listitem"
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background:
                          dotColor[n.notificationType.tag] || "#94a3b8",
                        flexShrink: 0,
                        marginTop: "6px",
                      }}
                      aria-hidden="true"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {n.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {n.message}
                      </div>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--text-muted)",
                          marginTop: "4px",
                        }}
                      >
                        {n.date}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section aria-label="Recommended books">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              margin: 0,
              fontFamily: "var(--font-display)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Bookmark
              size={16}
              style={{ color: "var(--accent)" }}
              aria-hidden="true"
            />
            {t("user.home.sections.recommended")}
          </h2>
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => router.push("/search")}
          >
            {t("user.home.sections.showAll")}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          {recommendations.map((book, i) => (
            <div
              key={book.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                minWidth: "100px",
                maxWidth: "100px",
                animation: `fadeIn 0.35s ease ${i * 0.07}s both`,
                cursor: "pointer",
              }}
              role="article"
              aria-label={book.title}
              tabIndex={0}
              onClick={() => handleBookClick(book.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleBookClick(book.id);
              }}
            >
              <BookCover title={book.title} size="lg" />
              <div style={{ textAlign: "center", width: "100%" }}>
                <div
                  style={{
                    fontSize: "0.73rem",
                    fontWeight: 700,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {book.title}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {book.author.split(" ")[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
