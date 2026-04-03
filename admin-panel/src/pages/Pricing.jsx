import { useEffect, useState } from "react";
import { pricingApi } from "../api/client";
import { PageHeader, PageLoader, EmptyState, Toast, Btn } from "../components/UI";
import { DollarSign, Edit3, Save, X, Plus, Trash2 } from "lucide-react";

function PlanEditor({ plan, onSave, onClose }) {
  const [form, setForm] = useState({ ...plan });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const updateFeature = (idx, key, val) => {
    const fs = [...form.features];
    fs[idx] = { ...fs[idx], [key]: val };
    set("features", fs);
  };
  const addFeature = () => set("features", [...form.features, { text: "", active: true }]);
  const removeFeature = (idx) => set("features", form.features.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(plan.id, form); onClose(); }
    catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-heading font-bold text-lg capitalize" style={{ color: "var(--text)" }}>
            Edit {plan.name} Plan
          </h2>
          <button onClick={onClose} style={{ color: "var(--muted)" }}><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Monthly Price (₹)", key: "price_monthly", placeholder: "4,999" },
              { label: "Yearly Price (₹)", key: "price_yearly", placeholder: "3,999" },
              { label: "Old Yearly (₹)", key: "old_yearly", placeholder: "4,999" },
              { label: "Savings (₹)", key: "savings", placeholder: "1,000" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>{label}</label>
                <input value={form[key] || ""} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(12,21,32,0.8)", border: "1px solid var(--border)", color: "var(--text)" }} />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>Description</label>
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={2}
              className="px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ background: "rgba(12,21,32,0.8)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--text)" }}>
              <input type="checkbox" checked={form.is_popular} onChange={e => set("is_popular", e.target.checked)} />
              Mark as Popular
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--text)" }}>
              <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} />
              Active
            </label>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>
                Features ({form.features?.length || 0})
              </label>
              <Btn variant="secondary" size="sm" onClick={addFeature}><Plus className="w-3 h-3" /> Add</Btn>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {(form.features || []).map((f, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ background: "rgba(12,21,32,0.5)", border: "1px solid var(--border)" }}>
                  <input type="checkbox" checked={f.active} onChange={e => updateFeature(idx, "active", e.target.checked)} />
                  <input value={f.text} onChange={e => updateFeature(idx, "text", e.target.value)}
                    placeholder="Feature description"
                    className="flex-1 px-2 py-1 text-xs outline-none"
                    style={{ background: "transparent", border: "none", color: "var(--text)" }} />
                  <button onClick={() => removeFeature(idx)} style={{ color: "var(--danger)" }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5" style={{ borderTop: "1px solid var(--border)" }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSave} loading={saving}><Save className="w-4 h-4" /> Save Plan</Btn>
        </div>
      </div>
    </div>
  );
}

const PLAN_COLORS = { starter: "#3b82f6", pro: "#8b5cf6", master: "#f59e0b" };

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try { const res = await pricingApi.listAll(); setPlans(res.data); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (id, data) => {
    await pricingApi.update(id, data);
    showToast("Plan updated successfully");
    load();
  };

  return (
    <div>
      <PageHeader title="Pricing Plans" subtitle="Manage course pricing and features" />

      {loading ? <PageLoader /> : plans.length === 0 ? (
        <EmptyState icon={DollarSign} title="No plans found" desc="Run seed.py to create default plans." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(plan => {
            const color = PLAN_COLORS[plan.name] || "var(--accent)";
            return (
              <div key={plan.id} className="card p-5 flex flex-col gap-4 relative">
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ background: "var(--accent)", fontFamily: "Syne,sans-serif" }}>
                    ★ POPULAR
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-heading font-bold text-xl capitalize" style={{ color }}>{plan.name}</div>
                    <div className="text-xs font-bold tracking-wider" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>{plan.tag}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${plan.is_active ? "bg-green-500" : "bg-red-500"}`} />
                </div>

                <div className="flex gap-4">
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>Monthly</div>
                    <div className="font-heading font-bold text-lg" style={{ color }}>₹{plan.price_monthly}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>Yearly</div>
                    <div className="font-heading font-bold text-lg" style={{ color }}>₹{plan.price_yearly}</div>
                  </div>
                  {plan.savings && (
                    <div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>Saves</div>
                      <div className="font-bold text-sm" style={{ color: "var(--success)" }}>₹{plan.savings}</div>
                    </div>
                  )}
                </div>

                <p className="text-xs" style={{ color: "var(--muted)" }}>{plan.desc}</p>

                <div className="space-y-1.5 flex-1">
                  {plan.features.slice(0, 5).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span style={{ color: f.active ? "var(--success)" : "var(--muted)" }}>{f.active ? "✓" : "✗"}</span>
                      <span style={{ color: f.active ? "var(--text)" : "var(--muted)", textDecoration: f.active ? "none" : "line-through" }}>{f.text}</span>
                    </div>
                  ))}
                  {plan.features.length > 5 && (
                    <div className="text-xs" style={{ color: "var(--muted)" }}>+{plan.features.length - 5} more...</div>
                  )}
                </div>

                <Btn variant="secondary" size="sm" onClick={() => setEditPlan(plan)} className="mt-auto">
                  <Edit3 className="w-3 h-3" /> Edit Plan
                </Btn>
              </div>
            );
          })}
        </div>
      )}

      {editPlan && <PlanEditor plan={editPlan} onSave={handleSave} onClose={() => setEditPlan(null)} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
