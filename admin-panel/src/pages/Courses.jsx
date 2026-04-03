import { useEffect, useState } from "react";
import { coursesApi } from "../api/client";
import { PageHeader, PageLoader, EmptyState, ConfirmModal, Toast, Btn, StatusBadge } from "../components/UI";
import { BookOpen, Plus, Trash2, Edit3, Eye, EyeOff, X, Save } from "lucide-react";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function CourseModal({ course, onSave, onClose }) {
  const isEdit = !!course?.id;
  const [form, setForm] = useState(course || {
    category: "", tag: "", color: "#8b5cf6", icon: "🎬", level: "Intermediate",
    lessons: [], is_active: true
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addLesson = () => set("lessons", [...(form.lessons || []), {
    id: (form.lessons?.length || 0) + 1, title: "", duration: "1h 00m", preview: false
  }]);

  const updateLesson = (idx, key, val) => {
    const ls = [...form.lessons];
    ls[idx] = { ...ls[idx], [key]: val };
    set("lessons", ls);
  };

  const removeLesson = (idx) => set("lessons", form.lessons.filter((_, i) => i !== idx));

  const handleSave = async () => {
    if (!form.category || !form.tag) return;
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-heading font-bold text-lg" style={{ color: "var(--text)" }}>
            {isEdit ? "Edit Course" : "Add New Course"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--muted)" }}><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>Category Name *</label>
              <input value={form.category} onChange={e => set("category", e.target.value)}
                placeholder="e.g. Pyro Simulation"
                className="px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "rgba(12,21,32,0.8)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>Tag *</label>
              <input value={form.tag} onChange={e => set("tag", e.target.value)}
                placeholder="e.g. Pyro"
                className="px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "rgba(12,21,32,0.8)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>Icon</label>
              <input value={form.icon} onChange={e => set("icon", e.target.value)}
                className="px-3 py-2.5 rounded-lg text-sm outline-none text-center text-xl"
                style={{ background: "rgba(12,21,32,0.8)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>Color</label>
              <input type="color" value={form.color} onChange={e => set("color", e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer"
                style={{ background: "rgba(12,21,32,0.8)", border: "1px solid var(--border)" }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>Level</label>
              <select value={form.level} onChange={e => set("level", e.target.value)}
                className="px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} />
              <span className="text-sm" style={{ color: "var(--text)" }}>Active (visible to students)</span>
            </label>
          )}

          {/* Lessons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)", fontFamily: "Syne,sans-serif" }}>
                Lessons ({form.lessons?.length || 0})
              </label>
              <Btn variant="secondary" size="sm" onClick={addLesson}><Plus className="w-3 h-3" /> Add</Btn>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(form.lessons || []).map((lesson, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ background: "rgba(12,21,32,0.5)", border: "1px solid var(--border)" }}>
                  <span className="text-xs font-bold w-5 shrink-0" style={{ color: "var(--muted)" }}>{idx + 1}</span>
                  <input value={lesson.title} onChange={e => updateLesson(idx, "title", e.target.value)}
                    placeholder="Lesson title"
                    className="flex-1 px-2 py-1 rounded text-xs outline-none"
                    style={{ background: "transparent", border: "none", color: "var(--text)" }} />
                  <input value={lesson.duration} onChange={e => updateLesson(idx, "duration", e.target.value)}
                    className="w-20 px-2 py-1 rounded text-xs outline-none text-center"
                    style={{ background: "rgba(30,58,95,0.3)", border: "1px solid var(--border)", color: "var(--text)" }} />
                  <label className="flex items-center gap-1 text-xs shrink-0" style={{ color: "var(--muted)" }}>
                    <input type="checkbox" checked={lesson.preview} onChange={e => updateLesson(idx, "preview", e.target.checked)} />
                    Free
                  </label>
                  <button onClick={() => removeLesson(idx)} style={{ color: "var(--danger)" }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5" style={{ borderTop: "1px solid var(--border)" }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSave} loading={saving}><Save className="w-4 h-4" /> Save Course</Btn>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | {} | course
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try { const res = await coursesApi.listAll(); setCourses(res.data); }
    catch { showToast("Failed to load", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (form.id) {
      await coursesApi.update(form.id, form);
      showToast("Course updated");
    } else {
      await coursesApi.create(form);
      showToast("Course created");
    }
    load();
  };

  const handleDelete = async () => {
    await coursesApi.delete(deleteId);
    setCourses(prev => prev.filter(c => c.id !== deleteId));
    setDeleteId(null);
    showToast("Course deleted");
  };

  const toggleActive = async (course) => {
    await coursesApi.update(course.id, { is_active: !course.is_active });
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_active: !c.is_active } : c));
  };

  return (
    <div>
      <PageHeader title="Courses" subtitle={`${courses.length} total`}>
        <Btn onClick={() => setModal({})}><Plus className="w-4 h-4" /> Add Course</Btn>
      </PageHeader>

      {loading ? <PageLoader /> : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses yet" desc="Add your first course." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(c => (
            <div key={c.id} className="card p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ background: `${c.color}22`, border: `1px solid ${c.color}44` }}>
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-sm truncate" style={{ color: "var(--text)" }}>{c.category}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${c.color}22`, color: c.color }}>{c.tag}</span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{c.level}</span>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${c.is_active ? "bg-green-500" : "bg-red-500"}`} />
              </div>

              <div className="text-sm" style={{ color: "var(--muted)" }}>
                {c.total_lessons} lessons
              </div>

              <div className="flex gap-2 mt-auto pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <Btn variant="secondary" size="sm" onClick={() => setModal(c)}>
                  <Edit3 className="w-3 h-3" /> Edit
                </Btn>
                <Btn variant="secondary" size="sm" onClick={() => toggleActive(c)}>
                  {c.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {c.is_active ? "Hide" : "Show"}
                </Btn>
                <Btn variant="danger" size="sm" onClick={() => setDeleteId(c.id)}>
                  <Trash2 className="w-3 h-3" />
                </Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && <CourseModal course={modal.id ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />}
      <ConfirmModal open={!!deleteId} danger title="Delete Course"
        message="All lessons in this course will be permanently deleted."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
