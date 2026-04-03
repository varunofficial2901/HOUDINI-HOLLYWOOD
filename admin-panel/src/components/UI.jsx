// ── Spinner ──────────────────────────────────────────────
export function Spinner({ size = "md" }) {
  const s = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";
  return (
    <div className={`${s} rounded-full border-2 animate-spin`}
      style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <span className="text-sm" style={{ color: "var(--muted)" }}>Loading...</span>
      </div>
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────
const STATUS_STYLES = {
  pending:   { bg: "rgba(245,158,11,0.15)",  color: "#f59e0b", label: "Pending"   },
  confirmed: { bg: "rgba(16,185,129,0.15)",  color: "#10b981", label: "Confirmed" },
  cancelled: { bg: "rgba(239,68,68,0.15)",   color: "#ef4444", label: "Cancelled" },
  completed: { bg: "rgba(59,130,246,0.15)",  color: "#3b82f6", label: "Completed" },
  active:    { bg: "rgba(16,185,129,0.15)",  color: "#10b981", label: "Active"    },
  inactive:  { bg: "rgba(239,68,68,0.15)",   color: "#ef4444", label: "Inactive"  },
  admin:     { bg: "rgba(139,92,246,0.15)",  color: "#8b5cf6", label: "Admin"     },
  student:   { bg: "rgba(59,130,246,0.15)",  color: "#3b82f6", label: "Student"   },
  unread:    { bg: "rgba(245,158,11,0.15)",  color: "#f59e0b", label: "Unread"    },
  read:      { bg: "rgba(100,116,139,0.15)", color: "#64748b", label: "Read"      },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.pending;
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ── Stat Card ────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, color = "var(--accent)", sub }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-bold font-heading" style={{ color: "var(--text)" }}>{value}</div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────
export function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "rgba(30,58,95,0.4)" }}>
        <Icon className="w-7 h-7" style={{ color: "var(--muted)" }} />
      </div>
      <div className="font-semibold font-heading" style={{ color: "var(--text)" }}>{title}</div>
      <div className="text-sm text-center max-w-xs" style={{ color: "var(--muted)" }}>{desc}</div>
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────
export function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card p-6 w-full max-w-sm shadow-2xl">
        <h3 className="font-heading font-bold text-lg mb-2" style={{ color: "var(--text)" }}>{title}</h3>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: "rgba(30,58,95,0.5)", color: "var(--text)" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: danger ? "var(--danger)" : "var(--accent)", color: "white" }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────
export function Toast({ message, type = "success", onClose }) {
  const color = type === "success" ? "var(--success)" : type === "error" ? "var(--danger)" : "var(--warning)";
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl card"
      style={{ borderColor: color, minWidth: 240 }}>
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-sm font-medium flex-1" style={{ color: "var(--text)" }}>{message}</span>
      <button onClick={onClose} className="text-xs" style={{ color: "var(--muted)" }}>✕</button>
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────
export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>{label}</label>}
      <input
        className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors ${className}`}
        style={{
          background: "rgba(12,21,32,0.8)",
          border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
          color: "var(--text)",
        }}
        {...props}
      />
      {error && <span className="text-xs" style={{ color: "var(--danger)" }}>{error}</span>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────
export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>{label}</label>}
      <select
        className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors ${className}`}
        style={{ background: "var(--card)", border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`, color: "var(--text)" }}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs" style={{ color: "var(--danger)" }}>{error}</span>}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────
export function Btn({ children, variant = "primary", size = "md", loading, className = "", ...props }) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: { background: "var(--accent)", color: "white" },
    secondary: { background: "rgba(30,58,95,0.5)", color: "var(--text)", border: "1px solid var(--border)" },
    danger: { background: "var(--danger)", color: "white" },
    ghost: { background: "transparent", color: "var(--muted)" },
  };
  return (
    <button
      className={`rounded-lg font-semibold transition-all duration-150 flex items-center gap-2 disabled:opacity-50 hover:-translate-y-px ${sizes[size]} ${className}`}
      style={variants[variant]}
      disabled={loading}
      {...props}
    >
      {loading && <div className="w-3 h-3 rounded-full border border-white/40 border-t-white animate-spin" />}
      {children}
    </button>
  );
}

// ── Page Header ───────────────────────────────────────────
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="font-heading font-bold text-2xl" style={{ color: "var(--text)" }}>{title}</h1>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
