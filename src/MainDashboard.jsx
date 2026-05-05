import React, { useState, useMemo } from 'react';

// ------------------------------------------------------------------
// Design tokens
// ------------------------------------------------------------------
const C = {
  pageBg: '#F5F6FA',
  cardBg: '#FFFFFF',
  rowStripe: '#FAFBFC',
  rowHover: '#F1F5F9',
  divStrong: '#E2E8F0',
  divSubtle: '#EEF1F6',
  navy900: '#0A2342',
  navy800: '#0F1C2E',
  navy700: '#1E3A5F',
  textPrimary: '#0A2342',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textFaint: '#94A3B8',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  blue50: '#EFF6FF',
  border: '#CBD5E1',
};

const FONT = "'DM Sans', system-ui, -apple-system, sans-serif";
const MONO = "'JetBrains Mono', 'Consolas', monospace";

// ------------------------------------------------------------------
// Data
// ------------------------------------------------------------------
const ACTIVE_RULES = [
  { id: 3,  desc: 'Flag validation – LY T/Z/G flag vs CY status',     count: 47 },
  { id: 11, desc: 'R flag DPD > 0, OD > 0, for all POS > 0',          count: 12 },
  { id: 17, desc: 'First EMI date after contract date validation',    count: 8  },
  { id: 25, desc: 'POS > Finance amount, contract > 1yr → must be NPA', count: 23 },
  { id: 26, desc: 'Default date and NPA date mapping',                count: 31 },
  { id: 27, desc: 'NPA customer new business after default date',     count: 5  },
  { id: 30, desc: 'Last EMI date should align with contract date',    count: 18 },
  { id: 31, desc: 'Duplicate contract number across registers',       count: 4  },
];

const INACTIVE_RULES = [
  { id: 1,  desc: 'Customer ID format validation' },
  { id: 2,  desc: 'PAN format and check digit' },
  { id: 4,  desc: 'Date of birth vs sanction date' },
  { id: 5,  desc: 'Loan tenure within product limits' },
  { id: 6,  desc: 'Interest rate within RBI bands' },
  { id: 7,  desc: 'EMI amount calculation match' },
  { id: 8,  desc: 'Disbursal date not in future' },
  { id: 9,  desc: 'Branch code matches product master' },
  { id: 10, desc: 'GST number format check' },
  { id: 12, desc: 'Asset classification consistency' },
  { id: 13, desc: 'Provisioning amount vs POS' },
  { id: 14, desc: 'Sanction amount vs disbursed amount' },
  { id: 15, desc: 'Co-borrower KYC linked' },
  { id: 16, desc: 'Insurance expiry vs loan tenure' },
  { id: 18, desc: 'Repayment mode flag valid' },
  { id: 19, desc: 'Bureau score on file' },
  { id: 20, desc: 'Address pin code format' },
  { id: 21, desc: 'Vehicle registration number format' },
  { id: 22, desc: 'Engine and chassis number present' },
  { id: 23, desc: 'Hypothecation flag for asset-backed loans' },
  { id: 24, desc: 'IRR within disclosed range' },
  { id: 28, desc: 'Restructured account flag mapping' },
  { id: 29, desc: 'Write-off date vs NPA date' },
  { id: 32, desc: 'GL code mapped to product' },
  { id: 33, desc: 'Charge-off accounting consistency' },
  { id: 34, desc: 'Suit-filed flag with case number' },
  { id: 35, desc: 'Settlement amount vs outstanding' },
  { id: 36, desc: 'Recovery posting against contract' },
  { id: 37, desc: 'TDS deduction on interest income' },
  { id: 38, desc: 'NACH mandate active for repayment' },
  { id: 39, desc: 'Closure date with zero balance' },
];

const STATUS_STYLES = {
  'Not Started': { bg: '#F1F5F9', text: '#94A3B8', dot: '#CBD5E1' },
  'Downloaded':  { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' },
  'Uploaded':    { bg: '#DBEAFE', text: '#1E3A8A', dot: '#2563EB' },
  'Submitted':   { bg: '#DBEAFE', text: '#1E3A8A', dot: '#2563EB' },
  'Approved':    { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  'Rejected':    { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

// ------------------------------------------------------------------
// Tiny inline SVG icons (14px, currentColor)
// ------------------------------------------------------------------
const IconDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v12" />
    <path d="M6 12l6 6 6-6" />
    <path d="M5 20h14" />
  </svg>
);

const IconUp = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20V8" />
    <path d="M6 12l6-6 6 6" />
    <path d="M5 4h14" />
  </svg>
);

const IconRefresh = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 15.5-6.4L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.4L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const IconChevron = ({ open, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
       style={{
         transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
         transition: 'transform 150ms ease',
       }}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const IconExternal = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </svg>
);

// ------------------------------------------------------------------
// Reusable bits
// ------------------------------------------------------------------
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Not Started'];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.2,
      background: s.bg,
      color: s.text,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: s.dot,
      }} />
      {status}
    </span>
  );
}

function Button({
  variant = 'secondary',
  size = 'default',
  children,
  onClick,
  disabled,
  icon,
  title,
  block,
}) {
  const sizes = {
    small:   { height: 28, padding: '0 12px', fontSize: 12 },
    default: { height: 32, padding: '0 16px', fontSize: 13 },
    large:   { height: 36, padding: '0 18px', fontSize: 13 },
  };
  const variants = {
    primary:   { bg: C.blue600,    color: '#FFF',     border: '1px solid transparent', hoverBg: C.blue700 },
    secondary: { bg: '#FFF',       color: C.navy900,  border: `1px solid ${C.border}`, hoverBg: '#F8FAFC' },
    ghost:     { bg: 'transparent', color: C.blue600, border: '1px solid transparent', hoverBg: C.blue50 },
    danger:    { bg: '#EF4444',    color: '#FFF',     border: '1px solid transparent', hoverBg: '#DC2626' },
  };
  const v = variants[variant];
  const sz = sizes[size];
  const [hover, setHover] = useState(false);
  const isDisabled = !!disabled;

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={isDisabled}
      title={title}
      style={{
        height: sz.height,
        padding: sz.padding,
        fontSize: sz.fontSize,
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: 0.2,
        borderRadius: 6,
        border: isDisabled ? '1px solid #E2E8F0' : v.border,
        background: isDisabled ? '#E2E8F0' : (hover ? v.hoverBg : v.bg),
        color: isDisabled ? C.textFaint : v.color,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width: block ? '100%' : 'auto',
        transition: 'background 120ms ease, border-color 120ms ease',
        outline: 'none',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function MetricTile({ label, value, dotColor, dotLabel, mono = true }) {
  return (
    <div style={{
      background: C.cardBg,
      border: `1px solid ${C.divStrong}`,
      borderRadius: 8,
      padding: 16,
      height: 88,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 1px 2px rgba(15, 28, 46, 0.04)',
      boxSizing: 'border-box',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: C.textMuted,
        textTransform: 'uppercase', letterSpacing: 0.7,
      }}>{label}</div>
      <div style={{
        fontSize: 22, fontWeight: 700, color: C.navy900,
        lineHeight: 1, fontFamily: mono ? MONO : FONT,
      }}>{value}</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: C.textMuted,
        minHeight: 14,
      }}>
        {dotColor && (
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: dotColor,
          }} />
        )}
        {dotLabel || '\u00A0'}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Rule card
// ------------------------------------------------------------------
function RuleCard({ rule, state, onDownload, onUpload, onView }) {
  const downloaded = state.status !== 'Not Started';
  const submitted = ['Uploaded', 'Submitted', 'Approved', 'Rejected'].includes(state.status);
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.cardBg,
        border: `1px solid ${C.divStrong}`,
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: hover
          ? '0 4px 12px rgba(15, 28, 46, 0.08)'
          : '0 1px 2px rgba(15, 28, 46, 0.04)',
        transition: 'box-shadow 150ms ease, transform 150ms ease',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        boxSizing: 'border-box',
        minHeight: 196,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <span style={{
          fontFamily: MONO,
          fontSize: 13,
          fontWeight: 700,
          color: C.navy900,
        }}>Rule {rule.id}</span>
        <StatusBadge status={state.status} />
      </div>

      {/* Timestamp slot — reserved height even when empty */}
      <div style={{
        fontSize: 11,
        color: C.textMuted,
        fontFamily: MONO,
        height: 14,
        lineHeight: '14px',
        marginTop: -4,
      }}>
        {state.timestamp || '\u00A0'}
      </div>

      {/* Description (clamped to 2 lines) */}
      <div style={{
        fontSize: 12,
        color: C.textSecondary,
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: 34,
      }}>{rule.desc}</div>

      {/* Big number */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{
          fontSize: 22,
          fontWeight: 700,
          color: C.navy900,
          fontFamily: MONO,
          lineHeight: 1.1,
        }}>{rule.count}</div>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: C.textFaint,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 2,
        }}>deviations</div>
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        {submitted ? (
          <Button
            variant="secondary"
            size="small"
            block
            onClick={() => onView && onView(rule.id)}
            icon={<IconExternal />}
          >
            View submission
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              size="small"
              onClick={() => onDownload(rule.id)}
              icon={<IconDown size={12} />}
            >
              Download
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => onUpload(rule.id)}
              disabled={!downloaded}
              icon={<IconUp size={12} />}
              title={!downloaded ? 'Download the file before uploading' : undefined}
            >
              Upload
            </Button>
          </>
        )}
      </div>
    </div>
  );
}


// ------------------------------------------------------------------
// App
// ------------------------------------------------------------------
export default function MainDashboard() {
  const [ruleStates, setRuleStates] = useState(() => {
    const out = {};
    ACTIVE_RULES.forEach(r => {
      out[r.id] = { status: 'Not Started', timestamp: null };
    });
    return out;
  });
  const [inactiveExpanded, setInactiveExpanded] = useState(false);

  const fmtTime = () => {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const handleDownload = (id) => {
    setRuleStates(s => ({ ...s, [id]: { status: 'Downloaded', timestamp: fmtTime() } }));
  };

  const handleUpload = (id) => {
    setRuleStates(s => ({ ...s, [id]: { status: 'Submitted', timestamp: fmtTime() } }));
  };

  const handleView = (id) => {
    // Hook for navigation to submission detail in the real app
  };

  const handleDownloadAll = () => {
    const ts = fmtTime();
    setRuleStates(s => {
      const out = { ...s };
      ACTIVE_RULES.forEach(r => {
        // only flip rules that haven't progressed beyond Downloaded
        if (out[r.id].status === 'Not Started') {
          out[r.id] = { status: 'Downloaded', timestamp: ts };
        }
      });
      return out;
    });
  };

  const handleRefresh = () => {
    // demo no-op; in real app this re-runs the validation pass
  };

  const downloadedCount = useMemo(
    () => Object.values(ruleStates).filter(r => r.status !== 'Not Started').length,
    [ruleStates]
  );
  const submittedCount = useMemo(
    () => Object.values(ruleStates).filter(r =>
      ['Uploaded', 'Submitted', 'Approved', 'Rejected'].includes(r.status)
    ).length,
    [ruleStates]
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{
            fontSize: 24,
            fontWeight: 700,
            color: C.navy900,
            lineHeight: 1.15,
          }}>Today's deviations</span>
          <span style={{
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.2,
          }}>05 May 2026 · 148 contracts flagged across 8 rules</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            variant="secondary"
            onClick={handleDownloadAll}
            icon={<IconDown />}
          >Download all rules (.xlsx)</Button>
          <Button
            variant="primary"
            onClick={handleRefresh}
            icon={<IconRefresh />}
          >Refresh</Button>
        </div>
      </div>

      {/* 1. Metric strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 20,
      }}>
        <MetricTile
          label="Total deviations"
          value="148"
          dotColor="#EF4444"
          dotLabel="across 8 rules"
        />
        <MetricTile
          label="Rules with deviations"
          value="8 of 39"
          dotColor="#F59E0B"
          dotLabel="31 rules ran clean"
          mono={false}
        />
        <MetricTile
          label="Files downloaded today"
          value={String(downloadedCount)}
          dotColor={downloadedCount > 0 ? '#10B981' : '#CBD5E1'}
          dotLabel={downloadedCount > 0
            ? `${downloadedCount} of 8 rules`
            : 'No downloads yet'}
        />
        <MetricTile
          label="Submissions sent for approval"
          value={String(submittedCount)}
          dotColor={submittedCount > 0 ? '#2563EB' : '#CBD5E1'}
          dotLabel={submittedCount > 0
            ? `${submittedCount} pending approval`
            : 'No submissions yet'}
        />
      </div>

      {/* 2. Active rules grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 20,
      }}>
        {ACTIVE_RULES.map(r => (
          <RuleCard
            key={r.id}
            rule={r}
            state={ruleStates[r.id]}
            onDownload={handleDownload}
            onUpload={handleUpload}
            onView={handleView}
          />
        ))}
      </div>

      {/* 3. Inactive rules collapsible */}
      <div style={{
        background: C.cardBg,
        border: `1px solid ${C.divStrong}`,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(15, 28, 46, 0.04)',
      }}>
        <button
          onClick={() => setInactiveExpanded(v => !v)}
          style={{
            width: '100%',
            padding: '14px 18px',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontFamily: FONT,
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: C.navy900,
            }}>31 rules with no deviations today</span>
            <span style={{ fontSize: 11, color: C.textMuted }}>
              · All other RBI validation rules ran clean against today's Loan Register
            </span>
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            color: C.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            {inactiveExpanded ? 'Hide' : 'Show'}
            <IconChevron open={inactiveExpanded} />
          </span>
        </button>
        {inactiveExpanded && (
          <div style={{
            borderTop: `1px solid ${C.divSubtle}`,
            padding: '14px 18px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            rowGap: 8,
            columnGap: 24,
            background: C.rowStripe,
          }}>
            {INACTIVE_RULES.map(r => (
              <div key={r.id} style={{
                display: 'flex',
                gap: 10,
                alignItems: 'baseline',
                fontSize: 12,
                color: C.textMuted,
                lineHeight: 1.4,
                minWidth: 0,
              }}>
                <span style={{
                  fontFamily: MONO,
                  fontWeight: 600,
                  color: C.textSecondary,
                  minWidth: 50,
                  flexShrink: 0,
                }}>Rule {r.id}</span>
                <span style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                }}>{r.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
