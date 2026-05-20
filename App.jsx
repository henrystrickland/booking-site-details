import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uzxsqstnjtcxvyopapuq.supabase.co";
const SUPABASE_KEY = "sb_publishable_JlmBO1T7-SnaF8Ib4Vo4fA_alV2aTej";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_PASSWORD = "detailing2026";

const SERVICES = [
  { id: "interior", name: "Interior Only", duration: "1.5 hrs" },
  { id: "exterior-basic", name: "Exterior Basic", duration: "1 hr" },
  { id: "exterior-premium", name: "Exterior Premium", duration: "1.5 hrs" },
  { id: "combo-basic", name: "Interior + Exterior Basic", duration: "2.5 hrs" },
  { id: "combo-premium", name: "Interior + Exterior Premium", duration: "3 hrs" },
];

const WEEKLY_SLOTS = [
  { day: 6, label: "Saturday", times: ["8:00 AM", "11:00 AM"] },
  { day: 1, label: "Monday", times: ["4:00 PM"] },
  { day: 3, label: "Wednesday", times: ["4:00 PM"] },
];

function getAvailableSlots() {
  const slots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dow = date.getDay();
    const match = WEEKLY_SLOTS.find((s) => s.day === dow);
    if (match) {
      match.times.forEach((time) => {
        slots.push({
          date: date.toISOString().split("T")[0],
          displayDate: date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
          time,
        });
      });
    }
  }
  return slots;
}

const STATUS_STYLES = {
  pending:   { bg: "#FEF3C7", color: "#92400E", label: "Pending" },
  confirmed: { bg: "#DBEAFE", color: "#1E40AF", label: "Confirmed" },
  completed: { bg: "#D1FAE5", color: "#065F46", label: "Completed" },
  cancelled: { bg: "#FEE2E2", color: "#7F1D1D", label: "Cancelled" },
};

export default function App() {
  const [view, setView] = useState("client");
  const [adminAuthed, setAdminAuthed] = useState(false);

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div style={s.logo}>
          <span style={s.logoMark}>◆</span>
          <span style={s.logoText}>CDIT Detailing</span>
        </div>
        <nav style={s.nav}>
          <button
            style={{ ...s.navBtn, ...(view === "client" ? s.navBtnActive : {}) }}
            onClick={() => setView("client")}
          >
            Book
          </button>
          <button
            style={{ ...s.navBtn, ...(view === "admin" ? s.navBtnActive : {}) }}
            onClick={() => setView("admin")}
          >
            Admin
          </button>
        </nav>
      </header>

      <main style={s.main}>
        {view === "client" && <ClientView />}
        {view === "admin" && !adminAuthed && <AdminLogin onAuth={() => setAdminAuthed(true)} />}
        {view === "admin" && adminAuthed && <AdminView />}
      </main>
    </div>
  );
}

function ClientView() {
  const slots = getAvailableSlots();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    client_name: "", client_email: "", client_phone: "",
    service_type: "", booking_date: "", booking_time: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    supabase.from("bookings").select("booking_date, booking_time").then(({ data }) => {
      if (data) setBookedSlots(data.map((b) => `${b.booking_date}|${b.booking_time}`));
    });
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const availableSlots = slots.filter(
    (s) => !bookedSlots.includes(`${s.date}|${s.time}`)
  );

  const submit = async () => {
    setLoading(true);
    setError("");
    const { error: err } = await supabase.from("bookings").insert([{
      client_name: form.client_name,
      client_email: form.client_email,
      client_phone: form.client_phone,
      service_type: form.service_type,
      booking_date: form.booking_date,
      booking_time: form.booking_time,
      notes: form.notes,
      status: "pending",
    }]);
    setLoading(false);
    if (err) { setError("Something went wrong. Please try again."); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div style={s.card}>
        <div style={s.successIcon}>✓</div>
        <h2 style={s.successTitle}>You're booked!</h2>
        <p style={s.successBody}>
          {form.client_name}, we've received your booking for <strong>{form.service_type}</strong> on{" "}
          <strong>{slots.find(sl => sl.date === form.booking_date && sl.time === form.booking_time)?.displayDate}</strong> at{" "}
          <strong>{form.booking_time}</strong>.
        </p>
        <p style={s.successSub}>A confirmation will be sent to {form.client_email}.</p>
        <button style={s.btnPrimary} onClick={() => { setDone(false); setStep(1); setForm({ client_name:"",client_email:"",client_phone:"",service_type:"",booking_date:"",booking_time:"",notes:"" }); }}>
          Book another
        </button>
      </div>
    );
  }

  return (
    <div style={s.card}>
      <div style={s.stepBar}>
        {["Your info", "Service", "Date & time", "Confirm"].map((label, i) => (
          <div key={i} style={s.stepItem}>
            <div style={{ ...s.stepDot, ...(step > i + 1 ? s.stepDone : step === i + 1 ? s.stepActive : {}) }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={{ ...s.stepLabel, ...(step === i + 1 ? s.stepLabelActive : {}) }}>{label}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={s.formSection}>
          <h2 style={s.sectionTitle}>Your info</h2>
          <div style={s.fieldGroup}>
            <label style={s.label}>Full name</label>
            <input style={s.input} value={form.client_name} onChange={e => set("client_name", e.target.value)} placeholder="Henry Strickland" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={form.client_email} onChange={e => set("client_email", e.target.value)} placeholder="henry@example.com" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Phone</label>
            <input style={s.input} type="tel" value={form.client_phone} onChange={e => set("client_phone", e.target.value)} placeholder="(555) 000-0000" />
          </div>
          <button
            style={{ ...s.btnPrimary, ...((!form.client_name || !form.client_email || !form.client_phone) ? s.btnDisabled : {}) }}
            disabled={!form.client_name || !form.client_email || !form.client_phone}
            onClick={() => setStep(2)}
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={s.formSection}>
          <h2 style={s.sectionTitle}>Choose a service</h2>
          <div style={s.serviceGrid}>
            {SERVICES.map(svc => (
              <button
                key={svc.id}
                style={{ ...s.serviceCard, ...(form.service_type === svc.name ? s.serviceCardActive : {}) }}
                onClick={() => set("service_type", svc.name)}
              >
                <span style={s.serviceName}>{svc.name}</span>
                <span style={s.serviceDuration}>{svc.duration}</span>
              </button>
            ))}
          </div>
          <div style={s.btnRow}>
            <button style={s.btnSecondary} onClick={() => setStep(1)}>← Back</button>
            <button
              style={{ ...s.btnPrimary, ...(!form.service_type ? s.btnDisabled : {}) }}
              disabled={!form.service_type}
              onClick={() => setStep(3)}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={s.formSection}>
          <h2 style={s.sectionTitle}>Pick a time</h2>
          {availableSlots.length === 0 ? (
            <p style={s.emptyMsg}>No available slots in the next 2 weeks. Please check back soon.</p>
          ) : (
            <div style={s.slotGrid}>
              {availableSlots.map((slot, i) => (
                <button
                  key={i}
                  style={{ ...s.slotCard, ...(form.booking_date === slot.date && form.booking_time === slot.time ? s.slotCardActive : {}) }}
                  onClick={() => { set("booking_date", slot.date); set("booking_time", slot.time); }}
                >
                  <span style={s.slotDate}>{slot.displayDate}</span>
                  <span style={s.slotTime}>{slot.time}</span>
                </button>
              ))}
            </div>
          )}
          <div style={s.fieldGroup}>
            <label style={s.label}>Notes (optional)</label>
            <textarea style={{ ...s.input, minHeight: "80px", resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Car make/model, any special requests..." />
          </div>
          <div style={s.btnRow}>
            <button style={s.btnSecondary} onClick={() => setStep(2)}>← Back</button>
            <button
              style={{ ...s.btnPrimary, ...(!form.booking_date ? s.btnDisabled : {}) }}
              disabled={!form.booking_date}
              onClick={() => setStep(4)}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={s.formSection}>
          <h2 style={s.sectionTitle}>Confirm booking</h2>
          <div style={s.confirmCard}>
            <Row label="Name" value={form.client_name} />
            <Row label="Email" value={form.client_email} />
            <Row label="Phone" value={form.client_phone} />
            <Row label="Service" value={form.service_type} />
            <Row label="Date" value={availableSlots.find(sl => sl.date === form.booking_date && sl.time === form.booking_time)?.displayDate || form.booking_date} />
            <Row label="Time" value={form.booking_time} />
            {form.notes && <Row label="Notes" value={form.notes} />}
          </div>
          {error && <div style={s.errorBox}>{error}</div>}
          <div style={s.btnRow}>
            <button style={s.btnSecondary} onClick={() => setStep(3)}>← Back</button>
            <button style={s.btnPrimary} disabled={loading} onClick={submit}>
              {loading ? "Booking..." : "Confirm booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={s.confirmRow}>
      <span style={s.confirmLabel}>{label}</span>
      <span style={s.confirmValue}>{value}</span>
    </div>
  );
}

function AdminLogin({ onAuth }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const attempt = () => {
    if (pw === ADMIN_PASSWORD) { onAuth(); }
    else { setErr(true); setPw(""); }
  };
  return (
    <div style={{ ...s.card, maxWidth: 360, margin: "0 auto" }}>
      <h2 style={s.sectionTitle}>Admin login</h2>
      <div style={s.fieldGroup}>
        <label style={s.label}>Password</label>
        <input
          style={{ ...s.input, ...(err ? { borderColor: "#EF4444" } : {}) }}
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="Enter password"
          autoFocus
        />
        {err && <span style={{ color: "#EF4444", fontSize: 13 }}>Incorrect password</span>}
      </div>
      <button style={s.btnPrimary} onClick={attempt}>Log in</button>
    </div>
  );
}

function AdminView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true });
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status } : bk));
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div style={s.adminTopBar}>
        <h1 style={s.adminTitle}>Bookings</h1>
        <button style={s.refreshBtn} onClick={fetchBookings}>↻ Refresh</button>
      </div>

      <div style={s.statsRow}>
        {[["total", bookings.length, "#1F2937"], ["pending", counts.pending || 0, "#92400E"], ["confirmed", counts.confirmed || 0, "#1E40AF"], ["completed", counts.completed || 0, "#065F46"]].map(([label, count, color]) => (
          <div key={label} style={s.statCard}>
            <span style={{ ...s.statNum, color }}>{count}</span>
            <span style={s.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div style={s.filterRow}>
        {["all", "pending", "confirmed", "completed", "cancelled"].map(f => (
          <button
            key={f}
            style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={s.emptyMsg}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={s.emptyMsg}>No bookings found.</p>
      ) : (
        <div style={s.bookingList}>
          {filtered.map(b => {
            const st = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
            return (
              <div key={b.id} style={s.bookingCard}>
                <div style={s.bookingTop}>
                  <div>
                    <div style={s.bookingName}>{b.client_name}</div>
                    <div style={s.bookingDate}>
                      {new Date(b.booking_date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {b.booking_time}
                    </div>
                  </div>
                  <span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span>
                </div>
                <div style={s.bookingBody}>
                  <div style={s.bookingDetail}><strong>Service:</strong> {b.service_type}</div>
                  <div style={s.bookingDetail}><strong>Email:</strong> {b.client_email}</div>
                  <div style={s.bookingDetail}><strong>Phone:</strong> {b.client_phone}</div>
                  {b.notes && <div style={s.bookingDetail}><strong>Notes:</strong> {b.notes}</div>}
                </div>
                <div style={s.bookingActions}>
                  <span style={s.actionLabel}>Update status:</span>
                  <select
                    style={s.statusSelect}
                    value={b.status}
                    onChange={e => updateStatus(b.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  app: { minHeight: "100vh", background: "#F9FAFB", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },
  header: { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { fontSize: 18, color: "#2563EB" },
  logoText: { fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#111827" },
  nav: { display: "flex", gap: 4 },
  navBtn: { padding: "6px 16px", borderRadius: 6, border: "1px solid #E5E7EB", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#6B7280" },
  navBtnActive: { background: "#EFF6FF", color: "#2563EB", borderColor: "#BFDBFE" },
  main: { maxWidth: 680, margin: "32px auto", padding: "0 16px 64px" },
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "32px 28px" },
  stepBar: { display: "flex", justifyContent: "space-between", marginBottom: 32, position: "relative" },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 },
  stepDot: { width: 28, height: 28, borderRadius: "50%", border: "2px solid #D1D5DB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#9CA3AF", zIndex: 1 },
  stepActive: { border: "2px solid #2563EB", color: "#2563EB" },
  stepDone: { background: "#2563EB", border: "2px solid #2563EB", color: "#fff" },
  stepLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: 500, textAlign: "center" },
  stepLabelActive: { color: "#2563EB" },
  formSection: { display: "flex", flexDirection: "column", gap: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 4px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: { padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border 0.15s", boxSizing: "border-box", width: "100%" },
  serviceGrid: { display: "flex", flexDirection: "column", gap: 8 },
  serviceCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", border: "1.5px solid #E5E7EB", borderRadius: 8, background: "#fff", cursor: "pointer", fontFamily: "inherit", textAlign: "left" },
  serviceCardActive: { border: "1.5px solid #2563EB", background: "#EFF6FF" },
  serviceName: { fontSize: 14, fontWeight: 600, color: "#111827" },
  serviceDuration: { fontSize: 13, color: "#6B7280", background: "#F3F4F6", padding: "2px 10px", borderRadius: 20 },
  slotGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 },
  slotCard: { padding: "12px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8, background: "#fff", cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 4 },
  slotCardActive: { border: "1.5px solid #2563EB", background: "#EFF6FF" },
  slotDate: { fontSize: 13, fontWeight: 600, color: "#111827" },
  slotTime: { fontSize: 12, color: "#6B7280" },
  confirmCard: { border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" },
  confirmRow: { display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #F3F4F6" },
  confirmLabel: { fontSize: 13, color: "#6B7280", fontWeight: 500 },
  confirmValue: { fontSize: 13, color: "#111827", fontWeight: 600, textAlign: "right", maxWidth: "60%" },
  btnRow: { display: "flex", gap: 10, justifyContent: "flex-end" },
  btnPrimary: { padding: "11px 24px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnSecondary: { padding: "11px 20px", background: "#fff", color: "#374151", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  errorBox: { background: "#FEE2E2", color: "#7F1D1D", padding: "12px 14px", borderRadius: 8, fontSize: 13 },
  successIcon: { width: 56, height: 56, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 20px", color: "#065F46" },
  successTitle: { textAlign: "center", fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 12px" },
  successBody: { textAlign: "center", fontSize: 14, color: "#374151", margin: "0 0 8px", lineHeight: 1.6 },
  successSub: { textAlign: "center", fontSize: 13, color: "#6B7280", margin: "0 0 24px" },
  emptyMsg: { textAlign: "center", color: "#9CA3AF", padding: "40px 0", fontSize: 14 },
  adminTopBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  adminTitle: { fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 },
  refreshBtn: { padding: "8px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", fontSize: 14, color: "#374151", fontFamily: "inherit" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 },
  statCard: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  statNum: { fontSize: 28, fontWeight: 700 },
  statLabel: { fontSize: 11, color: "#9CA3AF", textTransform: "capitalize", fontWeight: 600, letterSpacing: "0.05em" },
  filterRow: { display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" },
  filterBtn: { padding: "6px 14px", borderRadius: 20, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "capitalize", fontFamily: "inherit" },
  filterBtnActive: { background: "#EFF6FF", color: "#2563EB", borderColor: "#BFDBFE" },
  bookingList: { display: "flex", flexDirection: "column", gap: 12 },
  bookingCard: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "16px 20px" },
  bookingTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  bookingName: { fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 2 },
  bookingDate: { fontSize: 13, color: "#6B7280" },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "capitalize" },
  bookingBody: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #F3F4F6" },
  bookingDetail: { fontSize: 13, color: "#4B5563" },
  bookingActions: { display: "flex", alignItems: "center", gap: 10 },
  actionLabel: { fontSize: 12, color: "#9CA3AF", fontWeight: 600 },
  statusSelect: { padding: "6px 10px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 13, fontFamily: "inherit", cursor: "pointer" },
};
