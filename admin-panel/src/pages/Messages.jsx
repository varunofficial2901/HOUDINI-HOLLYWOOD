import { useEffect, useState, useCallback } from "react";
import { messagesApi } from "../api/client";
import { PageHeader, PageLoader, EmptyState, ConfirmModal, Toast, StatusBadge, Btn } from "../components/UI";
import { MessageSquare, Trash2, MailOpen, RefreshCw, Filter } from "lucide-react";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterRead === "unread") params.is_read = false;
      if (filterRead === "read") params.is_read = true;
      const res = await messagesApi.list(params);
      setMessages(res.data);
    } catch { showToast("Failed to load messages", "error"); }
    finally { setLoading(false); }
  }, [filterRead]);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id) => {
    try {
      await messagesApi.markRead(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
      showToast("Marked as read");
    } catch { showToast("Failed", "error"); }
  };

  const handleDelete = async () => {
    await messagesApi.delete(deleteId);
    setMessages(prev => prev.filter(m => m.id !== deleteId));
    setDeleteId(null);
    showToast("Message deleted");
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${unreadCount} unread · ${messages.length} total`}>
        <Btn variant="secondary" size="sm" onClick={load}><RefreshCw className="w-3 h-3" /></Btn>
      </PageHeader>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {["all", "unread", "read"].map(f => (
          <button key={f} onClick={() => setFilterRead(f === "all" ? "" : f)}
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all"
            style={{
              background: (filterRead || "all") === f ? "var(--accent)" : "rgba(30,58,95,0.3)",
              color: (filterRead || "all") === f ? "white" : "var(--muted)",
              fontFamily: "Syne,sans-serif"
            }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : messages.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages" desc="Contact messages from the website will appear here." />
      ) : (
        <div className="space-y-2">
          {messages.map(m => (
            <div key={m.id} className="card overflow-hidden"
              style={{ borderLeft: !m.is_read ? "3px solid var(--warning)" : "3px solid transparent" }}>
              <div className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => { setExpanded(e => e === m.id ? null : m.id); if (!m.is_read) handleMarkRead(m.id); }}
                style={{ borderBottom: expanded === m.id ? "1px solid var(--border)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{m.email}</span>
                    {!m.is_read && (
                      <span className="px-1.5 py-0.5 text-xs rounded-full font-bold"
                        style={{ background: "rgba(245,158,11,0.15)", color: "var(--warning)" }}>NEW</span>
                    )}
                  </div>
                  <div className="text-xs truncate mt-0.5" style={{ color: "var(--muted)" }}>
                    {m.message.substring(0, 80)}{m.message.length > 80 ? "…" : ""}
                  </div>
                </div>
                <div className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
                  {new Date(m.created_at).toLocaleDateString()}
                </div>
              </div>

              {expanded === m.id && (
                <div className="p-4">
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text)" }}>{m.message}</p>
                  <div className="flex gap-2">
                    <a href={`mailto:${m.email}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      style={{ background: "rgba(59,130,246,0.15)", color: "var(--accent2)" }}>
                      <MailOpen className="w-3 h-3" /> Reply via Email
                    </a>
                    {!m.is_read && (
                      <Btn variant="secondary" size="sm" onClick={() => handleMarkRead(m.id)}>
                        Mark Read
                      </Btn>
                    )}
                    <Btn variant="danger" size="sm" onClick={() => setDeleteId(m.id)}>
                      <Trash2 className="w-3 h-3" /> Delete
                    </Btn>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!deleteId} danger title="Delete Message"
        message="This message will be permanently deleted."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
