export const s = {
  app: { minHeight: "100vh", background: "#080808", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },

  // Header
  header: { background: "#080808", borderBottom: "1px solid #171717", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, position: "sticky", top: 0, zIndex: 10 },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoImg: { height: 48, width: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 },
  logoName: { fontSize: 15, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" },
  nav: { display: "flex", height: "100%", gap: 2, alignItems: "center" },
  navBtn: { padding: "8px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#666", fontFamily: "inherit", display: "flex", alignItems: "center", height: "auto", borderRadius: 8, transition: "color 0.15s" },
  navBtnActive: { color: "#FFFFFF" },
  backBtn: { padding: "7px 16px", borderRadius: 8, border: "1px solid #1C1C1C", background: "transparent", cursor: "pointer", fontSize: 13, color: "#666", fontFamily: "inherit" },
  main: { maxWidth: 720, margin: "0 auto", padding: "0 20px 80px" },

  // Hero
  hero: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "56px 24px 48px", marginBottom: 32 },
  heroLogoWrap: { marginBottom: 4 },
  heroLogo: { width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "2px solid #1C1C1C", display: "block" },
  heroTitle: { fontSize: 52, fontWeight: 800, color: "#F0F0F0", letterSpacing: "-0.04em", margin: 0, textAlign: "center", lineHeight: 1.0 },
  heroRule: { display: "flex", alignItems: "center", gap: 14, width: "100%", maxWidth: 320, margin: "4px 0" },
  heroRuleLine: { flex: 1, height: 1, background: "#1C1C1C" },
  heroStats: { fontSize: 10, color: "#555", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" },
  phoneLink: { display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, border: "1px solid #1C1C1C", background: "#0D0D0D", color: "#F0F0F0", fontSize: 16, fontWeight: 600, textDecoration: "none", marginTop: 4 },
  socialRow: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  socialBtn: { display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, border: "1px solid #1A1A1A", background: "transparent", color: "#555", fontSize: 12, fontWeight: 500, textDecoration: "none", fontFamily: "inherit", transition: "color 0.15s, border-color 0.15s" },
  footer: { textAlign: "center", paddingBottom: 28 },
  adminLink: { background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#1C1C1C", fontFamily: "inherit" },

  // Booking section header
  bookingHeader: { marginBottom: 16 },
  bookingHeaderTitle: { fontSize: 26, fontWeight: 800, color: "#F0F0F0", margin: "0 0 6px", letterSpacing: "-0.03em" },
  bookingHeaderSub: { fontSize: 14, color: "#555", margin: 0 },

  // Value props strip
  valueRow: { display: "flex", background: "#0D0D0D", border: "1px solid #181818", borderRadius: 14, marginBottom: 36, overflow: "hidden" },
  valueItem: { flex: 1, display: "flex", alignItems: "center", gap: 14, padding: "20px 22px" },
  valueIconWrap: { width: 36, height: 36, borderRadius: 8, background: "rgba(249,115,22,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  valueTitle: { fontSize: 13, fontWeight: 700, color: "#EEEEEE", marginBottom: 2 },
  valueSub: { fontSize: 11, color: "#666", lineHeight: 1.4 },
  valueSep: {},

  // Share banner
  shareBanner: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, background: "#0D0D0D", border: "1px solid #181818", borderRadius: 14, padding: "24px 28px", marginTop: 32, flexWrap: "wrap" },
  shareTitle: { fontSize: 16, fontWeight: 700, color: "#EEEEEE", marginBottom: 4, letterSpacing: "-0.01em" },
  shareSub: { fontSize: 13, color: "#555" },
  shareBtn: { display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "#F97316", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 },
  shareBtnCopied: { background: "#14532D", color: "#86EFAC" },

  // Card
  card: { background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: 14, padding: "36px 32px" },

  // Step progress bar
  stepBar: { display: "flex", justifyContent: "space-between", marginBottom: 36, position: "relative" },
  stepLine: { position: "absolute", top: 13, left: "calc(12.5% + 14px)", right: "calc(12.5% + 14px)", height: 1, background: "#1A1A1A" },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, position: "relative", zIndex: 1 },
  stepDot: { width: 28, height: 28, borderRadius: "50%", border: "1px solid #222", background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#555" },
  stepActive: { border: "2px solid #F97316", color: "#F97316" },
  stepDone: { background: "#F97316", border: "2px solid #F97316", color: "#fff" },
  stepLabel: { fontSize: 11, color: "#555", fontWeight: 500, textAlign: "center" },
  stepLabelActive: { color: "#EEEEEE", fontWeight: 600 },

  // Form
  formSection: { display: "flex", flexDirection: "column", gap: 24 },
  sectionTitle: { fontSize: 22, fontWeight: 800, color: "#F0F0F0", margin: "0 0 4px", letterSpacing: "-0.025em" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 11, fontWeight: 600, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase" },
  input: { padding: "12px 14px", border: "1px solid #1C1C1C", borderRadius: 9, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", width: "100%", background: "#080808", color: "#EEEEEE", transition: "border-color 0.15s" },

  // Service cards
  serviceGrid: { display: "flex", flexDirection: "column", gap: 8 },
  serviceCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", border: "1px solid #1C1C1C", borderRadius: 10, background: "#090909", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "border-color 0.15s" },
  serviceCardActive: { border: "1px solid rgba(249,115,22,0.45)", background: "#0E0E0E" },
  serviceName: { fontSize: 14, fontWeight: 600, color: "#EEEEEE" },
  serviceMeta: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 },
  servicePrice: { fontSize: 22, fontWeight: 800, color: "#F97316", letterSpacing: "-0.02em" },
  serviceDuration: { fontSize: 10, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },

  // Vehicle toggle
  vehicleToggle: { display: "flex", background: "#080808", border: "1px solid #1C1C1C", borderRadius: 10, padding: 3 },
  vehicleBtn: { flex: 1, padding: "10px 16px", border: "none", borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#555", fontFamily: "inherit", transition: "all 0.15s" },
  vehicleBtnActive: { background: "#181818", color: "#EEEEEE" },

  // Time slots
  slotGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 8 },
  slotCard: { padding: "14px 16px", border: "1px solid #1C1C1C", borderRadius: 10, background: "#090909", cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 4, transition: "border-color 0.15s" },
  slotCardActive: { border: "1px solid rgba(249,115,22,0.45)", background: "#0E0E0E" },
  slotDate: { fontSize: 13, fontWeight: 600, color: "#EEEEEE" },
  slotTime: { fontSize: 11, color: "#F97316", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" },

  // Confirm card
  confirmCard: { border: "1px solid #1C1C1C", borderRadius: 10, overflow: "hidden" },
  confirmRow: { display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #111" },
  confirmLabel: { fontSize: 10, color: "#666", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
  confirmValue: { fontSize: 13, color: "#EEEEEE", fontWeight: 600, textAlign: "right", maxWidth: "60%" },

  // Buttons
  btnRow: { display: "flex", gap: 10, justifyContent: "flex-end" },
  btnPrimary: { padding: "13px 28px", background: "#F97316", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" },
  btnSecondary: { padding: "13px 22px", background: "transparent", color: "#666", border: "1px solid #1C1C1C", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnDisabled: { opacity: 0.2, cursor: "not-allowed" },
  errorBox: { background: "#180000", border: "1px solid #350000", color: "#FC8181", padding: "12px 14px", borderRadius: 8, fontSize: 13 },

  // Success page
  successView: { display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px 40px", textAlign: "center" },
  successIconLarge: { width: 72, height: 72, borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 28, color: "#fff", fontWeight: 700 },
  successIcon: { width: 56, height: 56, borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 20px", color: "#fff", fontWeight: 700 },
  successTitle: { fontSize: 32, fontWeight: 800, color: "#F0F0F0", margin: "0 0 16px", letterSpacing: "-0.03em" },
  successBody: { fontSize: 15, color: "#666", margin: "0 0 8px", lineHeight: 1.7, maxWidth: 420 },
  successSub: { fontSize: 13, color: "#555", margin: "0 0 36px" },
  successActions: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 },
  successNav: { fontSize: 12, color: "#444", maxWidth: 340 },
  emptyMsg: { textAlign: "center", color: "#555", padding: "40px 0", fontSize: 14 },

  // Gallery & section headers
  galleryHero: { textAlign: "center", marginBottom: 32, paddingTop: 40 },
  galleryHeroTitle: { fontSize: 36, fontWeight: 800, color: "#F0F0F0", margin: "0 0 8px", letterSpacing: "-0.035em" },
  galleryHeroSub: { fontSize: 12, color: "#555", fontWeight: 500, margin: 0 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 },
  photoLink: { display: "block", borderRadius: 10, overflow: "hidden", height: 180, border: "1px solid #151515" },
  photoImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

  // Floating reviews
  floatingWrap: { position: "fixed", right: 20, top: "50%", marginTop: -90, zIndex: 5, width: 220 },
  floatingCard: { background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: 12, padding: "14px 16px" },
  floatingStars: { color: "#F97316", fontSize: 12, letterSpacing: 2, marginBottom: 8 },
  floatingComment: { fontSize: 12, color: "#777", lineHeight: 1.5, margin: "0 0 8px", fontStyle: "italic" },
  floatingName: { fontSize: 10, color: "#555", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" },

  // Reviews
  reviewStats: { background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: 14, padding: "28px", display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" },
  reviewAvgBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 80 },
  reviewAvgNum: { fontSize: 40, fontWeight: 800, color: "#F0F0F0", lineHeight: 1, letterSpacing: "-0.04em" },
  reviewAvgStars: { display: "flex", gap: 2 },
  reviewCount: { fontSize: 10, color: "#555", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" },
  reviewBars: { flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 200 },
  reviewBarRow: { display: "flex", alignItems: "center", gap: 10 },
  reviewBarLabel: { fontSize: 11, color: "#666", width: 24, textAlign: "right", flexShrink: 0, fontWeight: 600 },
  reviewBarTrack: { flex: 1, height: 4, background: "#141414", borderRadius: 99, overflow: "hidden" },
  reviewBarFill: { height: "100%", background: "#F97316", borderRadius: 99, transition: "width 0.6s ease" },
  reviewBarCount: { fontSize: 11, color: "#555", width: 20, flexShrink: 0 },
  starPicker: { display: "flex", gap: 0, marginTop: 4 },
  starPickBtn: { background: "none", border: "none", cursor: "pointer", padding: "2px 4px", lineHeight: 1 },
  anonRow: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 6 },
  reviewCard: { background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 },
  reviewCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  reviewerName: { fontSize: 14, fontWeight: 700, color: "#EEEEEE", marginBottom: 4 },
  reviewDate: { fontSize: 10, color: "#555", flexShrink: 0, fontWeight: 600, letterSpacing: "0.04em" },
  reviewComment: { fontSize: 14, color: "#777", lineHeight: 1.6, margin: 0 },

  // Admin
  adminTopBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  adminTitle: { fontSize: 22, fontWeight: 700, color: "#EEEEEE", margin: 0, letterSpacing: "-0.02em" },
  refreshBtn: { padding: "7px 14px", background: "transparent", border: "1px solid #1C1C1C", borderRadius: 8, cursor: "pointer", fontSize: 11, color: "#666", fontFamily: "inherit" },
  addServiceBtn: { padding: "7px 14px", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 8, cursor: "pointer", fontSize: 11, color: "#F97316", fontFamily: "inherit", fontWeight: 700 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 },
  revenueCard: { background: "#0D0D0D", border: "1px solid #1C1C1C", borderLeft: "3px solid #86EFAC", borderRadius: 12, padding: "16px 22px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" },
  revenueLabel: { fontSize: 9, color: "#666", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 },
  revenueAmount: { fontSize: 34, fontWeight: 800, color: "#86EFAC", letterSpacing: "-0.03em" },
  revenueSub: { fontSize: 11, color: "#555" },
  statCard: { background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: 10, padding: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  statNum: { fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em" },
  statLabel: { fontSize: 9, color: "#666", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em" },
  filterRow: { display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" },
  filterBtn: { padding: "5px 14px", borderRadius: 20, border: "1px solid #1C1C1C", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#666", textTransform: "capitalize", fontFamily: "inherit" },
  filterBtnActive: { background: "#181818", color: "#EEEEEE", borderColor: "#282828" },
  bookingList: { display: "flex", flexDirection: "column", gap: 10 },
  bookingCard: { background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: 12, padding: "16px 20px" },
  bookingTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  bookingName: { fontSize: 15, fontWeight: 700, color: "#EEEEEE", marginBottom: 2 },
  bookingDate: { fontSize: 12, color: "#666" },
  badge: { padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" },
  bookingBody: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #131313" },
  bookingDetail: { fontSize: 13, color: "#777" },
  bookingActions: { display: "flex", alignItems: "center", gap: 10 },
  actionLabel: { fontSize: 9, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" },
  statusSelect: { padding: "6px 10px", border: "1px solid #1C1C1C", borderRadius: 7, fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#080808", color: "#EEEEEE" },
  bookingTopActions: { display: "flex", alignItems: "center", gap: 8 },
  trashBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: "1px solid #222", background: "#0A0A0A", color: "#F87171", cursor: "pointer" },
  adminTabRow: { display: "flex", marginBottom: 24, borderBottom: "1px solid #151515" },
  adminTab: { padding: "10px 20px", background: "none", border: "none", borderBottom: "2px solid transparent", marginBottom: -1, cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#666", fontFamily: "inherit", letterSpacing: "0.06em", textTransform: "uppercase" },
  adminTabActive: { color: "#EEEEEE", borderBottomColor: "#F97316" },
  uploadCard: { background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 14 },
  uploadLabel: { fontSize: 10, fontWeight: 700, color: "#666", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" },
  uploadZone: { display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 8, border: "1px dashed #1C1C1C", overflow: "hidden", minHeight: 160 },
  uploadEmpty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 32 },
  uploadIcon: { fontSize: 24, color: "#F97316" },
  uploadPreview: { width: "100%", maxHeight: 260, objectFit: "contain", display: "block" },
  adminPhotoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 },
  adminPhotoCard: { position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "1" },
  adminPhotoImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  deletePhotoBtn: { position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.85)", border: "1px solid #1E1E1E", color: "#bbb", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", lineHeight: 1 },
};
