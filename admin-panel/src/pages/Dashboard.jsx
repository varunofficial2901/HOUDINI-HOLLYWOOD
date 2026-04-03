import { useEffect, useState } from "react";
import { dashboardApi, enrollmentsApi } from "../api/client";
import { StatCard, PageLoader, PageHeader } from "../components/UI";
import {
  GraduationCap, Users, BookOpen, MessageSquare,
  Clock, CheckCircle, TrendingUp, Mail
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = {
  pending: "#f59e0b", confirmed: "#10b981",
  cancelled: "#ef4444", completed: "#3b82f6"
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [enrollStats, setEnrollStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.stats(), enrollmentsApi.stats()])
      .then(([s, e]) => { setStats(s.data); setEnrollStats(e.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const chartData = enrollStats ? [
    { name: "Pending",   value: enrollStats.pending,   fill: COLORS.pending   },
    { name: "Confirmed", value: enrollStats.confirmed,  fill: COLORS.confirmed },
    { name: "Completed", value: enrollStats.completed,  fill: COLORS.completed },
    { name: "Cancelled", value: enrollStats.cancelled,  fill: COLORS.cancelled },
  ] : [];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your platform" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={GraduationCap} label="Total Enrollments" value={stats?.total_enrollments ?? 0} color="var(--accent)" />
        <StatCard icon={Clock} label="Pending" value={stats?.pending_enrollments ?? 0} color="var(--warning)"
          sub="Needs action" />
        <StatCard icon={CheckCircle} label="Confirmed" value={stats?.confirmed_enrollments ?? 0} color="var(--success)" />
        <StatCard icon={Users} label="Students" value={stats?.total_students ?? 0} color="var(--accent2)" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen} label="Active Courses" value={stats?.total_courses ?? 0} color="#a855f7" />
        <StatCard icon={MessageSquare} label="Total Messages" value={stats?.total_messages ?? 0} color="#06b6d4" />
        <StatCard icon={Mail} label="Unread Messages" value={stats?.unread_messages ?? 0} color="var(--warning)"
          sub={stats?.unread_messages > 0 ? "Needs reply" : "All caught up"} />
        <StatCard icon={TrendingUp} label="Completion Rate"
          value={stats?.total_enrollments > 0
            ? `${Math.round((stats.confirmed_enrollments / stats.total_enrollments) * 100)}%`
            : "0%"}
          color="var(--success)" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Status Chart */}
        <div className="card p-5">
          <h2 className="font-heading font-bold text-base mb-4" style={{ color: "var(--text)" }}>
            Enrollment Breakdown
          </h2>
          {chartData.every(d => d.value === 0) ? (
            <div className="flex items-center justify-center h-40 text-sm" style={{ color: "var(--muted)" }}>
              No enrollment data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barCategoryGap="35%">
                <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Overview */}
        <div className="card p-5">
          <h2 className="font-heading font-bold text-base mb-4" style={{ color: "var(--text)" }}>
            Quick Overview
          </h2>
          <div className="space-y-3">
            {[
              { label: "Pending enrollments need review", value: stats?.pending_enrollments, color: "var(--warning)", link: "/enrollments" },
              { label: "Unread messages awaiting reply", value: stats?.unread_messages, color: "var(--danger)", link: "/messages" },
              { label: "Active courses on platform", value: stats?.total_courses, color: "var(--success)", link: "/courses" },
              { label: "Registered students total", value: stats?.total_students, color: "var(--accent2)", link: "/students" },
            ].map((item, i) => (
              <a key={i} href={item.link}
                className="flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{ background: "rgba(30,58,95,0.2)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(30,58,95,0.4)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(30,58,95,0.2)"}>
                <span className="text-sm" style={{ color: "var(--muted)" }}>{item.label}</span>
                <span className="font-heading font-bold text-lg" style={{ color: item.color }}>{item.value ?? 0}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
