import { useEffect, useState, useCallback } from "react";
import { enrollmentsApi } from "../api/client";
import { PageHeader, StatusBadge, PageLoader, EmptyState, ConfirmModal, Toast, Select, Btn } from "../components/UI";
import { GraduationCap, Search, Trash2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

const STATUSES = ["pending", "confirmed", "cancelled", "completed"];

function EnrollRow({ e, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(e.status);
  const [notes, setNotes] = useState(e.admin_notes || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await onUpdate(e.id, { status, admin_notes: notes }); }
    finally { setSaving(false); }
  };

  return (
    <div className="card mb-2 overflow-hidden">
      <div className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setOpen(o => !o)}
        style={{ borderBottom: open ? "1px solid var(--border)" : "none" }}>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
            {e.first_name} {e.last_name}
          </div>
          <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{e.email}</div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs shrink-0" style={{ color: "var(--muted)" }}>
          <span className="font-bold uppercase" style={{ color: "var(--accent)" }}>{e.plan}</span>
          <span>·</span>
          <span>{e.billing}</span>
        </div>
        <StatusBadge status={e.status} />
        <div className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
          {new Date(e.created_at).toLocaleDateString()}
        </div>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: "var(--muted)" }} />
               : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "var(--muted)" }} />}
      </div>

      {open && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div><span style={{ color: "var(--muted)" }}>Phone: </span>
              <span style={{ color: "var(--text)" }}>{e.country_code} {e.phone}</span></div>
            <div><span style={{ color: "var(--muted)" }}>Gender: </span>
              <span style={{ color: "var(--text)" }}>{e.gender || "—"}</span></div>
            <div><span style={{ color: "var(--muted)" }}>Plan: </span>
              <span style={{ color: "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>{e.plan}</span></div>
            <div><span style={{ color: "var(--muted)" }}>Billing: </span>
              <span style={{ color: "var(--text)" }}>{e.billing}</span></div>
            <div><span style={{ color: "var(--muted)" }}>Submitted: </span>
              <span style={{ color: "var(--text)" }}>{new Date(e.created_at).toLocaleString()}</span></div>
          </div>

          <div className="space-y-3">
            <Select label="Status" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </Select>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>Admin Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="Add internal notes..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
                style={{ background: "rgba(12,21,32,0.8)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div className="flex gap-2">
              <Btn onClick={save} loading={saving} size="sm">Save Changes</Btn>
              <Btn variant="danger" size="sm" onClick={() => onDelete(e.id)}>
                <Trash2 className="w-3 h-3" /> Delete
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Enrollments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPlan) params.plan = filterPlan;
      if (search) params.search = search;
      const res = await enrollmentsApi.list(params);
      setItems(res.data);
    } catch { showToast("Failed to load enrollments", "error"); }
    finally { setLoading(false); }
  }, [filterStatus, filterPlan, search]);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = async (id, data) => {
    await enrollmentsApi.update(id, data);
    setItems(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    showToast("Enrollment updated");
  };

  const handleDelete = async () => {
    await enrollmentsApi.delete(deleteId);
    setItems(prev => prev.filter(e => e.id !== deleteId));
    setDeleteId(null);
    showToast("Enrollment deleted");
  };

  return (
    <div>
      <PageHeader title="Enrollments" subtitle={`${items.length} records`}>
        <Btn variant="secondary" size="sm" onClick={load}><RefreshCw className="w-3 h-3" /></Btn>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
          <option value="">All Plans</option>
          {["starter","pro","master"].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
        </select>
      </div>

      {loading ? <PageLoader /> : items.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No enrollments found" desc="Try adjusting your filters." />
      ) : (
        <div>
          {items.map(e => (
            <EnrollRow key={e.id} e={e} onUpdate={handleUpdate} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <ConfirmModal open={!!deleteId} danger title="Delete Enrollment"
        message="This action cannot be undone. The enrollment record will be permanently deleted."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
