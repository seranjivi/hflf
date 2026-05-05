import { useState, useMemo } from "react";

const COLORS = {
  pageBg: "#F5F6FA",
  cardBg: "#FFFFFF",
  rowStripe: "#FAFBFC",
  rowHover: "#F1F5F9",
  dividerStrong: "#E2E8F0",
  dividerSubtle: "#EEF1F6",
  navy900: "#0A2342",
  navy800: "#0F1C2E",
  navy700: "#1E3A5F",
  textPrimary: "#0A2342",
  textSecondary: "#475569",
  textMuted: "#64748B",
  textFaint: "#94A3B8",
  blue600: "#2563EB",
  blue700: "#1D4ED8",
  blue50: "#EFF6FF",
  successBg: "#D1FAE5", successText: "#065F46", successDot: "#10B981",
  warningBg: "#FEF3C7", warningText: "#78350F", warningDot: "#F59E0B",
  dangerBg: "#FEE2E2", dangerText: "#991B1B", dangerDot: "#EF4444",
  infoBg: "#DBEAFE", infoText: "#1E3A8A", infoDot: "#2563EB",
  neutralBg: "#F1F5F9", neutralText: "#475569", neutralDot: "#94A3B8",
  sentBackRowBg: "#FFFBEB",
};

const FONT = { sans: "'DM Sans', system-ui, -apple-system, sans-serif", mono: "'JetBrains Mono', 'Consolas', monospace" };

const STATUS_CONFIG = {
  "Pending Approval": { bg: COLORS.warningBg, text: COLORS.warningText, dot: COLORS.warningDot },
  "In Review":        { bg: COLORS.infoBg,    text: COLORS.infoText,    dot: COLORS.infoDot    },
  "Approved":         { bg: COLORS.successBg, text: COLORS.successText, dot: COLORS.successDot },
  "Rejected":         { bg: COLORS.dangerBg,  text: COLORS.dangerText,  dot: COLORS.dangerDot  },
  "Sent Back":        { bg: COLORS.warningBg, text: COLORS.warningText, dot: COLORS.warningDot },
};

const APPROVERS = {
  "Ramesh C": "R",
  "Mohan R":  "M",
  "Deepa V":  "D",
};

const APPROVER_COLORS = {
  "Ramesh C": { bg: "linear-gradient(135deg, #2563EB, #1D4ED8)" },
  "Mohan R":  { bg: "linear-gradient(135deg, #0891b2, #0e7490)" },
  "Deepa V":  { bg: "linear-gradient(135deg, #7c3aed, #6d28d9)" },
};

const ROWS = [
  { id: "BX-20260505-003", submittedAt: "05 May 2026 · 02:33 PM", rule: "Rule 3",  rows: "29 / 8",  status: "Pending Approval", approver: "Ramesh C", lastAction: "05 May 2026 · 02:34 PM", sentBackNote: null },
  { id: "BX-20260505-002", submittedAt: "05 May 2026 · 11:18 AM", rule: "Rule 25", rows: "18 / 5",  status: "In Review",        approver: "Ramesh C", lastAction: "05 May 2026 · 11:21 AM", sentBackNote: null },
  { id: "BX-20260505-001", submittedAt: "05 May 2026 · 09:42 AM", rule: "Rule 11", rows: "10 / 2",  status: "Pending Approval", sentBackNote: null,   approver: "Ramesh C", lastAction: "05 May 2026 · 09:43 AM" },
  { id: "BX-20260502-004", submittedAt: "02 May 2026 · 04:17 PM", rule: "Rule 17", rows: "6 / 2",   status: "Sent Back",        approver: "Ramesh C", lastAction: "03 May 2026 · 09:15 AM", sentBackNote: "Approver requested revision." },
  { id: "BX-20260502-003", submittedAt: "02 May 2026 · 02:05 PM", rule: "Rule 26", rows: "24 / 7",  status: "Approved",         approver: "Mohan R",  lastAction: "03 May 2026 · 10:44 AM", sentBackNote: null },
  { id: "BX-20260502-002", submittedAt: "02 May 2026 · 11:30 AM", rule: "Rule 31", rows: "3 / 1",   status: "Approved",         approver: "Ramesh C", lastAction: "02 May 2026 · 03:18 PM", sentBackNote: null },
  { id: "BX-20260502-001", submittedAt: "02 May 2026 · 09:55 AM", rule: "Rule 30", rows: "15 / 3",  status: "Rejected",         approver: "Deepa V",  lastAction: "02 May 2026 · 02:00 PM", sentBackNote: null },
  { id: "BX-20260430-002", submittedAt: "30 Apr 2026 · 03:44 PM", rule: "Rule 3",  rows: "31 / 9",  status: "Approved",         approver: "Ramesh C", lastAction: "01 May 2026 · 09:30 AM", sentBackNote: null },
  { id: "BX-20260430-001", submittedAt: "30 Apr 2026 · 10:22 AM", rule: "Rule 27", rows: "4 / 1",   status: "Rejected",         approver: "Mohan R",  lastAction: "30 Apr 2026 · 04:55 PM", sentBackNote: null },
  { id: "BX-20260429-002", submittedAt: "29 Apr 2026 · 02:11 PM", rule: "Rule 25", rows: "20 / 6",  status: "Approved",         approver: "Ramesh C", lastAction: "30 Apr 2026 · 10:05 AM", sentBackNote: null },
];

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending Approval"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, color: cfg.text, borderRadius: 4, padding: "3px 10px", fontSize: 11, fontWeight: 700, fontFamily: FONT.sans, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function Avatar({ name, size = 24 }) {
  const initial = APPROVERS[name] || name[0];
  const grad = APPROVER_COLORS[name]?.bg || "linear-gradient(135deg, #2563EB, #1D4ED8)";
  return (
    <span style={{ width: size, height: size, borderRadius: "50%", background: grad, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45, fontWeight: 700, fontFamily: FONT.sans, flexShrink: 0 }}>
      {initial}
    </span>
  );
}

function TopNav() {
  return (
    <div style={{ height: 56, background: COLORS.navy900, display: "flex", alignItems: "center", padding: "0 20px", gap: 12, position: "sticky", top: 0, zIndex: 100, flexShrink: 0 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #1D4ED8, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: FONT.sans }}>HFL</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: FONT.sans, lineHeight: 1 }}>LR Deviation Correction</span>
        <span style={{ color: COLORS.textMuted, fontSize: 11, fontFamily: FONT.sans, lineHeight: 1 }}>Hinduja Leyland Finance · Loan Register</span>
      </div>
      <span style={{ background: "#1E3A5F", color: "#7EB8F7", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, fontFamily: FONT.sans, letterSpacing: "0.4px" }}>PRESALES DEMO</span>
      <div style={{ flex: 1 }} />
      <span style={{ background: "#1E3A5F", color: "#CBD5E1", fontSize: 11, padding: "4px 10px", borderRadius: 4, fontFamily: FONT.sans }}>05 May 2026</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name="Priya M" size={32} />
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: FONT.sans, lineHeight: 1 }}>Priya Menon</span>
          <span style={{ color: COLORS.textFaint, fontSize: 11, fontFamily: FONT.sans, lineHeight: 1 }}>Reviewer</span>
        </div>
      </div>
    </div>
  );
}

function PageTitleBar({ dateRange, setDateRange, search, setSearch }) {
  const ranges = ["Today", "Last 7 days", "Last 30 days", "All time"];
  return (
    <div style={{ height: 48, background: "#fff", borderBottom: `1px solid ${COLORS.dividerStrong}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0 }}>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy900, fontFamily: FONT.sans }}>My submissions</span>
        <span style={{ marginLeft: 10, fontSize: 12, color: COLORS.textSecondary, fontFamily: FONT.sans }}>All batches submitted by Priya Menon</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          style={{ height: 32, padding: "0 10px", border: `1px solid #CBD5E1`, borderRadius: 6, fontSize: 13, fontFamily: FONT.sans, color: COLORS.textPrimary, background: "#fff", cursor: "pointer", outline: "none" }}
        >
          {ranges.map(r => <option key={r}>{r}</option>)}
        </select>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: COLORS.textFaint, fontSize: 13, pointerEvents: "none" }}>⌕</span>
          <input
            type="text"
            placeholder="Search batches…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ height: 32, width: 200, paddingLeft: 28, paddingRight: 12, border: `1px solid #CBD5E1`, borderRadius: 6, fontSize: 13, fontFamily: FONT.sans, color: COLORS.textPrimary, outline: "none", background: "#fff" }}
          />
        </div>
      </div>
    </div>
  );
}

const SUMMARY = [
  { label: "Pending Approval", count: 3, color: COLORS.warningText, bg: COLORS.warningBg, dot: COLORS.warningDot },
  { label: "Approved",         count: 14, color: COLORS.successText, bg: COLORS.successBg, dot: COLORS.successDot },
  { label: "Sent Back",        count: 1, color: COLORS.warningText, bg: COLORS.warningBg, dot: COLORS.warningDot },
  { label: "Rejected",         count: 2, color: COLORS.dangerText,  bg: COLORS.dangerBg,  dot: COLORS.dangerDot  },
  { label: "Total",            count: 20, color: COLORS.textPrimary, bg: COLORS.neutralBg, dot: COLORS.textFaint  },
];

function SummaryStrip() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${COLORS.dividerStrong}`, borderRadius: 8, padding: "10px 18px", display: "flex", alignItems: "center", gap: 0, boxShadow: "0 1px 2px rgba(15,28,46,0.04)" }}>
      {SUMMARY.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, fontFamily: FONT.sans, textTransform: "uppercase", letterSpacing: "0.6px" }}>{s.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
                <span style={{ fontSize: 22, fontWeight: 700, color: s.label === "Total" ? COLORS.navy900 : s.color, fontFamily: FONT.sans, lineHeight: 1 }}>{s.count}</span>
              </div>
            </div>
          </div>
          {i < SUMMARY.length - 1 && (
            <div style={{ width: 1, height: 32, background: COLORS.dividerStrong }} />
          )}
        </div>
      ))}
    </div>
  );
}

function GhostBtn({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ height: 28, padding: "0 10px", background: hov ? COLORS.blue50 : "transparent", color: COLORS.blue600, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: FONT.sans, cursor: "pointer", transition: "background 0.1s" }}
    >
      {children}
    </button>
  );
}

function PrimarySmBtn({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ height: 28, padding: "0 12px", background: hov ? COLORS.blue700 : COLORS.blue600, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: FONT.sans, cursor: "pointer", transition: "background 0.1s" }}
    >
      {children}
    </button>
  );
}

const TH = ({ children, right }) => (
  <th style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: COLORS.textMuted, fontFamily: FONT.sans, textAlign: right ? "right" : "left", whiteSpace: "nowrap", background: "#F8FAFC", borderBottom: `1px solid ${COLORS.dividerStrong}` }}>
    {children}
  </th>
);

function SubmissionsTable({ rows }) {
  const [hovRow, setHovRow] = useState(null);

  return (
    <div style={{ background: "#fff", border: `1px solid ${COLORS.dividerStrong}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 2px rgba(15,28,46,0.04)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "16%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "9%" }} />
        </colgroup>
        <thead>
          <tr>
            <TH>Batch ID</TH>
            <TH>Submitted at</TH>
            <TH>Rule</TH>
            <TH right>Rows</TH>
            <TH>Status</TH>
            <TH>Approver</TH>
            <TH>Last action</TH>
            <TH>Actions</TH>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isSentBack = row.status === "Sent Back";
            const isHov = hovRow === i;
            const rowBg = isSentBack
              ? COLORS.sentBackRowBg
              : isHov
              ? COLORS.rowHover
              : i % 2 === 1
              ? COLORS.rowStripe
              : "#fff";

            return (
              <tr
                key={row.id}
                onMouseEnter={() => setHovRow(i)}
                onMouseLeave={() => setHovRow(null)}
                style={{ background: rowBg, transition: "background 0.1s", cursor: "pointer", borderBottom: `1px solid ${COLORS.dividerSubtle}` }}
              >
                <td style={{ padding: "8px 12px", fontFamily: FONT.mono, fontSize: 12, fontWeight: 500, color: COLORS.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {row.id}
                </td>
                <td style={{ padding: "8px 12px", fontFamily: FONT.mono, fontSize: 12, color: COLORS.textSecondary, whiteSpace: "nowrap" }}>
                  {row.submittedAt}
                </td>
                <td style={{ padding: "8px 12px", fontFamily: FONT.mono, fontSize: 12, fontWeight: 500, color: COLORS.textPrimary }}>
                  {row.rule}
                </td>
                <td style={{ padding: "8px 12px", fontFamily: FONT.mono, fontSize: 12, color: COLORS.textSecondary, textAlign: "right" }}>
                  {row.rows}
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <Badge status={row.status} />
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Avatar name={row.approver} size={22} />
                    <span style={{ fontSize: 12, fontFamily: FONT.sans, color: COLORS.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.approver}</span>
                  </div>
                </td>
                <td style={{ padding: "8px 12px" }}>
                  {isSentBack ? (
                    <div>
                      <span style={{ fontFamily: FONT.mono, fontSize: 11, color: COLORS.textMuted }}>{row.lastAction}</span>
                      <div style={{ fontFamily: FONT.sans, fontSize: 11, color: COLORS.warningText, fontStyle: "italic", marginTop: 1 }}>{row.sentBackNote}</div>
                    </div>
                  ) : (
                    <span style={{ fontFamily: FONT.mono, fontSize: 11, color: COLORS.textMuted }}>{row.lastAction}</span>
                  )}
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <GhostBtn>View</GhostBtn>
                    {isSentBack && <PrimarySmBtn>Revise</PrimarySmBtn>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function MySubmissionsPage() {
  const [dateRange, setDateRange] = useState("All time");
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ROWS;
    return ROWS.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.rule.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q) ||
      r.approver.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: FONT.sans, background: COLORS.pageBg }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <TopNav />
      <PageTitleBar dateRange={dateRange} setDateRange={setDateRange} search={search} setSearch={setSearch} />

      <main style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 12, maxWidth: 1440, width: "100%", boxSizing: "border-box" }}>
        <SummaryStrip />
        <SubmissionsTable rows={filteredRows} />
        {filteredRows.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: COLORS.textMuted, fontSize: 13, fontFamily: FONT.sans, border: `1px dashed #CBD5E1`, borderRadius: 8, background: "#fff" }}>
            No submissions match your search.
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 12, color: COLORS.textFaint, fontFamily: FONT.sans }}>{filteredRows.length} batch{filteredRows.length !== 1 ? "es" : ""} · sorted by submitted at, newest first</span>
          <span style={{ fontSize: 12, color: COLORS.textFaint, fontFamily: FONT.sans }}>Chennai - Central · RBI Compliance · LR v2026.05</span>
        </div>
      </main>
    </div>
  );
}
