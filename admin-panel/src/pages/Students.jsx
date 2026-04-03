import { useEffect, useState, useCallback } from "react";
import { studentsApi } from "../api/client";
import { PageHeader, PageLoader, EmptyState, Toast, StatusBadge, Btn } from "../components/UI";
import { Users, Search, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const res = await studentsApi.list(params);
      setStudents(res.data);
    } catch { showToast("Failed to load students", "error"); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id, currentlyActive) => {
    try {
      await studentsApi.toggle(id);
      setStudents(prev =>
        prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s)
      );
      showToast(`Student ${currentlyActive ? "deactivated" : "activated"}`);
    } catch { showToast("Failed", "error"); }
  };

  return (
    <div>
      <PageHeader title="Students" subtitle={`${students.length} registered`}>
        <Btn variant="secondary" size="sm" onClick={load}>
          <RefreshCw className="w-3 h-3" />
        </Btn>
      </PageHeader>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
      </div>

      {loading ? <PageLoader /> : students.length === 0 ? (
        <EmptyState icon={Users} title="No students yet"
          desc="Students who register on the website will appear here." />
      ) : (
        <div className="card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wide"
            style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>
            <div className="col-span-4">Student</div>
            <div className="col-span-4 hidden sm:block">Email</div>
            <div className="col-span-2 hidden md:block">Joined</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          {/* Table Rows */}
          {students.map((s, idx) => (
            <div key={s.id}
              className="grid grid-cols-12 gap-3 px-4 py-3 items-center transition-colors"
              style={{
                borderBottom: idx < students.length - 1 ? "1px solid var(--border)" : "none",
                background: idx % 2 === 0 ? "transparent" : "rgba(30,58,95,0.1)"
              }}>
              {/* Name + avatar */}
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))" }}>
                  {s.first_name?.[0]}{s.last_name?.[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                    {s.first_name} {s.last_name}
                  </div>
                  <div className="text-xs truncate sm:hidden" style={{ color: "var(--muted)" }}>
                    {s.email}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="col-span-4 hidden sm:block">
                <span className="text-sm truncate" style={{ color: "var(--muted)" }}>{s.email}</span>
              </div>

              {/* Joined */}
              <div className="col-span-2 hidden md:block">
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Status + Toggle */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <StatusBadge status={s.is_active ? "active" : "inactive"} />
                <button onClick={() => handleToggle(s.id, s.is_active)}
                  className="transition-colors p-1 rounded"
                  title={s.is_active ? "Deactivate" : "Activate"}
                  style={{ color: s.is_active ? "var(--success)" : "var(--muted)" }}>
                  {s.is_active
                    ? <ToggleRight className="w-5 h-5" />
                    : <ToggleLeft className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
