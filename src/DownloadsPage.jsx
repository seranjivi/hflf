import React, { useState, useMemo } from 'react';

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
  hairline: '#E2E8F0',
  tableHeaderBg: '#F8FAFC',
  successText: '#065F46', successBg: '#D1FAE5', successDot: '#10B981',
  infoText: '#1E3A8A', infoBg: '#DBEAFE', infoDot: '#2563EB',
  neutralText: '#475569', neutralBg: '#F1F5F9', neutralDot: '#94A3B8',
};

const FONT = "'DM Sans', system-ui, -apple-system, sans-serif";
const MONO = "'JetBrains Mono', 'Consolas', monospace";

const DOWNLOADS = [
  { time: '02:33 PM', user: 'Priya Menon',  initial: 'P', type: 'per-rule',     rule: 'Rule 3',  file: 'LR_Deviations_Rule3_20260505.xlsx',  rows: 47  },
  { time: '02:18 PM', user: 'Arjun Rajan',  initial: 'A', type: 'per-rule',     rule: 'Rule 25', file: 'LR_Deviations_Rule25_20260505.xlsx', rows: 23  },
  { time: '01:55 PM', user: 'Kavitha S',    initial: 'K', type: 'consolidated', rule: null,      file: 'LR_Deviations_All_20260505.xlsx',     rows: 148 },
  { time: '01:22 PM', user: 'Priya Menon',  initial: 'P', type: 'per-rule',     rule: 'Rule 11', file: 'LR_Deviations_Rule11_20260505.xlsx', rows: 12  },
  { time: '12:47 PM', user: 'Nirmala T',    initial: 'N', type: 'per-rule',     rule: 'Rule 26', file: 'LR_Deviations_Rule26_20260505.xlsx', rows: 31  },
  { time: '11:38 AM', user: 'Arjun Rajan',  initial: 'A', type: 'per-rule',     rule: 'Rule 30', file: 'LR_Deviations_Rule30_20260505.xlsx', rows: 18  },
  { time: '11:18 AM', user: 'Priya Menon',  initial: 'P', type: 'per-rule',     rule: 'Rule 17', file: 'LR_Deviations_Rule17_20260505.xlsx', rows: 8   },
  { time: '10:54 AM', user: 'Kavitha S',    initial: 'K', type: 'per-rule',     rule: 'Rule 27', file: 'LR_Deviations_Rule27_20260505.xlsx', rows: 5   },
  { time: '10:31 AM', user: 'Priya Menon',  initial: 'P', type: 'per-rule',     rule: 'Rule 31', file: 'LR_Deviations_Rule31_20260505.xlsx', rows: 4   },
  { time: '10:15 AM', user: 'Nirmala T',    initial: 'N', type: 'consolidated', rule: null,      file: 'LR_Deviations_All_20260505.xlsx',     rows: 148 },
  { time: '09:58 AM', user: 'Arjun Rajan',  initial: 'A', type: 'per-rule',     rule: 'Rule 3',  file: 'LR_Deviations_Rule3_20260505.xlsx',  rows: 47  },
  { time: '09:42 AM', user: 'Priya Menon',  initial: 'P', type: 'per-rule',     rule: 'Rule 25', file: 'LR_Deviations_Rule25_20260505.xlsx', rows: 23  },
];

const RULES = ['Rule 3', 'Rule 11', 'Rule 17', 'Rule 25', 'Rule 26', 'Rule 27', 'Rule 30', 'Rule 31'];
const USERS = ['Priya Menon', 'Arjun Rajan', 'Kavitha S', 'Nirmala T'];

// time-window mocks (relative to "now" = 02:33 PM)
const LAST_1H = new Set(['02:33 PM', '02:18 PM']);
const LAST_4H = new Set([
  '02:33 PM', '02:18 PM', '01:55 PM', '01:22 PM',
  '12:47 PM', '11:38 AM', '11:18 AM', '10:54 AM',
]);

function Badge({ kind, children }) {
  const map = {
    success: { bg: C.successBg, text: C.successText, dot: C.successDot },
    info:    { bg: C.infoBg,    text: C.infoText,    dot: C.infoDot },
    neutral: { bg: C.neutralBg, text: C.neutralText, dot: C.neutralDot },
  };
  const k = map[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 4,
      background: k.bg, color: k.text,
      fontSize: 11, fontWeight: 700, fontFamily: FONT,
      whiteSpace: 'nowrap', lineHeight: 1,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: k.dot, display: 'inline-block', flexShrink: 0,
      }} />
      {children}
    </span>
  );
}

function Avatar({ initial, size = 24 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
      color: '#FFFFFF',
      fontSize: size <= 24 ? 11 : 13,
      fontWeight: 700, fontFamily: FONT,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{initial}</span>
  );
}

function TopNav() {
  return (
    <div style={{
      height: 56, background: C.navy900,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto', height: '100%',
        display: 'flex', alignItems: 'center', padding: '0 20px',
        gap: 12, fontFamily: FONT,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #1D4ED8, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFFFFF', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
          flexShrink: 0,
        }}>HFL</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>
            LR Deviation Correction
          </span>
          <span style={{ fontSize: 11, fontWeight: 400, color: '#64748B' }}>
            Hinduja Leyland Finance · Loan Register
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <span style={{
          background: C.navy700, color: '#CBD5E1',
          fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 4,
          fontFamily: FONT,
        }}>05 May 2026</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 4 }}>
          <Avatar initial="P" size={32} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>
              Priya Menon
            </span>
            <span style={{ fontSize: 11, fontWeight: 400, color: '#94A3B8' }}>
              Reviewer · Chennai - Central
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackButton() {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 32, padding: '0 14px', borderRadius: 6,
        background: hover ? '#F8FAFC' : C.cardBg,
        color: C.navy900,
        border: `1px solid ${hover ? '#94A3B8' : C.border}`,
        fontSize: 13, fontWeight: 600, fontFamily: FONT,
        letterSpacing: 0.2, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'background 80ms ease, border-color 80ms ease',
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1, marginTop: -1 }}>←</span>
      Back to dashboard
    </button>
  );
}

function PageTitleBar() {
  return (
    <div style={{
      height: 48, background: C.cardBg,
      borderBottom: `1px solid ${C.hairline}`,
    }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto', height: '100%',
        display: 'flex', alignItems: 'center', padding: '0 20px',
        fontFamily: FONT,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.navy900 }}>
            Download history
          </span>
          <span style={{ fontSize: 12, fontWeight: 400, color: C.textMuted }}>
            Today · 05 May 2026
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <BackButton />
      </div>
    </div>
  );
}

function SummaryStrip() {
  const dotSep = (
    <span style={{ color: C.divStrong, fontSize: 16, lineHeight: 1, userSelect: 'none' }}>·</span>
  );
  return (
    <div style={{
      height: 64, background: C.cardBg,
      border: `1px solid ${C.hairline}`, borderRadius: 8,
      padding: '0 24px',
      display: 'flex', alignItems: 'center', gap: 20,
      fontFamily: FONT,
      boxShadow: '0 1px 2px rgba(15, 28, 46, 0.04)',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: C.navy900, lineHeight: 1 }}>12</span>
        <span style={{ fontSize: 13, color: C.textSecondary }}>downloads today</span>
      </span>
      {dotSep}
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: C.navy900, lineHeight: 1 }}>8</span>
        <span style={{ fontSize: 13, color: C.textSecondary }}>rules touched</span>
      </span>
      {dotSep}
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 13, color: C.textSecondary }}>Last download</span>
        <span style={{
          fontSize: 14, fontWeight: 700, color: C.navy900,
          fontFamily: MONO, letterSpacing: 0.2,
        }}>02:33 PM</span>
      </span>
    </div>
  );
}

function StyledSelect({ value, onChange, width, children }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block', width }}>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          height: 32, width: '100%', padding: '0 28px 0 12px',
          border: `1px solid ${focus ? C.blue600 : C.border}`, borderRadius: 6,
          background: '#FFFFFF', color: C.navy900,
          fontSize: 13, fontWeight: 500, fontFamily: FONT,
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          cursor: 'pointer', outline: 'none',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </select>
      <span style={{
        position: 'absolute', right: 10, top: '50%',
        transform: 'translateY(-60%)',
        pointerEvents: 'none', color: C.textMuted, fontSize: 12, fontWeight: 700,
      }}>⌄</span>
    </div>
  );
}

function FilterRow(props) {
  const {
    ruleFilter, setRuleFilter,
    userFilter, setUserFilter,
    timeFilter, setTimeFilter,
    search, setSearch,
  } = props;
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <div style={{
      height: 56, background: C.cardBg,
      border: `1px solid ${C.hairline}`, borderRadius: 8,
      padding: '0 16px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: FONT,
      boxShadow: '0 1px 2px rgba(15, 28, 46, 0.04)',
    }}>
      <StyledSelect
        value={ruleFilter}
        onChange={(e) => setRuleFilter(e.target.value)}
        width={130}
      >
        <option value="">All rules</option>
        {RULES.map(r => <option key={r} value={r}>{r}</option>)}
      </StyledSelect>

      <StyledSelect
        value={userFilter}
        onChange={(e) => setUserFilter(e.target.value)}
        width={170}
      >
        <option value="">All users</option>
        {USERS.map(u => <option key={u} value={u}>{u}</option>)}
      </StyledSelect>

      <StyledSelect
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        width={140}
      >
        <option value="today">Today</option>
        <option value="1h">Last 1 hour</option>
        <option value="4h">Last 4 hours</option>
      </StyledSelect>

      <div style={{ flex: 1 }} />

      <input
        type="text"
        placeholder="Search by file name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setSearchFocus(true)}
        onBlur={() => setSearchFocus(false)}
        style={{
          height: 32, width: 200, padding: '0 12px',
          border: `1px solid ${searchFocus ? C.blue600 : C.border}`, borderRadius: 6,
          fontSize: 13, fontFamily: FONT, color: C.navy900,
          background: '#FFFFFF', outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function DownloadsTable({ rows }) {
  const [hoveredIdx, setHoveredIdx] = useState(-1);

  const headerCell = {
    padding: '8px 12px', textAlign: 'left',
    fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
    textTransform: 'uppercase', color: C.textMuted,
    fontFamily: FONT, background: C.tableHeaderBg,
    borderBottom: `1px solid ${C.divStrong}`,
    height: 36, boxSizing: 'border-box',
    whiteSpace: 'nowrap',
  };
  const cell = (extra = {}) => ({
    padding: '8px 12px',
    fontSize: 12, color: C.textPrimary, fontFamily: FONT,
    borderBottom: `1px solid ${C.divSubtle}`,
    height: 36, boxSizing: 'border-box',
    verticalAlign: 'middle',
    ...extra,
  });

  if (rows.length === 0) {
    return (
      <div style={{
        background: C.cardBg, border: `1px solid ${C.hairline}`, borderRadius: 8,
        padding: 20, fontFamily: FONT,
        boxShadow: '0 1px 2px rgba(15, 28, 46, 0.04)',
      }}>
        <div style={{
          border: `1px dashed ${C.border}`, borderRadius: 6,
          padding: '40px 24px', textAlign: 'center',
          fontSize: 13, color: C.textMuted,
        }}>
          No downloads match the current filters.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: C.cardBg, border: `1px solid ${C.hairline}`, borderRadius: 8,
      overflow: 'hidden', fontFamily: FONT,
      boxShadow: '0 1px 2px rgba(15, 28, 46, 0.04)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: 100 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 90 }} />
          <col />
          <col style={{ width: 130 }} />
          <col style={{ width: 110 }} />
        </colgroup>
        <thead>
          <tr>
            <th style={headerCell}>Time</th>
            <th style={headerCell}>User</th>
            <th style={headerCell}>Action</th>
            <th style={headerCell}>Rule</th>
            <th style={headerCell}>File name</th>
            <th style={{ ...headerCell, textAlign: 'right' }}>Rows in file</th>
            <th style={headerCell}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <tr
                key={`${r.time}-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(-1)}
                style={{
                  background: isHovered ? C.rowHover : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <td style={cell({ fontFamily: MONO, fontWeight: 500, letterSpacing: 0.2 })}>
                  {r.time}
                </td>
                <td style={cell()}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Avatar initial={r.initial} size={22} />
                    <span style={{ fontWeight: 500, color: C.navy900 }}>{r.user}</span>
                  </span>
                </td>
                <td style={cell()}>
                  {r.type === 'consolidated'
                    ? <Badge kind="info">Consolidated download</Badge>
                    : <Badge kind="neutral">Per-rule download</Badge>}
                </td>
                <td style={cell({
                  fontFamily: MONO, fontWeight: 500,
                  color: r.rule ? C.textPrimary : C.textFaint,
                })}>
                  {r.rule || '—'}
                </td>
                <td style={cell({
                  fontFamily: MONO, fontSize: 11, fontWeight: 500,
                  color: C.textSecondary,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                })}
                title={r.file}
                >
                  {r.file}
                </td>
                <td style={cell({
                  fontFamily: MONO, fontWeight: 500, textAlign: 'right',
                })}>
                  {r.rows}
                </td>
                <td style={cell()}>
                  <Badge kind="success">Logged</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function DownloadsPage() {
  const [ruleFilter, setRuleFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('today');
  const [search, setSearch]         = useState('');

  const filtered = useMemo(() => {
    return DOWNLOADS.filter(r => {
      if (ruleFilter && r.rule !== ruleFilter) return false;
      if (userFilter && r.user !== userFilter) return false;
      if (search && !r.file.toLowerCase().includes(search.toLowerCase())) return false;
      if (timeFilter === '1h' && !LAST_1H.has(r.time)) return false;
      if (timeFilter === '4h' && !LAST_4H.has(r.time)) return false;
      return true;
    });
  }, [ruleFilter, userFilter, timeFilter, search]);

  return (
    <div style={{
      minHeight: '100vh', background: C.pageBg, fontFamily: FONT,
      display: 'flex', flexDirection: 'column',
      color: C.textPrimary,
    }}>
      <TopNav />
      <PageTitleBar />
      <main style={{
        flex: 1, padding: 20,
        maxWidth: 1440, width: '100%', margin: '0 auto', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <SummaryStrip />
        <FilterRow
          ruleFilter={ruleFilter} setRuleFilter={setRuleFilter}
          userFilter={userFilter} setUserFilter={setUserFilter}
          timeFilter={timeFilter} setTimeFilter={setTimeFilter}
          search={search}         setSearch={setSearch}
        />
        <DownloadsTable rows={filtered} />
      </main>
    </div>
  );
}
