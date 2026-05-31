import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { supabase, SERVICES, getAvailableSlots } from "./config.js";
import { s } from "./styles.js";

const AdminRoot = lazy(() => import("./Admin.jsx"));

function NavTabs({ view, setView }) {
  const ref = useRef(null);
  const [ind, setInd] = useState({ left: 0, width: 0 });
  const [pop, setPop] = useState(false);
  const tabs = [{ key: "client", label: "Book" }, { key: "gallery", label: "Gallery" }, { key: "reviews", label: "Reviews" }];

  useEffect(() => {
    if (!ref.current) return;
    const idx = tabs.findIndex(t => t.key === view);
    if (idx < 0) return;
    const btn = ref.current.querySelectorAll("button")[idx];
    if (btn) setInd({ left: btn.offsetLeft, width: btn.offsetWidth });
    setPop(true);
    const t = setTimeout(() => setPop(false), 260);
    return () => clearTimeout(t);
  }, [view]);

  return (
    <div style={{ position: "relative", display: "flex", height: "100%" }} ref={ref}>
      <div style={{ position: "absolute", top: "50%", left: ind.left + (ind.width / 2) - 22, width: 44, height: 44, transform: `translateY(-50%) scale(${pop ? 1 : 0.82})`, transition: "left 0.28s cubic-bezier(0.2,0.9,0.2,1), transform 0.28s cubic-bezier(0.2,0.9,0.2,1)", borderRadius: 9999, background: "rgba(249,115,22,0.08)", pointerEvents: "none", zIndex: 0 }} />
      {tabs.map(t => (
        <button key={t.key} className="nav-btn" style={{ ...s.navBtn, ...(view === t.key ? s.navBtnActive : {}), position: "relative", zIndex: 1 }} onClick={() => setView(t.key)}>
          {t.label}
        </button>
      ))}
      <div style={{ position: "absolute", bottom: -4, left: ind.left, width: ind.width, height: 3, background: "#F97316", borderRadius: 3, boxShadow: "0 4px 12px rgba(249,115,22,0.12)", transition: "left 0.32s cubic-bezier(0.2,0.9,0.2,1), width 0.32s cubic-bezier(0.2,0.9,0.2,1), opacity 0.2s", pointerEvents: "none" }} />
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("client");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookedForm, setBookedForm] = useState(null);

  const handleBooked = (form) => { setBooked(true); setBookedForm(form); };
  const handleReset = () => { setBooked(false); setBookedForm(null); };

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div style={s.logo}>
          <img src="/logo.png" alt="C&H Elite Auto Detailing" style={s.logoImg} />
          <div className="logo-label">
            <div style={s.logoName}><span style={{ color: "#F97316" }}>C&H</span> <span style={{ color: "#EEEEEE", fontWeight: 400 }}>Elite Auto Detailing</span></div>
          </div>
        </div>
        {view !== "admin" ? (
          <NavTabs view={view} setView={(v) => { setView(v); if (v !== "client") handleReset(); }} />
        ) : (
          <button style={s.backBtn} onClick={() => setView("client")}>← Back</button>
        )}
      </header>

      <main style={s.main}>
        {view === "client" && booked && <SuccessView form={bookedForm} onReset={handleReset} />}
        {view === "client" && !booked && (
          <>
            <div style={s.hero}>
              <div style={s.heroLogoWrap}>
                <img src="/logo.png" alt="C&H Elite Auto Detailing" style={s.heroLogo} />
              </div>
              <h1 style={s.heroTitle}>C&H Elite<br />Auto Detailing</h1>
              <div style={s.heroRule}>
                <div style={s.heroRuleLine} />
                <span style={s.heroStats}>Mobile · Northern Virginia</span>
                <div style={s.heroRuleLine} />
              </div>
              <a href="tel:7033767536" style={s.phoneLink}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3-8.63A2 2 0 0 1 3 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z"/></svg>
                (703) 376-7536
              </a>
              <div style={s.socialRow}>
                <a href="https://instagram.com/ch.autodetails" target="_blank" rel="noopener noreferrer" style={s.socialBtn} className="social-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                  @ch.autodetails
                </a>
                <a href="https://www.facebook.com/people/CH-Elite-Auto-Detailing/61572140056742/" target="_blank" rel="noopener noreferrer" style={s.socialBtn} className="social-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  C&H Elite Auto Detailing
                </a>
              </div>
            </div>
            <ValueProps />
            <div style={s.bookingHeader}>
              <h2 style={s.bookingHeaderTitle}>Book Your Detail</h2>
              <p style={s.bookingHeaderSub}>Pick your service, choose a time, and we come to you.</p>
            </div>
            <ClientView onBooked={handleBooked} />
            <ShareBanner />
            <FloatingReviews />
          </>
        )}
        {view === "gallery" && <GalleryView />}
        {view === "reviews" && <ReviewsView />}
        {view === "admin" && (
          <Suspense fallback={null}>
            <AdminRoot adminAuthed={adminAuthed} onAuth={() => setAdminAuthed(true)} />
          </Suspense>
        )}
      </main>

      {view !== "admin" && (
        <footer style={s.footer}>
          <button style={s.adminLink} onClick={() => setView("admin")}>admin</button>
        </footer>
      )}
    </div>
  );
}

function ValueProps() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 600);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 600);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const items = [
    { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, title: "We Come to You", sub: "Mobile service at your home or office" },
    { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Professional Service", sub: "Quality results every time" },
    { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title: "5-Star Rated", sub: "Top-rated in Northern Virginia" },
  ];

  const sepStyle = mobile
    ? { height: 1, background: "#141414" }
    : { width: 1, background: "#141414", alignSelf: "stretch", flexShrink: 0 };

  return (
    <div style={{ ...s.valueRow, flexDirection: mobile ? "column" : "row" }}>
      {items.map((item, i) => (
        <>
          <div key={i} style={s.valueItem}>
            <div style={s.valueIconWrap}>{item.icon}</div>
            <div>
              <div style={s.valueTitle}>{item.title}</div>
              <div style={s.valueSub}>{item.sub}</div>
            </div>
          </div>
          {i < 2 && <div key={`sep-${i}`} style={sepStyle} />}
        </>
      ))}
    </div>
  );
}

function ShareBanner() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const data = {
      title: "C&H Elite Auto Detailing",
      text: "Check out C&H Elite Auto Detailing — premium mobile detailing in Northern Virginia!",
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(`${data.text} ${data.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={s.shareBanner}>
      <div>
        <div style={s.shareTitle}>Know someone who needs a detail?</div>
        <div style={s.shareSub}>Send them our way — one tap shares the link.</div>
      </div>
      <button style={{ ...s.shareBtn, ...(copied ? s.shareBtnCopied : {}) }} onClick={handleShare}>
        {copied ? "Link copied!" : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Recommend Us
          </>
        )}
      </button>
    </div>
  );
}

function SuccessView({ form, onReset }) {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const data = { title: "C&H Elite Auto Detailing", text: "Check out C&H Elite Auto Detailing — premium mobile detailing in Northern Virginia!", url: window.location.href };
    if (navigator.share) { try { await navigator.share(data); } catch (_) {} }
    else { await navigator.clipboard.writeText(`${data.text} ${data.url}`); setCopied(true); setTimeout(() => setCopied(false), 2500); }
  };

  return (
    <div style={s.successView}>
      <div style={s.successIconLarge}>✓</div>
      <h2 style={s.successTitle}>You're booked!</h2>
      <p style={s.successBody}>
        {form.client_name}, we've received your booking for <strong>{form.service_type}</strong> on{" "}
        <strong>{form.displayDate}</strong> at <strong>{form.booking_time}</strong>.
      </p>
      <p style={s.successSub}>We'll be in touch at {form.client_email}.</p>
      <div style={s.successActions}>
        <button style={s.btnPrimary} onClick={onReset}>Book another</button>
        <button style={{ ...s.shareBtn, ...(copied ? s.shareBtnCopied : {}) }} onClick={handleShare}>
          {copied ? "Link copied!" : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Recommend Us
            </>
          )}
        </button>
      </div>
      <p style={s.successNav}>Or explore: use the tabs above to view our Gallery or leave a Review.</p>
    </div>
  );
}

function ClientView({ onBooked }) {
  const slots = useMemo(() => getAvailableSlots(), []);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    client_name: "", client_email: "", client_phone: "", vehicle_type: "",
    service_type: "", booking_date: "", booking_time: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    supabase.from("bookings").select("booking_date, booking_time").then(({ data }) => {
      if (data) setBookedSlots(data.map((b) => `${b.booking_date}|${b.booking_time}`));
    });
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const availableSlots = useMemo(
    () => slots.filter((sl) => !bookedSlots.includes(`${sl.date}|${sl.time}`)),
    [slots, bookedSlots]
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
      notes: `[vehicle:${form.vehicle_type}]${form.notes ? "\n" + form.notes : ""}`,
      status: "pending",
    }]);
    setLoading(false);
    if (err) { setError("Something went wrong. Please try again."); return; }
    onBooked({ ...form, displayDate: slots.find(sl => sl.date === form.booking_date && sl.time === form.booking_time)?.displayDate });
  };

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
                className="svc-card"
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
                  className="slot-card"
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
            <Row label="Price" value={`$${SERVICES.find(sv => sv.name === form.service_type)?.prices[form.vehicle_type] ?? "—"}`} />
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

  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : 0;
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
                    <span style={{ color: (hovered || form.rating) >= n ? "#F97316" : "rgba(255,255,255,0.15)", fontSize: 28, lineHeight: 1, display: "block" }}>★</span>
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
              <img src={ph.url} alt="Detailing work" style={s.photoImg} loading="lazy" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
