import { useState, useEffect } from "react";
import { supabase, SERVICES, ADMIN_PASSWORD, getPriceFromBooking, cleanNotes, STATUS_STYLES } from "./config.js";
import { s } from "./styles.js";

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

function AdminAddBooking({ onDone }) {
  const [form, setForm] = useState({
    client_name: "", client_phone: "", client_email: "",
    vehicle_type: "sedan", service_type: "",
    booking_date: new Date().toISOString().split("T")[0],
    booking_time: "", notes: "", status: "completed",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const svc = SERVICES.find(sv => sv.name === form.service_type);
  const price = svc ? svc.prices[form.vehicle_type] : null;

  const submit = async () => {
    if (!form.client_name || !form.service_type || !form.booking_date || !form.booking_time) {
      setError("Name, service, date, and time are required.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.from("bookings").insert([{
      client_name: form.client_name,
      client_email: form.client_email || null,
      client_phone: form.client_phone || null,
      service_type: form.service_type,
      booking_date: form.booking_date,
      booking_time: form.booking_time,
      notes: `[vehicle:${form.vehicle_type}]${form.notes ? "\n" + form.notes : ""}`,
      status: form.status,
    }]);
    setLoading(false);
    if (err) { setError("Something went wrong. Please try again."); return; }
    onDone();
  };

  return (
    <div style={s.card}>
      <div style={s.formSection}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={s.sectionTitle}>Add Service</h2>
          <button style={s.btnSecondary} onClick={onDone}>Cancel</button>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Client name</label>
          <input style={s.input} value={form.client_name} onChange={e => set("client_name", e.target.value)} placeholder="Jane Smith" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Phone <span style={{ color: "#888888", fontWeight: 400 }}>(optional)</span></label>
          <input style={s.input} type="tel" value={form.client_phone} onChange={e => set("client_phone", e.target.value)} placeholder="(555) 000-0000" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Email <span style={{ color: "#888888", fontWeight: 400 }}>(optional)</span></label>
          <input style={s.input} type="email" value={form.client_email} onChange={e => set("client_email", e.target.value)} placeholder="you@example.com" />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Vehicle type</label>
          <div style={s.vehicleToggle}>
            {["sedan", "suv"].map(v => (
              <button key={v} style={{ ...s.vehicleBtn, ...(form.vehicle_type === v ? s.vehicleBtnActive : {}) }} onClick={() => set("vehicle_type", v)}>
                {v === "sedan" ? "Sedan" : "SUV / Truck"}
              </button>
            ))}
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Service</label>
          <div style={s.serviceGrid}>
            {SERVICES.map(sv => (
              <button key={sv.id} className="svc-card" style={{ ...s.serviceCard, ...(form.service_type === sv.name ? s.serviceCardActive : {}) }} onClick={() => set("service_type", sv.name)}>
                <span style={s.serviceName}>{sv.name}</span>
                <div style={s.serviceMeta}>
                  <span style={s.servicePrice}>${sv.prices[form.vehicle_type]}</span>
                  <span style={s.serviceDuration}>{sv.duration}</span>
                </div>
              </button>
            ))}
          </div>
          {price !== null && <div style={{ fontSize: 13, color: "#86EFAC", fontWeight: 700, marginTop: 6 }}>Price: ${price}</div>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Date</label>
            <input style={s.input} type="date" value={form.booking_date} onChange={e => set("booking_date", e.target.value)} />
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>Admin can enter any date here for custom bookings.</div>
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Time</label>
            <input style={s.input} value={form.booking_time} onChange={e => set("booking_time", e.target.value)} placeholder="e.g. 10:00 AM" />
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>Enter any time for the booking; regular clients still use available slots.</div>
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Status</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["completed", "confirmed", "pending"].map(st => (
              <button key={st} style={{ ...s.filterBtn, ...(form.status === st ? s.filterBtnActive : {}) }} onClick={() => set("status", st)}>{st}</button>
            ))}
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Notes <span style={{ color: "#888888", fontWeight: 400 }}>(optional)</span></label>
          <textarea style={{ ...s.input, minHeight: 80, resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Car make/model, special requests..." />
        </div>

        {error && <div style={s.errorBox}>{error}</div>}
        <button style={{ ...s.btnPrimary, ...(!form.client_name || !form.service_type || !form.booking_date || !form.booking_time ? s.btnDisabled : {}) }} disabled={loading || !form.client_name || !form.service_type || !form.booking_date || !form.booking_time} onClick={submit}>
          {loading ? "Adding..." : "Add Service"}
        </button>
      </div>
    </div>
  );
}

function AdminEditBooking({ booking, onDone }) {
  const vehicleMatch = (booking.notes || "").match(/\[vehicle:(sedan|suv)\]/);
  const [form, setForm] = useState({
    client_name: booking.client_name || "",
    client_phone: booking.client_phone || "",
    client_email: booking.client_email || "",
    vehicle_type: vehicleMatch ? vehicleMatch[1] : "sedan",
    service_type: booking.service_type || "",
    booking_date: booking.booking_date || "",
    booking_time: booking.booking_time || "",
    notes: cleanNotes(booking.notes) || "",
    status: booking.status || "pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const svc = SERVICES.find(sv => sv.name === form.service_type);
  const price = svc ? svc.prices[form.vehicle_type] : null;

  const submit = async () => {
    if (!form.client_name || !form.service_type || !form.booking_date || !form.booking_time) {
      setError("Name, service, date, and time are required.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.from("bookings").update({
      client_name: form.client_name,
      client_email: form.client_email || null,
      client_phone: form.client_phone || null,
      service_type: form.service_type,
      booking_date: form.booking_date,
      booking_time: form.booking_time,
      notes: `[vehicle:${form.vehicle_type}]${form.notes ? "\n" + form.notes : ""}`,
      status: form.status,
    }).eq("id", booking.id);
    setLoading(false);
    if (err) { setError("Something went wrong. Please try again."); return; }
    onDone();
  };

  return (
    <div style={s.card}>
      <div style={s.formSection}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={s.sectionTitle}>Edit Booking</h2>
          <button style={s.btnSecondary} onClick={onDone}>Cancel</button>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Client name</label>
          <input style={s.input} value={form.client_name} onChange={e => set("client_name", e.target.value)} placeholder="Jane Smith" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Phone <span style={{ color: "#888888", fontWeight: 400 }}>(optional)</span></label>
          <input style={s.input} type="tel" value={form.client_phone} onChange={e => set("client_phone", e.target.value)} placeholder="(555) 000-0000" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Email <span style={{ color: "#888888", fontWeight: 400 }}>(optional)</span></label>
          <input style={s.input} type="email" value={form.client_email} onChange={e => set("client_email", e.target.value)} placeholder="you@example.com" />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Vehicle type</label>
          <div style={s.vehicleToggle}>
            {["sedan", "suv"].map(v => (
              <button key={v} style={{ ...s.vehicleBtn, ...(form.vehicle_type === v ? s.vehicleBtnActive : {}) }} onClick={() => set("vehicle_type", v)}>
                {v === "sedan" ? "Sedan" : "SUV / Truck"}
              </button>
            ))}
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Service</label>
          <div style={s.serviceGrid}>
            {SERVICES.map(sv => (
              <button key={sv.id} className="svc-card" style={{ ...s.serviceCard, ...(form.service_type === sv.name ? s.serviceCardActive : {}) }} onClick={() => set("service_type", sv.name)}>
                <span style={s.serviceName}>{sv.name}</span>
                <div style={s.serviceMeta}>
                  <span style={s.servicePrice}>${sv.prices[form.vehicle_type]}</span>
                  <span style={s.serviceDuration}>{sv.duration}</span>
                </div>
              </button>
            ))}
          </div>
          {price !== null && <div style={{ fontSize: 13, color: "#86EFAC", fontWeight: 700, marginTop: 6 }}>Price: ${price}</div>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Date</label>
            <input style={s.input} type="date" value={form.booking_date} onChange={e => set("booking_date", e.target.value)} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Time</label>
            <input style={s.input} value={form.booking_time} onChange={e => set("booking_time", e.target.value)} placeholder="e.g. 10:00 AM" />
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Status</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["pending", "confirmed", "completed", "cancelled"].map(st => (
              <button key={st} style={{ ...s.filterBtn, ...(form.status === st ? s.filterBtnActive : {}) }} onClick={() => set("status", st)}>{st}</button>
            ))}
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Notes <span style={{ color: "#888888", fontWeight: 400 }}>(optional)</span></label>
          <textarea style={{ ...s.input, minHeight: 80, resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Car make/model, special requests..." />
        </div>

        {error && <div style={s.errorBox}>{error}</div>}
        <button
          style={{ ...s.btnPrimary, ...(!form.client_name || !form.service_type || !form.booking_date || !form.booking_time ? s.btnDisabled : {}) }}
          disabled={loading || !form.client_name || !form.service_type || !form.booking_date || !form.booking_time}
          onClick={submit}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function AdminView() {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

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

  const archiveBooking = async (id) => {
    if (!window.confirm("Archive this booking? You can restore it later from Archived.")) return;
    await supabase.from("bookings").update({ status: "archived" }).eq("id", id);
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: "archived" } : bk));
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking permanently? This cannot be undone.")) return;
    await supabase.from("bookings").delete().eq("id", id);
    setBookings(b => b.filter(bk => bk.id !== id));
  };

  const restoreBooking = async (id) => {
    await supabase.from("bookings").update({ status: "pending" }).eq("id", id);
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: "pending" } : bk));
  };

  const filtered = filter === "all" ? bookings.filter(b => b.status !== "archived") : bookings.filter(b => b.status === filter);
  const counts = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});
  const completedBookings = bookings.filter(b => b.status === "completed");
  const revenue = completedBookings.reduce((sum, b) => sum + (getPriceFromBooking(b) ?? 0), 0);

  return (
    <div>
      <div style={s.adminTopBar}>
        <h1 style={s.adminTitle}>Admin</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {tab === "bookings" && !adding && !editingBooking && (
            <>
              <button style={s.addServiceBtn} onClick={() => setAdding(true)}>+ Add Service</button>
              <button style={s.refreshBtn} onClick={fetchBookings}>↻ Refresh</button>
            </>
          )}
        </div>
      </div>

      <div style={s.adminTabRow}>
        {["bookings", "archived", "gallery"].map(t => (
          <button key={t} style={{ ...s.adminTab, ...(tab === t ? s.adminTabActive : {}) }} onClick={() => { setTab(t); setAdding(false); setEditingBooking(null); }}>
            {t === "bookings" ? "Bookings" : t === "archived" ? "Archived" : "Gallery Photos"}
          </button>
        ))}
      </div>

      {tab === "gallery" && <PhotoManager />}

      {tab === "bookings" && adding && (
        <AdminAddBooking onDone={() => { setAdding(false); fetchBookings(); }} />
      )}

      {tab === "bookings" && editingBooking && (
        <AdminEditBooking booking={editingBooking} onDone={() => { setEditingBooking(null); fetchBookings(); }} />
      )}

      {tab === "bookings" && !adding && !editingBooking && (
        <>
          <div style={s.statsRow}>
            {[["total", bookings.length, "#F97316"], ["pending", counts.pending || 0, "#FB923C"], ["confirmed", counts.confirmed || 0, "#60A5FA"], ["completed", counts.completed || 0, "#86EFAC"]].map(([label, count, color]) => (
              <div key={label} style={s.statCard}>
                <span style={{ ...s.statNum, color }}>{count}</span>
                <span style={s.statLabel}>{label}</span>
              </div>
            ))}
          </div>

          <div style={s.revenueCard}>
            <div>
              <div style={s.revenueLabel}>Revenue · Completed Jobs</div>
              <div style={s.revenueSub}>{completedBookings.length} job{completedBookings.length !== 1 ? "s" : ""} completed</div>
            </div>
            <div style={s.revenueAmount}>${revenue.toLocaleString()}</div>
          </div>

          <div style={s.filterRow}>
            {["all", "pending", "confirmed", "completed", "cancelled"].map(f => (
              <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }} onClick={() => setFilter(f)}>{f}</button>
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
                const bPrice = getPriceFromBooking(b);
                const notesDisplay = cleanNotes(b.notes);
                return (
                  <div key={b.id} style={s.bookingCard}>
                    <div style={s.bookingTop}>
                      <div>
                        <div style={s.bookingName}>{b.client_name}</div>
                        <div style={s.bookingDate}>
                          {new Date(b.booking_date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {b.booking_time}
                        </div>
                      </div>
                      <div style={s.bookingTopActions}>
                        <span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span>
                        <button style={s.trashBtn} onClick={() => setEditingBooking(b)} title="Edit booking">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button style={s.trashBtn} onClick={() => archiveBooking(b.id)} title="Archive booking">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 4h14v4H5z" />
                            <path d="M7 8v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div style={s.bookingBody}>
                      <div style={s.bookingDetail}>
                        <strong>Service:</strong> {b.service_type}
                        {bPrice !== null && <span style={{ color: "#86EFAC", marginLeft: 8, fontWeight: 700 }}>${bPrice}</span>}
                      </div>
                      {b.client_email && <div style={s.bookingDetail}><strong>Email:</strong> {b.client_email}</div>}
                      {b.client_phone && <div style={s.bookingDetail}><strong>Phone:</strong> {b.client_phone}</div>}
                      {notesDisplay && <div style={s.bookingDetail}><strong>Notes:</strong> {notesDisplay}</div>}
                    </div>
                    <div style={s.bookingActions}>
                      <span style={s.actionLabel}>Update status:</span>
                      <select style={s.statusSelect} value={b.status} onChange={e => updateStatus(b.id, e.target.value)}>
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
        </>
      )}

      {tab === "archived" && (
        <>
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <span style={{ ...s.statNum, color: "#A3A3A3" }}>{bookings.filter(b => b.status === "archived").length}</span>
              <span style={s.statLabel}>Archived</span>
            </div>
          </div>

          {loading ? (
            <p style={s.emptyMsg}>Loading...</p>
          ) : bookings.filter(b => b.status === "archived").length === 0 ? (
            <p style={s.emptyMsg}>No archived bookings yet.</p>
          ) : (
            <div style={s.bookingList}>
              {bookings.filter(b => b.status === "archived").map(b => {
                const st = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
                const bPrice = getPriceFromBooking(b);
                const notesDisplay = cleanNotes(b.notes);
                return (
                  <div key={b.id} style={s.bookingCard}>
                    <div style={s.bookingTop}>
                      <div>
                        <div style={s.bookingName}>{b.client_name}</div>
                        <div style={s.bookingDate}>
                          {new Date(b.booking_date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {b.booking_time}
                        </div>
                      </div>
                      <div style={s.bookingTopActions}>
                        <span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span>
                        <button style={s.trashBtn} onClick={() => restoreBooking(b.id)} title="Restore booking">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12h3l3 9 3-18 3 18 3-9h3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div style={s.bookingBody}>
                      <div style={s.bookingDetail}>
                        <strong>Service:</strong> {b.service_type}
                        {bPrice !== null && <span style={{ color: "#86EFAC", marginLeft: 8, fontWeight: 700 }}>${bPrice}</span>}
                      </div>
                      {b.client_email && <div style={s.bookingDetail}><strong>Email:</strong> {b.client_email}</div>}
                      {b.client_phone && <div style={s.bookingDetail}><strong>Phone:</strong> {b.client_phone}</div>}
                      {notesDisplay && <div style={s.bookingDetail}><strong>Notes:</strong> {notesDisplay}</div>}
                    </div>
                    <div style={s.bookingActions}>
                      <button style={{ ...s.filterBtn, borderRadius: 6, padding: "8px 12px" }} onClick={() => deleteBooking(b.id)}>Delete permanently</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminRoot({ adminAuthed, onAuth }) {
  if (!adminAuthed) return <AdminLogin onAuth={onAuth} />;
  return <AdminView />;
}
