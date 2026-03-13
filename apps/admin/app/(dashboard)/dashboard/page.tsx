"use client";

import React, { useMemo } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowDown,
  Star,
  TrendingUp,
  Clock,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StatCard } from "@shelf-ai/ui/stat-card";
import { PageHeader } from "@shelf-ai/ui/page-header";
import {
  useBooks,
  useUsers,
  useBranches,
  useBorrowRecords,
} from "@shelf-ai/shared/hooks";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

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
  Other: "#94a3b8",
};

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
    <div className={styles.tooltipContainer}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          style={{ color: entry.color }}
          className={styles.tooltipEntry}
        >
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const books = useBooks();
  const users = useUsers();
  const branches = useBranches();
  const records = useBorrowRecords();

  const totalBooks = books.length;
  const activeUsers = users.filter((u) => u.status.tag === "Active").length;
  const activeBorrows = records.filter((r) => r.status.tag === "Active").length;
  const overdueCount = records.filter((r) => r.status.tag === "Overdue").length;
  const returnedCount = records.filter(
    (r) => r.status.tag === "Returned",
  ).length;
  const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);

  const parseBorrowDate = (dateStr: string) => {
    if (/^\d+$/.test(dateStr)) {
      const days = parseInt(dateStr, 10);
      return new Date(days * 86400 * 1000);
    }
    return new Date(dateStr);
  };

  const monthlyData = useMemo(() => {
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
    return months.map((month, i) => {
      const monthRecords = records.filter((r) => {
        const d = parseBorrowDate(r.borrowDate);
        return d.getFullYear() === currentYear && d.getMonth() === i;
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
      .sort((a, b) => b.value - a.value);
  }, [books]);

  const topRatedBooks = useMemo(() => {
    return [...books]
      .filter((b) => b.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [books]);

  const recentRecords = useMemo(() => {
    return [...records]
      .sort((a, b) => b.borrowDate.localeCompare(a.borrowDate))
      .slice(0, 6);
  }, [records]);

  const formatDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    books.forEach((b) => {
      b.format.forEach((f: { tag: string }) => {
        counts[f.tag] = (counts[f.tag] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color:
        name === "Hardcopy"
          ? "#f97316"
          : name === "Ebook"
            ? "#8b5cf6"
            : "#3b82f6",
    }));
  }, [books]);

  const utilizationRate =
    totalCopies > 0
      ? Math.round(((totalCopies - availableCopies) / totalCopies) * 100)
      : 0;

  return (
    <main
      className={styles.container}
      role="main"
      aria-label={t("admin.dashboard.title")}
    >
      <PageHeader
        title={t("admin.dashboard.title")}
        subtitle={t("admin.dashboard.subtitle")}
        icon={<LayoutDashboard size={22} />}
      />

      <section
        className={styles.statsGrid}
        aria-label={t("admin.dashboard.statsArea") || "Statistics"}
      >
        <StatCard
          label={t("admin.dashboard.stats.totalBooks")}
          value={totalBooks}
          icon={<BookOpen size={18} color="#f97316" />}
          iconBg="rgba(249,115,22,0.15)"
          trend={{ value: totalCopies, positive: true }}
        />
        <StatCard
          label={t("admin.dashboard.stats.activeUsers")}
          value={activeUsers}
          icon={<Users size={18} color="#3b82f6" />}
          iconBg="rgba(59,130,246,0.15)"
          trend={{ value: users.length, positive: true }}
        />
        <StatCard
          label={t("admin.dashboard.stats.activeBorrows")}
          value={activeBorrows}
          icon={<Activity size={18} color="#8b5cf6" />}
          iconBg="rgba(139,92,246,0.15)"
          trend={{ value: returnedCount, positive: true }}
        />
        <StatCard
          label={t("admin.dashboard.stats.overdue")}
          value={overdueCount}
          icon={<ArrowDown size={18} color="#ef4444" />}
          iconBg="rgba(239,68,68,0.15)"
          trend={{ value: overdueCount, positive: overdueCount === 0 }}
        />
      </section>

      <section className={styles.chartsRow} aria-label="Activity Charts">
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <TrendingUp
                size={15}
                className={styles.titleIcon}
                aria-hidden="true"
              />
              Borrowing Trends
            </h2>
            <span className={styles.cardSubtitle}>
              Monthly borrow, return & overdue activity
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={monthlyData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="adminGradBorrow"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="adminGradReturn"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                name="Borrowed"
                stroke="#f97316"
                fill="url(#adminGradBorrow)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="returned"
                name="Returned"
                stroke="#10b981"
                fill="url(#adminGradReturn)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="overdue"
                name="Overdue"
                stroke="#ef4444"
                fill="none"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <BookOpen
                size={15}
                className={styles.titleIcon}
                aria-hidden="true"
              />
              Category Distribution
            </h2>
            <span className={styles.cardSubtitle}>Books by category</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="45%"
                innerRadius={50}
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
                  <span className={styles.legendText}>{v as string}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </section>

      <section className={styles.chartsRow} aria-label="Detailed Analytics">
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Activity
                size={15}
                className={styles.titleIcon}
                aria-hidden="true"
              />
              Monthly Overview
            </h2>
            <span className={styles.cardSubtitle}>
              Borrowed vs returned per month
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={monthlyData}
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
                name="Borrowed"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="returned"
                name="Returned"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Library Utilization</h2>
            <span className={styles.cardSubtitle}>
              Current inventory status
            </span>
          </div>
          <div className={styles.utilizationGrid}>
            <div className={styles.utilizationItem}>
              <span className={styles.utilizationValue}>
                {utilizationRate}%
              </span>
              <span className={styles.utilizationLabel}>Utilization Rate</span>
              <div className={styles.utilizationBar}>
                <div
                  className={styles.utilizationFill}
                  style={{ width: `${utilizationRate}%` }}
                />
              </div>
            </div>
            <div className={styles.utilizationItem}>
              <span className={styles.utilizationValue}>{availableCopies}</span>
              <span className={styles.utilizationLabel}>Available Copies</span>
            </div>
            <div className={styles.utilizationItem}>
              <span className={styles.utilizationValue}>{branches.length}</span>
              <span className={styles.utilizationLabel}>Active Branches</span>
            </div>
            <div className={styles.utilizationItem}>
              <span className={styles.utilizationValue}>
                {formatDistribution.length}
              </span>
              <span className={styles.utilizationLabel}>Book Formats</span>
            </div>
          </div>
          {formatDistribution.length > 0 && (
            <div className={styles.formatList}>
              {formatDistribution.map((f) => (
                <div key={f.name} className={styles.distRow}>
                  <span className={styles.distLabel}>{f.name}</span>
                  <div className={styles.distBarTrack}>
                    <div
                      className={styles.distBarFill}
                      style={{
                        width: `${(f.value / totalBooks) * 100}%`,
                        background: f.color,
                      }}
                    />
                  </div>
                  <span className={styles.distValue}>{f.value}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className={styles.bottomGrid} aria-label="Details">
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Star size={15} className={styles.titleIcon} aria-hidden="true" />
              Top Rated Books
            </h2>
          </div>
          <div className={styles.listCol10}>
            {topRatedBooks.length === 0 && (
              <p className={styles.emptyText}>No rated books yet</p>
            )}
            {topRatedBooks.map((book, idx) => (
              <div key={book.id} className={styles.recordRow}>
                <div className={styles.rankBadge}>{idx + 1}</div>
                <div className={styles.bookInfo}>
                  <div className={styles.recordTitle}>{book.title}</div>
                  <div className={styles.recordSubtitle}>{book.author}</div>
                </div>
                <div className={styles.ratingBadge}>
                  <Star
                    size={12}
                    fill="#eab308"
                    color="#eab308"
                    aria-hidden="true"
                  />
                  {book.rating.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Clock
                size={15}
                className={styles.titleIcon}
                aria-hidden="true"
              />
              Recent Activity
            </h2>
          </div>
          <div className={styles.timeline}>
            {recentRecords.length === 0 && (
              <p className={styles.emptyText}>
                {t("admin.dashboard.noRecords")}
              </p>
            )}
            {recentRecords.map((r) => {
              const book = books.find((b) => b.id === r.bookId);
              const usr = users.find((u) => u.id === r.userId);
              return (
                <div key={r.id} className={styles.timelineItem}>
                  <div
                    className={styles.timelineDot}
                    style={{
                      background:
                        r.status.tag === "Active"
                          ? "#3b82f6"
                          : r.status.tag === "Overdue"
                            ? "#ef4444"
                            : "#10b981",
                    }}
                  />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>
                      {book?.title || r.bookId}
                    </div>
                    <div className={styles.timelineMeta}>
                      {usr?.name || r.userId} &middot; {r.borrowDate}
                    </div>
                  </div>
                  <div
                    className={`${styles.recordStatus} ${
                      r.status.tag === "Active"
                        ? styles.statusActive
                        : r.status.tag === "Overdue"
                          ? styles.statusOverdue
                          : styles.statusReturned
                    }`}
                  >
                    {r.status.tag}
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </main>
  );
}
