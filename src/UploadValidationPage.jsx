import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
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
  successText: "#065F46", successBg: "#D1FAE5", successDot: "#10B981",
  warningText: "#78350F", warningBg: "#FEF3C7", warningDot: "#F59E0B",
  dangerText: "#991B1B", dangerBg: "#FEE2E2", dangerDot: "#EF4444",
  infoText: "#1E3A8A", infoBg: "#DBEAFE", infoDot: "#2563EB",
  neutralText: "#475569", neutralBg: "#F1F5F9", neutralDot: "#94A3B8",
};

const T = {
  pageTitle: { fontSize: 18, fontWeight: 700, color: C.navy900 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: C.navy900 },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.7px", color: C.textMuted, textTransform: "uppercase" },
  body: { fontSize: 13, fontWeight: 400, lineHeight: 1.5 },
  tableHeader: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: C.textMuted },
  tableCell: { fontSize: 12, fontWeight: 400, color: C.textPrimary },
  mono: { fontFamily: "'JetBrains Mono', 'Consolas', monospace" },
  metricNum: { fontSize: 22, fontWeight: 700, color: C.navy900 },
  badge: { fontSize: 11, fontWeight: 700 },
  fieldLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", color: C.textFaint, textTransform: "uppercase" },
};

// ─── Shared components ────────────────────────────────────────────────────────

function Badge({ type, label }) {
  const map = {
    danger:  { bg: C.dangerBg,  text: C.dangerText,  dot: C.dangerDot },
    success: { bg: C.successBg, text: C.successText, dot: C.successDot },
    warning: { bg: C.warningBg, text: C.warningText, dot: C.warningDot },
    info:    { bg: C.infoBg,    text: C.infoText,    dot: C.infoDot },
    neutral: { bg: C.neutralBg, text: C.neutralText, dot: C.neutralDot },
  };
  const s = map[type] || map.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 8px", borderRadius: 4,
      background: s.bg, color: s.text,
      ...T.badge, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}

function Btn({ variant = "primary", children, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  const styles = {
    primary: {
      bg: disabled ? C.dividerStrong : hov ? C.blue700 : C.blue600,
      color: disabled ? C.textFaint : "#fff",
      border: "none",
    },
    secondary: {
      bg: hov ? "#F8FAFC" : "#fff",
      color: C.navy900,
      border: `1px solid ${hov ? C.textFaint : "#CBD5E1"}`,
    },
    ghost: {
      bg: hov ? C.blue50 : "transparent",
      color: C.blue600,
      border: "none",
    },
    danger: {
      bg: hov ? "#DC2626" : "#EF4444",
      color: "#fff",
      border: "none",
    },
  };
  const s = styles[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 32, padding: "0 16px", borderRadius: 6,
        fontSize: 13, fontWeight: 600, letterSpacing: "0.2px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex", alignItems: "center", gap: 6,
        background: s.bg, color: s.color, border: s.border || "none",
        fontFamily: "inherit", transition: "background 0.12s, border-color 0.12s",
      }}
    >
      {children}
    </button>
  );
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────

function TopNav() {
  return (
    <nav style={{
      height: 56, background: C.navy900, display: "flex", alignItems: "center",
      padding: "0 20px", gap: 12, position: "sticky", top: 0, zIndex: 100,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* Logo */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: "linear-gradient(135deg, #1D4ED8, #06B6D4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
      }}>HFL</div>

      {/* App name */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>
          LR Deviation Correction
        </span>
        <span style={{ color: C.textMuted, fontSize: 11, lineHeight: 1.2 }}>
          Hinduja Leyland Finance · Loan Register
        </span>
      </div>

      {/* Demo pill */}
      <span style={{
        background: C.navy700, color: "#7EB8F7", fontSize: 10, fontWeight: 700,
        padding: "2px 8px", borderRadius: 4, letterSpacing: "0.4px",
      }}>PRESALES DEMO</span>

      {/* Date pill */}
      <span style={{
        background: C.navy700, color: "#CBD5E1", fontSize: 11,
        padding: "4px 10px", borderRadius: 4, ...T.mono,
      }}>05 May 2026</span>

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 13, fontWeight: 700,
        }}>P</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>
            Priya Menon
          </span>
          <span style={{ color: C.textFaint, fontSize: 11, lineHeight: 1.2 }}>
            Reviewer · Chennai - Central
          </span>
        </div>
      </div>
    </nav>
  );
}

// ─── Page Title Bar ───────────────────────────────────────────────────────────

function PageTitleBar() {
  return (
    <div style={{
      height: 48, background: "#fff", borderBottom: `1px solid ${C.dividerStrong}`,
      display: "flex", alignItems: "center", padding: "0 20px",
      justifyContent: "space-between",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ ...T.pageTitle }}>Upload failed validation</span>
        <span style={{ fontSize: 12, color: C.textSecondary }}>
          Rule 3 · <span style={{ ...T.mono, fontSize: 12 }}>LR_Deviations_Rule3_20260505.xlsx</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="primary">
          <DownloadIcon /> Download error report
        </Btn>
        <Btn variant="secondary">
          Try a different file
        </Btn>
      </div>
    </div>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1v8M4 7l3 3 3-3" />
      <path d="M2 11h10" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke={C.blue600} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={7} cy={7} r={6} />
      <path d="M7 6v4M7 4.5v.01" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke={C.dangerDot} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2L2 17h16L10 2z" />
      <path d="M10 8v4M10 14.5v.01" />
    </svg>
  );
}

// ─── Error type badge map ─────────────────────────────────────────────────────

const ERROR_TYPE_LABELS = {
  missing:     "Missing value",
  invalid:     "Invalid value",
  not_in_pool: "Not in today's pool",
  both_set:    "Both flags set",
  date_fmt:    "Date format mismatch",
};

// ─── Sample error data ────────────────────────────────────────────────────────

const ERRORS = [
  {
    row: 4,
    contract: "HFL/VHL/2023/00782",
    field: "Flag",
    errorType: "missing",
    message: "Flag is empty. Provide a valid flag value (R / T / G / Z) or set Exception Flag = 1.",
    original: "",
  },
  {
    row: 7,
    contract: "HFL/CVL/2022/00445",
    field: "Correction Method",
    errorType: "invalid",
    message: "\"Pending\" is not a valid correction method. Use \"Data Correction\" or \"Accept Deviation\".",
    original: "Pending",
  },
  {
    row: 12,
    contract: "HFL/TL/2022/01120",
    field: "Exception Flag",
    errorType: "both_set",
    message: "Both Correction Method and Exception Flag are set. A row cannot be both corrected and excepted — clear one.",
    original: "1",
  },
  {
    row: 15,
    contract: "HFL/VHL/2021/00312",
    field: "Contract No",
    errorType: "not_in_pool",
    message: "This contract number does not appear in today's Rule 3 deviation pool. Remove this row or check the contract number.",
    original: "HFL/VHL/2021/00312",
  },
  {
    row: 19,
    contract: "HFL/CVL/2021/00567",
    field: "NPA Date",
    errorType: "date_fmt",
    message: "Date must be in DD-MMM-YYYY format (e.g. 05-May-2026). Received \"05/05/2026\" — reformatting required.",
    original: "05/05/2026",
  },
  {
    row: 23,
    contract: "HFL/TL/2023/00204",
    field: "Flag",
    errorType: "invalid",
    message: "\"X\" is not a recognised flag value. Use one of R, T, G, or Z.",
    original: "X",
  },
  {
    row: 31,
    contract: "HFL/VHL/2022/01455",
    field: "Exception Flag",
    errorType: "missing",
    message: "Exception Flag is required when Correction Method is blank. Set Exception Flag = 1 or provide a Correction Method.",
    original: "",
  },
  {
    row: 38,
    contract: "HFL/CVL/2022/00890",
    field: "Default Date",
    errorType: "date_fmt",
    message: "Default Date \"2026-01-14\" should be in DD-MMM-YYYY format. Found ISO 8601 — reformat to 14-Jan-2026.",
    original: "2026-01-14",
  },
];

// ─── Alert Banner ─────────────────────────────────────────────────────────────

function AlertBanner() {
  return (
    <div style={{
      background: C.dangerBg,
      borderLeft: `4px solid ${C.dangerDot}`,
      borderRadius: "0 6px 6px 0",
      padding: "0 20px",
      display: "flex", alignItems: "center", gap: 14,
      minHeight: 72,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <AlertIcon />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.dangerText }}>
          We couldn't accept this file
        </span>
        <span style={{ fontSize: 13, fontWeight: 400, color: C.dangerText, opacity: 0.85 }}>
          8 of 47 rows failed validation. Fix the rows listed below in your Excel file and re-upload.
        </span>
      </div>
    </div>
  );
}

// ─── Summary Strip ────────────────────────────────────────────────────────────

function SummaryStrip() {
  const stats = [
    { label: "Total rows in file", value: "47", color: C.textPrimary },
    { label: "Passed validation", value: "39", color: C.successText, dot: C.successDot, dotBg: C.successBg },
    { label: "Failed validation", value: "8",  color: C.dangerText,  dot: C.dangerDot,  dotBg: C.dangerBg },
  ];
  return (
    <div style={{
      background: "#fff", border: `1px solid ${C.dividerStrong}`,
      borderRadius: 8, padding: "0 20px",
      display: "flex", alignItems: "center", gap: 0,
      height: 56,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      boxShadow: "0 1px 2px rgba(15,28,46,0.04)",
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12,
          flex: 1,
          borderRight: i < stats.length - 1 ? `1px solid ${C.dividerSubtle}` : "none",
          paddingRight: i < stats.length - 1 ? 20 : 0,
          paddingLeft: i > 0 ? 20 : 0,
        }}>
          {s.dot && (
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: s.dotBg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, display: "block" }} />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ ...T.sectionLabel, fontSize: 10 }}>{s.label}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1.1, ...T.mono }}>
              {s.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Errors Table ─────────────────────────────────────────────────────────────

const COL_WIDTHS = ["52px", "190px", "140px", "160px", "1fr", "130px"];
const COL_HEADERS = ["Row #", "Contract No", "Field", "Error Type", "Error Message", "Your Value"];

function TableHeaderRow() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: COL_WIDTHS.join(" "),
      background: "#F8FAFC",
      borderBottom: `1px solid ${C.dividerStrong}`,
      height: 36,
      alignItems: "center",
    }}>
      {COL_HEADERS.map((h, i) => (
        <div key={i} style={{
          padding: "0 12px",
          ...T.tableHeader,
          textAlign: i === 0 ? "right" : "left",
        }}>{h}</div>
      ))}
    </div>
  );
}

function TableRow({ row, idx }) {
  const [hov, setHov] = useState(false);
  const isEven = idx % 2 === 0;

  const badgeType = {
    missing:     "danger",
    invalid:     "danger",
    not_in_pool: "warning",
    both_set:    "danger",
    date_fmt:    "warning",
  }[row.errorType] || "danger";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: COL_WIDTHS.join(" "),
        background: hov ? C.rowHover : isEven ? C.rowStripe : "#fff",
        borderBottom: `1px solid ${C.dividerSubtle}`,
        minHeight: 36,
        alignItems: "center",
        transition: "background 0.08s",
      }}
    >
      {/* Row # */}
      <div style={{ padding: "8px 12px", textAlign: "right", ...T.mono, fontSize: 12, color: C.textMuted }}>
        {row.row}
      </div>
      {/* Contract No */}
      <div style={{ padding: "8px 12px", ...T.mono, fontSize: 11.5, color: C.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {row.contract}
      </div>
      {/* Field */}
      <div style={{ padding: "8px 12px" }}>
        <span style={{
          background: C.neutralBg, color: C.textSecondary,
          padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600,
          ...T.mono,
        }}>{row.field}</span>
      </div>
      {/* Error type badge */}
      <div style={{ padding: "8px 12px" }}>
        <Badge type={badgeType} label={ERROR_TYPE_LABELS[row.errorType]} />
      </div>
      {/* Error message */}
      <div style={{ padding: "8px 12px", fontSize: 12, color: C.textPrimary, lineHeight: 1.45 }}>
        {row.message}
      </div>
      {/* Original value */}
      <div style={{ padding: "8px 12px", ...T.mono, fontSize: 11.5, color: C.textFaint }}>
        {row.original === "" ? (
          <span style={{ fontStyle: "italic", color: "#CBD5E1" }}>— empty —</span>
        ) : row.original}
      </div>
    </div>
  );
}

function ErrorsTable() {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${C.dividerStrong}`,
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 1px 2px rgba(15,28,46,0.04)",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* Card header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: `1px solid ${C.dividerStrong}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ ...T.cardTitle }}>Validation errors</span>
          <span style={{
            background: C.dangerBg, color: C.dangerText,
            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
          }}>8 rows</span>
        </div>
        <span style={{ fontSize: 12, color: C.textMuted }}>
          Sorted by row number · Rule 3 · 05 May 2026
        </span>
      </div>

      {/* Table */}
      <div>
        <TableHeaderRow />
        {ERRORS.map((row, i) => (
          <TableRow key={i} row={row} idx={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Bottom Callout ───────────────────────────────────────────────────────────

function BottomCallout() {
  return (
    <div style={{
      background: C.infoBg,
      border: `1px solid #BFDBFE`,
      borderRadius: 8,
      padding: "12px 16px",
      display: "flex", alignItems: "flex-start", gap: 12,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{ marginTop: 1, flexShrink: 0 }}>
        <InfoIcon />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.infoText }}>
          How to fix and re-upload
        </span>
        <span style={{ fontSize: 12, color: C.infoText, lineHeight: 1.55, opacity: 0.9 }}>
          Open <span style={{ ...T.mono, fontSize: 11.5 }}>LR_Deviations_Rule3_20260505.xlsx</span> in Excel, correct each row listed above, and save the file.{" "}
          Keep the file name and sheet name (<span style={{ ...T.mono, fontSize: 11.5 }}>Rule3_20260505</span>) exactly as-is — changing either will cause a fresh rejection.{" "}
          When ready, click <strong>Try a different file</strong> above and select the corrected file.{" "}
          <span style={{ fontWeight: 600 }}>This rejection does not count against your daily upload limit.</span>
        </span>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function UploadValidationPage() {
  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      background: C.pageBg,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F6FA; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
      `}</style>

      <TopNav />
      <PageTitleBar />

      <main style={{
        flex: 1,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 1440,
        width: "100%",
        alignSelf: "center",
      }}>
        <AlertBanner />
        <SummaryStrip />
        <ErrorsTable />
        <BottomCallout />
      </main>
    </div>
  );
}
