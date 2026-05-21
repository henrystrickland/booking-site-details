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
            <button style={{ ...s.navBtn, ...(view === "reviews" ? s.navBtnActive : {}) }} onClick={() => setView("reviews")}>Reviews</button>
          </nav>
        ) : (
          <button style={s.backBtn} onClick={() => setView("client")}>← Back</button>
        )}
      </header>

      <main style={s.main}>
        {view === "client" && (
          <div style={s.hero}>
            <p style={s.heroLabel}>Premium Auto Detailing</p>
            <img src="/logo.png" alt="C&H Elite Auto Detailing" style={s.heroLogo} />
            <h1 style={s.heroTitle}>C&H Elite<br />Auto Detailing</h1>
            <p style={s.heroStats}>Mobile · Premium · Northern Virginia</p>
            <a href="tel:7033767536" style={s.phoneLink}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3-8.63A2 2 0 0 1 3 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z"/></svg>
              (703) 376-7536
            </a>
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
        {view === "client" && (
          <div style={s.valueRow}>
            <div style={s.valueItem}>
              <div style={s.valueIconWrap}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div style={s.valueTitle}>We Come to You</div>
                <div style={s.valueSub}>Mobile service at your home or office</div>
              </div>
            </div>
            <div style={s.valueSep} />
            <div style={s.valueItem}>
              <div style={s.valueIconWrap}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div style={s.valueTitle}>Professional Service</div>
                <div style={s.valueSub}>Quality results every time</div>
              </div>
            </div>
            <div style={s.valueSep} />
            <div style={s.valueItem}>
              <div style={s.valueIconWrap}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div>
                <div style={s.valueTitle}>5-Star Rated</div>
                <div style={s.valueSub}>Top-rated in Northern Virginia</div>
              </div>
            </div>
          </div>
        )}
        {view === "client" && <ClientView />}
        {view === "client" && <FloatingReviews />}
        {view === "gallery" && <GalleryView />}
        {view === "reviews" && <ReviewsView />}
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
        <div style={s.stepLine} />
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

function FloatingReviews() {
  const [reviews, setReviews] = useState([]);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    supabase.from("reviews").select("*").eq("rating", 5).not("comment", "is", null)
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => {
        const eligible = (data || []).filter(r => r.comment && r.comment.trim());
        if (eligible.length > 0) { setReviews(eligible); setTimeout(() => setVisible(true), 1000); }
      });
  }, []);

  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % reviews.length); setVisible(true); }, 700);
    }, 7000);
    return () => clearInterval(t);
  }, [reviews.length]);

  if (reviews.length === 0) return null;
  const r = reviews[idx];
  return (
    <div className="floating-review" style={s.floatingWrap}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
        <div style={s.floatingCard}>
          <div style={s.floatingStars}>★★★★★</div>
          <p style={s.floatingComment}>"{r.comment}"</p>
          <span style={s.floatingName}>— {r.anonymous ? "Anonymous" : (r.reviewer_name || "Anonymous")}</span>
        </div>
      </div>
    </div>
  );
}

function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({ rating: 0, comment: "", name: "", anonymous: false });

  const fetchReviews = () => {
    supabase.from("reviews").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setReviews(data || []); setLoading(false); });
  };
  useEffect(() => { fetchReviews(); }, []);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
  const avgDisplay = avg ? avg.toFixed(1) : null;

  const submit = async () => {
    if (!form.rating) return;
    setSubmitting(true);
    await supabase.from("reviews").insert([{
      rating: form.rating,
      comment: form.comment.trim() || null,
      reviewer_name: form.anonymous ? null : (form.name.trim() || null),
      anonymous: form.anonymous,
    }]);
    setSubmitting(false);
    setSubmitted(true);
    fetchReviews();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={s.galleryHero}>
        <h2 style={s.galleryHeroTitle}>Reviews</h2>
        <p style={s.galleryHeroSub}>What our customers say</p>
      </div>

      {!loading && reviews.length > 0 && (
        <div style={s.reviewStats}>
          <div style={s.reviewAvgBlock}>
            <span style={s.reviewAvgNum}>{avgDisplay}</span>
            <div style={s.reviewAvgStars}>
              {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(avg) ? "#F97316" : "rgba(255,255,255,0.15)", fontSize: 22 }}>★</span>)}
            </div>
            <span style={s.reviewCount}>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
          </div>
          <div style={s.reviewBars}>
            {[5,4,3,2,1].map(n => {
              const count = reviews.filter(r => r.rating === n).length;
              return (
                <div key={n} style={s.reviewBarRow}>
                  <span style={s.reviewBarLabel}>{n}★</span>
                  <div style={s.reviewBarTrack}>
                    <div style={{ ...s.reviewBarFill, width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }} />
                  </div>
                  <span style={s.reviewBarCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={s.card}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={s.successIcon}>✓</div>
            <h3 style={{ color: "#F9FAFB", margin: "16px 0 8px", fontSize: 18 }}>Thank you!</h3>
            <p style={{ color: "#9CA3AF", fontSize: 14 }}>Your review has been submitted.</p>
            <button style={{ ...s.btnPrimary, marginTop: 20 }} onClick={() => { setSubmitted(false); setForm({ rating: 0, comment: "", name: "", anonymous: false }); }}>
              Write another
            </button>
          </div>
        ) : (
          <div style={s.formSection}>
            <h2 style={s.sectionTitle}>Leave a review</h2>
            <div style={s.fieldGroup}>
              <label style={s.label}>Your rating</label>
              <div style={s.starPicker}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} style={s.starPickBtn}
                    onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
                    onClick={() => setForm(f => ({ ...f, rating: n }))}>
                    <span style={{ color: (hovered || form.rating) >= n ? "#F97316" : "rgba(255,255,255,0.15)", fontSize: 48, lineHeight: 1, display: "block" }}>★</span>
                  </button>
                ))}
              </div>
              {form.rating > 0 && (
                <span style={{ fontSize: 13, color: "#F97316", fontWeight: 600 }}>
                  {["","Poor","Fair","Good","Great","Excellent!"][form.rating]}
                </span>
              )}
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Your name <span style={{ color: "#6B7280", fontWeight: 400 }}>(optional)</span></label>
              <input style={{ ...s.input, ...(form.anonymous ? { opacity: 0.35, pointerEvents: "none" } : {}) }}
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" />
              <label style={s.anonRow}>
                <input type="checkbox" checked={form.anonymous} onChange={e => setForm(f => ({ ...f, anonymous: e.target.checked }))} style={{ accentColor: "#F97316", width: 16, height: 16 }} />
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>Post anonymously</span>
              </label>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Comment <span style={{ color: "#6B7280", fontWeight: 400 }}>(optional)</span></label>
              <textarea style={{ ...s.input, minHeight: 100, resize: "vertical" }}
                value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Tell us about your experience..." />
            </div>
            <button style={{ ...s.btnPrimary, ...(!form.rating ? s.btnDisabled : {}) }}
              disabled={!form.rating || submitting} onClick={submit}>
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </div>
        )}
      </div>

      {!loading && reviews.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", margin: "0 0 4px" }}>All reviews</h3>
          {reviews.map(r => (
            <div key={r.id} style={s.reviewCard}>
              <div style={s.reviewCardTop}>
                <div>
                  <div style={s.reviewerName}>{r.anonymous ? "Anonymous" : (r.reviewer_name || "Anonymous")}</div>
                  <div style={{ fontSize: 18, letterSpacing: 1 }}>
                    {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= r.rating ? "#F97316" : "rgba(255,255,255,0.12)" }}>★</span>)}
                  </div>
                </div>
                <span style={s.reviewDate}>{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              {r.comment && <p style={s.reviewComment}>"{r.comment}"</p>}
            </div>
          ))}
        </div>
      )}
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
  app: { minHeight: "100vh", background: "#080808", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },

  // Header — thin orange top accent, underline nav
  header: { background: "#080808", borderTop: "2px solid #F97316", borderBottom: "1px solid #141414", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, position: "sticky", top: 0, zIndex: 10 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoImg: { height: 32, width: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid #1E1E1E" },
  logoName: { fontSize: 14, fontWeight: 700, color: "#F97316", lineHeight: 1.2, letterSpacing: "-0.01em" },
  logoSub: { fontSize: 9, color: "#3A3A3A", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" },
  nav: { display: "flex", height: "100%" },
  navBtn: { padding: "0 18px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#4A4A4A", fontFamily: "inherit", borderBottom: "2px solid transparent", display: "flex", alignItems: "center", marginBottom: -1 },
  navBtnActive: { color: "#EEEEEE", borderBottomColor: "#F97316" },
  backBtn: { padding: "7px 16px", borderRadius: 7, border: "1px solid #1A1A1A", background: "transparent", cursor: "pointer", fontSize: 13, color: "#555", fontFamily: "inherit" },
  main: { maxWidth: 720, margin: "0 auto", padding: "0 20px 80px" },

  // Hero — dot grid background, big bold typography
  hero: { display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "64px 24px 52px", marginBottom: 36, backgroundImage: "radial-gradient(circle, #1A1A1A 1px, transparent 1px)", backgroundSize: "24px 24px", borderRadius: 16, position: "relative" },
  heroLabel: { fontSize: 10, fontWeight: 700, color: "#F97316", letterSpacing: "0.22em", textTransform: "uppercase", margin: 0 },
  heroLogo: { width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid #1E1E1E" },
  heroTitle: { fontSize: 46, fontWeight: 800, color: "#EEEEEE", letterSpacing: "-0.035em", margin: 0, textAlign: "center", lineHeight: 1.05 },
  heroStats: { fontSize: 12, color: "#4A4A4A", fontWeight: 500, letterSpacing: "0.05em", margin: 0, textAlign: "center" },
  phoneLink: { display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 8, border: "1px solid #1E1E1E", background: "#0C0C0C", color: "#EEEEEE", fontSize: 15, fontWeight: 600, textDecoration: "none", marginTop: 4 },
  socialRow: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  socialBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 7, border: "1px solid #161616", background: "transparent", color: "#4A4A4A", fontSize: 12, fontWeight: 500, textDecoration: "none", fontFamily: "inherit" },
  footer: { textAlign: "center", paddingBottom: 28 },
  adminLink: { background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#1C1C1C", fontFamily: "inherit" },

  // Value props strip
  valueRow: { display: "flex", alignItems: "stretch", background: "#0C0C0C", border: "1px solid #1A1A1A", borderRadius: 12, marginBottom: 28, overflow: "hidden" },
  valueItem: { flex: 1, display: "flex", alignItems: "center", gap: 14, padding: "20px 22px" },
  valueIconWrap: { width: 38, height: 38, borderRadius: 9, background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  valueTitle: { fontSize: 13, fontWeight: 700, color: "#EEEEEE", marginBottom: 3 },
  valueSub: { fontSize: 11, color: "#3A3A3A", lineHeight: 1.45 },
  valueSep: { width: 1, background: "#141414", flexShrink: 0 },

  // Card — orange top accent border
  card: { background: "#0C0C0C", border: "1px solid #1A1A1A", borderTop: "2px solid #F97316", borderRadius: 12, padding: "32px 28px" },

  // Step progress bar with connecting line
  stepBar: { display: "flex", justifyContent: "space-between", marginBottom: 36, position: "relative" },
  stepLine: { position: "absolute", top: 12, left: "calc(12.5% + 14px)", right: "calc(12.5% + 14px)", height: 1, background: "#1A1A1A" },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, position: "relative", zIndex: 1 },
  stepDot: { width: 26, height: 26, borderRadius: "50%", border: "1px solid #1E1E1E", background: "#0C0C0C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#2E2E2E" },
  stepActive: { border: "2px solid #F97316", color: "#F97316" },
  stepDone: { background: "#F97316", border: "2px solid #F97316", color: "#fff" },
  stepLabel: { fontSize: 11, color: "#2E2E2E", fontWeight: 500, textAlign: "center" },
  stepLabelActive: { color: "#EEEEEE" },

  // Form
  formSection: { display: "flex", flexDirection: "column", gap: 22 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: "#EEEEEE", margin: "0 0 4px", letterSpacing: "-0.02em" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 7 },
  label: { fontSize: 10, fontWeight: 700, color: "#4A4A4A", letterSpacing: "0.1em", textTransform: "uppercase" },
  input: { padding: "11px 14px", border: "1px solid #1A1A1A", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", width: "100%", background: "#080808", color: "#EEEEEE" },

  // Service cards — inset left orange accent on selection
  serviceGrid: { display: "flex", flexDirection: "column", gap: 6 },
  serviceCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", border: "1px solid #161616", borderRadius: 8, background: "#080808", cursor: "pointer", fontFamily: "inherit", textAlign: "left", boxShadow: "inset 4px 0 0 transparent" },
  serviceCardActive: { border: "1px solid #252525", background: "#0C0C0C", boxShadow: "inset 4px 0 0 #F97316" },
  serviceName: { fontSize: 14, fontWeight: 600, color: "#EEEEEE" },
  serviceMeta: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 },
  servicePrice: { fontSize: 20, fontWeight: 800, color: "#F97316", letterSpacing: "-0.02em" },
  serviceDuration: { fontSize: 10, color: "#3A3A3A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" },

  // Vehicle toggle — segmented control
  vehicleToggle: { display: "flex", background: "#080808", border: "1px solid #1A1A1A", borderRadius: 9, padding: 3 },
  vehicleBtn: { flex: 1, padding: "10px 16px", border: "none", borderRadius: 7, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#333", fontFamily: "inherit" },
  vehicleBtnActive: { background: "#171717", color: "#EEEEEE" },

  // Time slots — inset left orange accent on selection
  slotGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 6 },
  slotCard: { padding: "14px 16px", border: "1px solid #161616", borderRadius: 8, background: "#080808", cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 4, boxShadow: "inset 4px 0 0 transparent" },
  slotCardActive: { border: "1px solid #252525", background: "#0C0C0C", boxShadow: "inset 4px 0 0 #F97316" },
  slotDate: { fontSize: 13, fontWeight: 600, color: "#EEEEEE" },
  slotTime: { fontSize: 11, color: "#F97316", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" },

  // Confirm card
  confirmCard: { border: "1px solid #161616", borderRadius: 8, overflow: "hidden" },
  confirmRow: { display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #0F0F0F" },
  confirmLabel: { fontSize: 10, color: "#3A3A3A", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" },
  confirmValue: { fontSize: 13, color: "#EEEEEE", fontWeight: 600, textAlign: "right", maxWidth: "60%" },

  // Buttons
  btnRow: { display: "flex", gap: 10, justifyContent: "flex-end" },
  btnPrimary: { padding: "12px 24px", background: "#F97316", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.09em", textTransform: "uppercase" },
  btnSecondary: { padding: "12px 20px", background: "transparent", color: "#4A4A4A", border: "1px solid #1A1A1A", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em" },
  btnDisabled: { opacity: 0.22, cursor: "not-allowed" },
  errorBox: { background: "#180000", border: "1px solid #380000", color: "#FC8181", padding: "12px 14px", borderRadius: 8, fontSize: 13 },

  // Success
  successIcon: { width: 56, height: 56, borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 20px", color: "#fff", fontWeight: 700 },
  successTitle: { textAlign: "center", fontSize: 22, fontWeight: 700, color: "#EEEEEE", margin: "0 0 12px", letterSpacing: "-0.02em" },
  successBody: { textAlign: "center", fontSize: 14, color: "#777", margin: "0 0 8px", lineHeight: 1.6 },
  successSub: { textAlign: "center", fontSize: 13, color: "#3A3A3A", margin: "0 0 24px" },
  emptyMsg: { textAlign: "center", color: "#2E2E2E", padding: "40px 0", fontSize: 14 },

  // Gallery & section headers
  galleryHero: { textAlign: "center", marginBottom: 32, paddingTop: 36 },
  galleryHeroTitle: { fontSize: 34, fontWeight: 800, color: "#EEEEEE", margin: "0 0 8px", letterSpacing: "-0.03em" },
  galleryHeroSub: { fontSize: 10, color: "#3A3A3A", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", margin: 0 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 8 },
  photoLink: { display: "block", borderRadius: 8, overflow: "hidden", aspectRatio: "1", border: "1px solid #141414" },
  photoImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

  // Floating reviews — left orange border accent
  floatingWrap: { position: "fixed", right: 24, top: "50%", marginTop: -80, zIndex: 5, width: 224 },
  floatingCard: { background: "#0C0C0C", border: "1px solid #1A1A1A", borderLeft: "3px solid #F97316", borderRadius: 10, padding: "14px 16px" },
  floatingStars: { color: "#F97316", fontSize: 13, letterSpacing: 2, marginBottom: 8 },
  floatingComment: { fontSize: 12, color: "#666", lineHeight: 1.5, margin: "0 0 8px", fontStyle: "italic" },
  floatingName: { fontSize: 10, color: "#333", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" },

  // Reviews
  reviewStats: { background: "#0C0C0C", border: "1px solid #1A1A1A", borderRadius: 12, padding: "28px", display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" },
  reviewAvgBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 80 },
  reviewAvgNum: { fontSize: 56, fontWeight: 800, color: "#EEEEEE", lineHeight: 1, letterSpacing: "-0.04em" },
  reviewAvgStars: { display: "flex", gap: 2 },
  reviewCount: { fontSize: 10, color: "#3A3A3A", fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" },
  reviewBars: { flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 200 },
  reviewBarRow: { display: "flex", alignItems: "center", gap: 10 },
  reviewBarLabel: { fontSize: 11, color: "#3A3A3A", width: 24, textAlign: "right", flexShrink: 0, fontWeight: 600 },
  reviewBarTrack: { flex: 1, height: 4, background: "#141414", borderRadius: 99, overflow: "hidden" },
  reviewBarFill: { height: "100%", background: "#F97316", borderRadius: 99, transition: "width 0.6s ease" },
  reviewBarCount: { fontSize: 11, color: "#2E2E2E", width: 20, flexShrink: 0 },
  starPicker: { display: "flex", gap: 0, marginTop: 4 },
  starPickBtn: { background: "none", border: "none", cursor: "pointer", padding: "2px 4px", lineHeight: 1 },
  anonRow: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 6 },
  reviewCard: { background: "#0C0C0C", border: "1px solid #1A1A1A", borderRadius: 10, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 },
  reviewCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  reviewerName: { fontSize: 14, fontWeight: 700, color: "#EEEEEE", marginBottom: 4 },
  reviewDate: { fontSize: 10, color: "#2E2E2E", flexShrink: 0, fontWeight: 600, letterSpacing: "0.04em" },
  reviewComment: { fontSize: 14, color: "#5A5A5A", lineHeight: 1.6, margin: 0 },

  // Admin
  adminTopBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  adminTitle: { fontSize: 22, fontWeight: 700, color: "#EEEEEE", margin: 0, letterSpacing: "-0.02em" },
  refreshBtn: { padding: "7px 14px", background: "transparent", border: "1px solid #1A1A1A", borderRadius: 7, cursor: "pointer", fontSize: 11, color: "#444", fontFamily: "inherit", letterSpacing: "0.04em" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 },
  statCard: { background: "#0C0C0C", border: "1px solid #1A1A1A", borderRadius: 10, padding: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  statNum: { fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em" },
  statLabel: { fontSize: 9, color: "#3A3A3A", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em" },
  filterRow: { display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" },
  filterBtn: { padding: "5px 14px", borderRadius: 20, border: "1px solid #1A1A1A", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#3A3A3A", textTransform: "capitalize", fontFamily: "inherit", letterSpacing: "0.04em" },
  filterBtnActive: { background: "#161616", color: "#EEEEEE", borderColor: "#252525" },
  bookingList: { display: "flex", flexDirection: "column", gap: 10 },
  bookingCard: { background: "#0C0C0C", border: "1px solid #1A1A1A", borderRadius: 10, padding: "16px 20px" },
  bookingTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  bookingName: { fontSize: 15, fontWeight: 700, color: "#EEEEEE", marginBottom: 2 },
  bookingDate: { fontSize: 12, color: "#3A3A3A" },
  badge: { padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" },
  bookingBody: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #111" },
  bookingDetail: { fontSize: 13, color: "#5A5A5A" },
  bookingActions: { display: "flex", alignItems: "center", gap: 10 },
  actionLabel: { fontSize: 9, color: "#2E2E2E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" },
  statusSelect: { padding: "6px 10px", border: "1px solid #1A1A1A", borderRadius: 6, fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#080808", color: "#EEEEEE" },
  adminTabRow: { display: "flex", marginBottom: 24, borderBottom: "1px solid #141414" },
  adminTab: { padding: "10px 20px", background: "none", border: "none", borderBottom: "2px solid transparent", marginBottom: -1, cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#3A3A3A", fontFamily: "inherit", letterSpacing: "0.08em", textTransform: "uppercase" },
  adminTabActive: { color: "#EEEEEE", borderBottomColor: "#F97316" },
  uploadCard: { background: "#0C0C0C", border: "1px solid #1A1A1A", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 14 },
  uploadLabel: { fontSize: 10, fontWeight: 700, color: "#4A4A4A", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" },
  uploadZone: { display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 8, border: "1px dashed #1E1E1E", overflow: "hidden", minHeight: 160 },
  uploadEmpty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 32 },
  uploadIcon: { fontSize: 24, color: "#F97316" },
  uploadPreview: { width: "100%", maxHeight: 260, objectFit: "contain", display: "block" },
  adminPhotoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 },
  adminPhotoCard: { position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "1" },
  adminPhotoImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  deletePhotoBtn: { position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.85)", border: "1px solid #1E1E1E", color: "#bbb", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", lineHeight: 1 },
};
