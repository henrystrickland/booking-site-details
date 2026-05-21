import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uzxsqstnjtcxvyopapuq.supabase.co";
const SUPABASE_KEY = "sb_publishable_JlmBO1T7-SnaF8Ib4Vo4fA_alV2aTej";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_PASSWORD = "detailing2026";

const SERVICES = [
  { id: "interior", name: "Interior Only", duration: "1.5 hrs", prices: { sedan: 80, suv: 95 } },
  { id: "exterior-basic", name: "Exterior Basic", duration: "1 hr", prices: { sedan: 45, suv: 45 } },
  { id: "exterior-premium", name: "Exterior Premium", duration: "1.5 hrs", prices: { sedan: 75, suv: 95 } },
  { id: "combo-basic", name: "Interior + Exterior Basic", duration: "2.5 hrs", prices: { sedan: 110, suv: 120 } },
  { id: "combo-premium", name: "Interior + Exterior Premium", duration: "3 hrs", prices: { sedan: 135, suv: 155 } },
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
  pending:   { bg: "#431407", color: "#FB923C", label: "Pending" },
  confirmed: { bg: "#1E3A5F", color: "#60A5FA", label: "Confirmed" },
  completed: { bg: "#14532D", color: "#86EFAC", label: "Completed" },
  cancelled: { bg: "#3B0000", color: "#FCA5A5", label: "Cancelled" },
};

export default function App() {
  const [view, setView] = useState("client");
  const [adminAuthed, setAdminAuthed] = useState(false);

  return (
    <div style={s.app}>
      <div style={s.orb1} />
      <div style={s.orb2} />
      <div style={s.orb3} />
      <header style={s.header}>
        <div style={s.logo}>
          <img src="/logo.png" alt="C&H Elite Auto Detailing" style={s.logoImg} />
          <div>
            <div style={s.logoName}>C&H Elite</div>
            <div style={s.logoSub}>Auto Detailing</div>
          </div>
        </div>
        {view !== "admin" ? (
          <nav style={s.nav}>
            <button style={{ ...s.navBtn, ...(view === "client" ? s.navBtnActive : {}) }} onClick={() => setView("client")}>Book</button>
            <button style={{ ...s.navBtn, ...(view === "gallery" ? s.navBtnActive : {}) }} onClick={() => setView("gallery")}>Gallery</button>
          </nav>
        ) : (
          <button style={s.backBtn} onClick={() => setView("client")}>← Back</button>
        )}
      </header>

      <main style={s.main}>
        {view === "client" && (
          <div style={s.hero}>
            <div style={s.heroImgRing}>
              <img src="/logo.png" alt="C&H Elite Auto Detailing" style={s.heroLogo} />
            </div>
            <h1 style={s.heroTitle}>C&H Elite Auto Detailing</h1>
            <p style={s.heroTagline}>Premium · Professional · Mobile</p>
            <div style={s.socialRow}>
              <a href="https://instagram.com/ch.autodetails" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                @ch.autodetails
              </a>
              <a href="https://www.facebook.com/people/CH-Elite-Auto-Detailing/61572140056742/" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                C&H Elite Auto Detailing
              </a>
            </div>
          </div>
        )}
        {view === "client" && <ClientView />}
        {view === "gallery" && <GalleryView />}
        {view === "admin" && !adminAuthed && <AdminLogin onAuth={() => setAdminAuthed(true)} />}
        {view === "admin" && adminAuthed && <AdminView />}
      </main>

      {view !== "admin" && (
        <footer style={s.footer}>
          <button style={s.adminLink} onClick={() => setView("admin")}>admin</button>
        </footer>
      )}
    </div>
  );
}

function ClientView() {
  const slots = getAvailableSlots();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    client_name: "", client_email: "", client_phone: "", vehicle_type: "",
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
        <button style={s.btnPrimary} onClick={() => { setDone(false); setStep(1); setForm({ client_name:"",client_email:"",client_phone:"",vehicle_type:"",service_type:"",booking_date:"",booking_time:"",notes:"" }); }}>
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
            <input style={s.input} value={form.client_name} onChange={e => set("client_name", e.target.value)} placeholder="Jane Smith" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={form.client_email} onChange={e => set("client_email", e.target.value)} placeholder="you@example.com" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Phone</label>
            <input style={s.input} type="tel" value={form.client_phone} onChange={e => set("client_phone", e.target.value)} placeholder="(555) 000-0000" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Vehicle type</label>
            <div style={s.vehicleToggle}>
              {["sedan", "suv"].map(v => (
                <button
                  key={v}
                  style={{ ...s.vehicleBtn, ...(form.vehicle_type === v ? s.vehicleBtnActive : {}) }}
                  onClick={() => set("vehicle_type", v)}
                >
                  {v === "sedan" ? "Sedan" : "SUV / Truck"}
                </button>
              ))}
            </div>
          </div>
          <button
            style={{ ...s.btnPrimary, ...((!form.client_name || !form.client_email || !form.client_phone || !form.vehicle_type) ? s.btnDisabled : {}) }}
            disabled={!form.client_name || !form.client_email || !form.client_phone || !form.vehicle_type}
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
                <div style={s.serviceMeta}>
                  <span style={s.servicePrice}>${svc.prices[form.vehicle_type]}</span>
                  <span style={s.serviceDuration}>{svc.duration}</span>
                </div>
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
            <Row label="Vehicle" value={form.vehicle_type === "sedan" ? "Sedan" : "SUV / Truck"} />
            <Row label="Service" value={form.service_type} />
            <Row label="Price" value={`$${SERVICES.find(s => s.name === form.service_type)?.prices[form.vehicle_type] ?? "—"}`} />
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
    <div style={{ ...s.card, maxWidth: 360, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
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

function GalleryView() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.storage.from("gallery").list("", { sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        if (data) {
          setPhotos(data.filter(f => f.name !== ".emptyFolderPlaceholder").map(f => ({
            name: f.name,
            url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl,
          })));
        }
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={s.galleryHero}>
        <h2 style={s.galleryHeroTitle}>Our Work</h2>
        <p style={s.galleryHeroSub}>Premium Auto Detailing · Our Best Work</p>
      </div>
      {loading ? (
        <p style={s.emptyMsg}>Loading...</p>
      ) : photos.length === 0 ? (
        <p style={s.emptyMsg}>No photos yet — check back soon.</p>
      ) : (
        <div style={s.photoGrid}>
          {photos.map(ph => (
            <a key={ph.name} href={ph.url} target="_blank" rel="noopener noreferrer" style={s.photoLink}>
              <img src={ph.url} alt="Detailing work" style={s.photoImg} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = async () => {
    const { data } = await supabase.storage.from("gallery").list("", { sortBy: { column: "created_at", order: "desc" } });
    if (data) {
      setPhotos(data.filter(f => f.name !== ".emptyFolderPlaceholder").map(f => ({
        name: f.name,
        url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    await supabase.storage.from("gallery").upload(`${Date.now()}.${ext}`, file);
    setFile(null);
    setPreview(null);
    setUploading(false);
    fetchPhotos();
  };

  const remove = async (name) => {
    await supabase.storage.from("gallery").remove([name]);
    setPhotos(p => p.filter(ph => ph.name !== name));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={s.uploadCard}>
        <p style={s.uploadLabel}>Add photo</p>
        <label style={s.uploadZone}>
          {preview ? (
            <img src={preview} style={s.uploadPreview} alt="Preview" />
          ) : (
            <div style={s.uploadEmpty}>
              <span style={s.uploadIcon}>↑</span>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Click to select a photo</span>
            </div>
          )}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        </label>
        {file && (
          <button style={s.btnPrimary} onClick={upload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload photo"}
          </button>
        )}
      </div>

      {loading ? (
        <p style={s.emptyMsg}>Loading...</p>
      ) : photos.length === 0 ? (
        <p style={s.emptyMsg}>No photos uploaded yet.</p>
      ) : (
        <div style={s.adminPhotoGrid}>
          {photos.map(ph => (
            <div key={ph.name} style={s.adminPhotoCard}>
              <img src={ph.url} alt="" style={s.adminPhotoImg} />
              <button style={s.deletePhotoBtn} onClick={() => remove(ph.name)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminView() {
  const [tab, setTab] = useState("bookings");
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
        <h1 style={s.adminTitle}>Admin</h1>
        {tab === "bookings" && <button style={s.refreshBtn} onClick={fetchBookings}>↻ Refresh</button>}
      </div>

      <div style={s.adminTabRow}>
        {["bookings", "gallery"].map(t => (
          <button key={t} style={{ ...s.adminTab, ...(tab === t ? s.adminTabActive : {}) }} onClick={() => setTab(t)}>
            {t === "bookings" ? "Bookings" : "Gallery Photos"}
          </button>
        ))}
      </div>

      {tab === "gallery" && <PhotoManager />}

      {tab === "bookings" && <><div style={s.statsRow}>
        {[["total", bookings.length, "#F97316"], ["pending", counts.pending || 0, "#FB923C"], ["confirmed", counts.confirmed || 0, "#60A5FA"], ["completed", counts.completed || 0, "#86EFAC"]].map(([label, count, color]) => (
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
      </>}
    </div>
  );
}

const s = {
  app: { minHeight: "100vh", background: "#060606", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", position: "relative", overflow: "hidden" },
  orb1: { position: "fixed", top: "-20%", left: "-15%", width: 700, height: 700, background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 65%)", filter: "blur(90px)", pointerEvents: "none", zIndex: 0 },
  orb2: { position: "fixed", bottom: "-20%", right: "-10%", width: 650, height: 650, background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 },
  orb3: { position: "fixed", top: "45%", left: "55%", width: 400, height: 400, background: "radial-gradient(circle, rgba(180,50,0,0.14) 0%, transparent 65%)", filter: "blur(70px)", pointerEvents: "none", zIndex: 0 },
  header: { background: "rgba(6,6,6,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(249,115,22,0.1)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "relative", zIndex: 10 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoImg: { height: 38, width: 38, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(249,115,22,0.5)", flexShrink: 0 },
  logoName: { fontSize: 14, fontWeight: 700, color: "#F9FAFB", lineHeight: 1.2 },
  logoSub: { fontSize: 10, color: "#F97316", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" },
  hero: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 32, paddingTop: 4 },
  heroImgRing: { padding: 4, borderRadius: "50%", background: "linear-gradient(135deg, rgba(249,115,22,0.6), rgba(180,50,0,0.3))", boxShadow: "0 0 50px rgba(249,115,22,0.25), 0 0 100px rgba(249,115,22,0.1)" },
  heroLogo: { width: 130, height: 130, borderRadius: "50%", objectFit: "cover", display: "block" },
  heroTitle: { fontSize: 24, fontWeight: 800, color: "#F9FAFB", letterSpacing: "-0.02em", margin: 0, textAlign: "center" },
  heroTagline: { fontSize: 11, color: "#F97316", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", margin: 0 },
  socialRow: { display: "flex", gap: 10, marginTop: 4 },
  socialBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#D1D5DB", fontSize: 12, fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" },
  nav: { display: "flex", gap: 4 },
  navBtn: { padding: "7px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#9CA3AF", fontFamily: "inherit" },
  navBtnActive: { background: "rgba(249,115,22,0.15)", color: "#F97316", borderColor: "rgba(249,115,22,0.35)" },
  backBtn: { padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", cursor: "pointer", fontSize: 13, color: "#9CA3AF", fontFamily: "inherit" },
  footer: { textAlign: "center", paddingBottom: 28, position: "relative", zIndex: 1 },
  adminLink: { background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#1A1A1A", fontFamily: "inherit", letterSpacing: "0.05em" },
  galleryHero: { textAlign: "center", marginBottom: 28, paddingTop: 4 },
  galleryHeroTitle: { fontSize: 28, fontWeight: 800, color: "#F9FAFB", margin: "0 0 8px", letterSpacing: "-0.02em" },
  galleryHeroSub: { fontSize: 11, color: "#F97316", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 10 },
  photoLink: { display: "block", borderRadius: 12, overflow: "hidden", aspectRatio: "1", border: "1px solid rgba(255,255,255,0.07)" },
  photoImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  adminTabRow: { display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.07)" },
  adminTab: { padding: "10px 20px", background: "none", border: "none", borderBottom: "2px solid transparent", marginBottom: -1, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6B7280", fontFamily: "inherit" },
  adminTabActive: { color: "#F97316", borderBottomColor: "#F97316" },
  uploadCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 14 },
  uploadLabel: { fontSize: 13, fontWeight: 700, color: "#D1D5DB", margin: 0 },
  uploadZone: { display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 10, border: "1.5px dashed rgba(249,115,22,0.25)", overflow: "hidden", minHeight: 160 },
  uploadEmpty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 32 },
  uploadIcon: { fontSize: 30, color: "#F97316" },
  uploadPreview: { width: "100%", maxHeight: 260, objectFit: "contain", display: "block" },
  adminPhotoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 },
  adminPhotoCard: { position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "1" },
  adminPhotoImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  deletePhotoBtn: { position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.75)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", lineHeight: 1 },
  main: { maxWidth: 680, margin: "32px auto", padding: "0 16px 64px", position: "relative", zIndex: 1 },
  card: { background: "rgba(18,18,18,0.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(249,115,22,0.12)", borderRadius: 16, padding: "32px 28px" },
  stepBar: { display: "flex", justifyContent: "space-between", marginBottom: 32, position: "relative" },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 },
  stepDot: { width: 28, height: 28, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#6B7280", zIndex: 1 },
  stepActive: { border: "2px solid #F97316", color: "#F97316", boxShadow: "0 0 12px rgba(249,115,22,0.4)" },
  stepDone: { background: "#F97316", border: "2px solid #F97316", color: "#fff", boxShadow: "0 0 12px rgba(249,115,22,0.5)" },
  stepLabel: { fontSize: 11, color: "#6B7280", fontWeight: 500, textAlign: "center" },
  stepLabelActive: { color: "#F97316" },
  formSection: { display: "flex", flexDirection: "column", gap: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: "#F9FAFB", margin: "0 0 4px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#D1D5DB" },
  input: { padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border 0.15s", boxSizing: "border-box", width: "100%", background: "rgba(255,255,255,0.05)", color: "#F9FAFB" },
  serviceGrid: { display: "flex", flexDirection: "column", gap: 8 },
  serviceCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, background: "rgba(255,255,255,0.04)", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "border 0.15s" },
  serviceCardActive: { border: "1.5px solid #F97316", background: "rgba(249,115,22,0.1)", boxShadow: "0 0 20px rgba(249,115,22,0.15)" },
  serviceName: { fontSize: 14, fontWeight: 600, color: "#F9FAFB" },
  serviceMeta: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 },
  servicePrice: { fontSize: 15, fontWeight: 700, color: "#F97316" },
  serviceDuration: { fontSize: 12, color: "#9CA3AF" },
  vehicleToggle: { display: "flex", gap: 8 },
  vehicleBtn: { flex: 1, padding: "10px 16px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, background: "rgba(255,255,255,0.04)", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#9CA3AF", fontFamily: "inherit" },
  vehicleBtnActive: { border: "1.5px solid #F97316", background: "rgba(249,115,22,0.1)", color: "#F97316", boxShadow: "0 0 16px rgba(249,115,22,0.15)" },
  slotGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 },
  slotCard: { padding: "12px 14px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, background: "rgba(255,255,255,0.04)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 4 },
  slotCardActive: { border: "1.5px solid #F97316", background: "rgba(249,115,22,0.1)", boxShadow: "0 0 20px rgba(249,115,22,0.15)" },
  slotDate: { fontSize: 13, fontWeight: 600, color: "#F9FAFB" },
  slotTime: { fontSize: 12, color: "#9CA3AF" },
  confirmCard: { border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.03)" },
  confirmRow: { display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  confirmLabel: { fontSize: 13, color: "#9CA3AF", fontWeight: 500 },
  confirmValue: { fontSize: 13, color: "#F9FAFB", fontWeight: 600, textAlign: "right", maxWidth: "60%" },
  btnRow: { display: "flex", gap: 10, justifyContent: "flex-end" },
  btnPrimary: { padding: "11px 24px", background: "linear-gradient(135deg, #F97316, #EA580C)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(249,115,22,0.35)" },
  btnSecondary: { padding: "11px 20px", background: "rgba(255,255,255,0.06)", color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnDisabled: { opacity: 0.35, cursor: "not-allowed" },
  errorBox: { background: "rgba(127,0,0,0.3)", border: "1px solid rgba(255,100,100,0.2)", color: "#FCA5A5", padding: "12px 14px", borderRadius: 8, fontSize: 13 },
  successIcon: { width: 60, height: 60, borderRadius: "50%", background: "rgba(249,115,22,0.15)", border: "2px solid rgba(249,115,22,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 20px", color: "#F97316", boxShadow: "0 0 30px rgba(249,115,22,0.25)" },
  successTitle: { textAlign: "center", fontSize: 22, fontWeight: 700, color: "#F9FAFB", margin: "0 0 12px" },
  successBody: { textAlign: "center", fontSize: 14, color: "#D1D5DB", margin: "0 0 8px", lineHeight: 1.6 },
  successSub: { textAlign: "center", fontSize: 13, color: "#9CA3AF", margin: "0 0 24px" },
  emptyMsg: { textAlign: "center", color: "#6B7280", padding: "40px 0", fontSize: 14 },
  adminTopBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  adminTitle: { fontSize: 24, fontWeight: 700, color: "#F9FAFB", margin: 0 },
  refreshBtn: { padding: "8px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: "pointer", fontSize: 14, color: "#D1D5DB", fontFamily: "inherit" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 },
  statCard: { background: "rgba(18,18,18,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 12, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  statNum: { fontSize: 28, fontWeight: 700 },
  statLabel: { fontSize: 11, color: "#6B7280", textTransform: "capitalize", fontWeight: 600, letterSpacing: "0.05em" },
  filterRow: { display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" },
  filterBtn: { padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "capitalize", fontFamily: "inherit" },
  filterBtnActive: { background: "rgba(249,115,22,0.15)", color: "#F97316", borderColor: "rgba(249,115,22,0.4)", boxShadow: "0 0 12px rgba(249,115,22,0.15)" },
  bookingList: { display: "flex", flexDirection: "column", gap: 12 },
  bookingCard: { background: "rgba(18,18,18,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 12, padding: "16px 20px" },
  bookingTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  bookingName: { fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 2 },
  bookingDate: { fontSize: 13, color: "#9CA3AF" },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "capitalize" },
  bookingBody: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" },
  bookingDetail: { fontSize: 13, color: "#D1D5DB" },
  bookingActions: { display: "flex", alignItems: "center", gap: 10 },
  actionLabel: { fontSize: 12, color: "#6B7280", fontWeight: 600 },
  statusSelect: { padding: "6px 10px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "#F9FAFB" },
};
