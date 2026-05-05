import React, { useState, useMemo } from 'react';

const C = {
  pageBg: '#F5F6FA',
  cardBg: '#FFFFFF',
  rowStripe: '#FAFBFC',
  rowHover: '#F1F5F9',
  dividerStrong: '#E2E8F0',
  dividerSubtle: '#EEF1F6',
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
  success: '#10B981',
  successBg: '#D1FAE5',
  successText: '#065F46',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  warningText: '#78350F',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  dangerText: '#991B1B',
  infoBg: '#DBEAFE',
  infoText: '#1E3A8A',
  inputBorder: '#CBD5E1',
};

const FONT = "'DM Sans', system-ui, -apple-system, sans-serif";
const MONO = "'JetBrains Mono', 'Consolas', monospace";

const corrections = [
  { contract: 'HFL/VHL/2023/00782', rule: 'Rule 3', field: 'Flag', oldVal: 'T', newVal: 'R', method: 'Data Correction' },
  { contract: 'HFL/CVL/2022/00445', rule: 'Rule 3', field: 'Flag', oldVal: 'Z', newVal: 'T', method: 'Data Correction' },
  { contract: 'HFL/TL/2022/01120',  rule: 'Rule 3', field: 'Flag', oldVal: 'G', newVal: 'R', method: 'Data Correction' },
  { contract: 'HFL/VHL/2021/00312', rule: 'Rule 3', field: 'Flag', oldVal: 'T', newVal: 'G', method: 'Data Correction' },
  { contract: 'HFL/CVL/2021/00567', rule: 'Rule 3', field: 'Flag', oldVal: 'Z', newVal: 'G', method: 'Data Correction' },
  { contract: 'HFL/TL/2023/00204',  rule: 'Rule 3', field: 'Flag', oldVal: 'T', newVal: 'R', method: 'Data Correction' },
];

const exceptions = [
  { contract: 'HFL/VHL/2022/01455', rule: 'Rule 3', reason: 'Customer migrated to NPA pool last week, deviation acceptable per branch policy' },
  { contract: 'HFL/CVL/2022/00890', rule: 'Rule 3', reason: 'Manual flag update pending CBS sync, will reflect in tomorrow\u2019s batch' },
  { contract: 'HFL/TL/2022/00755',  rule: 'Rule 3', reason: 'Account in legal proceedings, flag locked until court order' },
  { contract: 'HFL/VHL/2023/01102', rule: 'Rule 3', reason: 'Customer disputed termination, restoration in progress with collections' },
  { contract: 'HFL/CVL/2023/00231', rule: 'Rule 3', reason: 'Bulk write-off approved, pending finance team confirmation' },
  { contract: 'HFL/VHL/2022/00998', rule: 'Rule 3', reason: 'Vehicle repossessed; customer paying balance per restructure agreement' },
];

const unchanged = [
  { contract: 'HFL/TL/2022/00755',  rule: 'Rule 3', note: 'No change \u2014 will reappear in tomorrow\u2019s deviation pool' },
  { contract: 'HFL/CVL/2021/00567', rule: 'Rule 3', note: 'No change \u2014 will reappear in tomorrow\u2019s deviation pool' },
  { contract: 'HFL/VHL/2022/01455', rule: 'Rule 3', note: 'No change \u2014 will reappear in tomorrow\u2019s deviation pool' },
];

function App() {
  const [step, setStep] = useState(2);
  const [tab, setTab] = useState('corrections');
  const [fileSelected, setFileSelected] = useState(false);
  const [reviewerNote, setReviewerNote] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: C.pageBg, fontFamily: FONT, color: C.textPrimary, display: 'flex', flexDirection: 'column' }}>
      <TopNav />
      <PageTitleBar />
      <main style={{ flex: 1, padding: 20, maxWidth: 1440, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Stepper current={step} />
        <div style={{ height: 16 }} />
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          {step === 1 && <Step1 fileSelected={fileSelected} setFileSelected={setFileSelected} onContinue={() => setStep(2)} />}
          {step === 2 && <Step2 tab={tab} setTab={setTab} onBack={() => setStep(1)} onContinue={() => setStep(3)} />}
          {step === 3 && <Step3 note={reviewerNote} setNote={setReviewerNote} onBack={() => setStep(2)} />}
        </div>
      </main>
    </div>
  );
}

/* ---------- TOP NAV ---------- */
function TopNav() {
  return (
    <div style={{
      height: 56, background: C.navy900, display: 'flex', alignItems: 'center',
      padding: '0 20px', position: 'sticky', top: 0, zIndex: 10, gap: 14,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'linear-gradient(135deg, #1D4ED8, #06B6D4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: 0.3,
      }}>HFL</div>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>LR Deviation Correction</span>
        <span style={{ color: '#94A3B8', fontSize: 11 }}>Hinduja Leyland Finance &middot; Loan Register</span>
      </div>

      <span style={{
        background: C.navy700, color: '#7EB8F7', fontSize: 10, fontWeight: 700,
        padding: '2px 8px', borderRadius: 4, marginLeft: 8, letterSpacing: 0.4,
      }}>PRESALES DEMO</span>

      <div style={{ flex: 1 }} />

      <span style={{
        background: C.navy700, color: '#CBD5E1', fontSize: 11,
        padding: '4px 10px', borderRadius: 999, fontFamily: MONO,
      }}>05 May 2026</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 13,
        }}>P</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Priya Menon</span>
          <span style={{ color: '#94A3B8', fontSize: 11 }}>Reviewer &middot; Chennai - Central</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- PAGE TITLE BAR ---------- */
function PageTitleBar() {
  return (
    <div style={{
      height: 48, background: '#fff', borderBottom: `1px solid ${C.dividerStrong}`,
      display: 'flex', alignItems: 'center', padding: '0 20px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.navy900 }}>Upload deviation file</span>
        <span style={{ fontSize: 12, color: C.textMuted }}>
          Rule 3 &middot; Flag validation &mdash; LY T/Z/G flag vs CY status
        </span>
      </div>
      <div style={{ flex: 1 }} />
      <button style={ghostBtn()}>
        <span style={{ marginRight: 6, fontSize: 14, lineHeight: 1 }}>&times;</span>
        Cancel and go back
      </button>
    </div>
  );
}

/* ---------- STEPPER ---------- */
function Stepper({ current }) {
  const steps = [
    { n: 1, label: 'Choose file' },
    { n: 2, label: 'Validate & preview' },
    { n: 3, label: 'Submit for approval' },
  ];
  return (
    <div style={{
      background: '#fff', border: `1px solid ${C.dividerStrong}`, borderRadius: 8,
      padding: '12px 32px', display: 'flex', alignItems: 'flex-start',
      maxWidth: 880, margin: '0 auto',
    }}>
      {steps.map((s, i) => {
        const state = s.n < current ? 'done' : s.n === current ? 'active' : 'pending';
        return (
          <React.Fragment key={s.n}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
              <StepCircle state={state} n={s.n} />
              <div style={{
                marginTop: 6, fontSize: 11, letterSpacing: 0.3,
                fontWeight: state === 'active' ? 700 : 600,
                color: state === 'active' ? C.navy900 : state === 'done' ? C.textSecondary : C.textFaint,
                textTransform: 'uppercase',
              }}>{s.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1,
                background: s.n < current ? C.success : C.dividerStrong,
                marginTop: 14,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StepCircle({ state, n }) {
  if (state === 'done') {
    return (
      <div style={{
        width: 28, height: 28, borderRadius: '50%', background: C.success,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7.5L6 10.5L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }
  if (state === 'active') {
    return (
      <div style={{
        width: 28, height: 28, borderRadius: '50%', background: C.blue600, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 13, boxShadow: '0 0 0 4px ' + C.blue50,
      }}>{n}</div>
    );
  }
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', background: '#fff',
      border: `1px solid ${C.dividerStrong}`, color: C.textFaint,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 13,
    }}>{n}</div>
  );
}

/* ---------- STEP 1 ---------- */
function Step1({ fileSelected, setFileSelected, onContinue }) {
  return (
    <div style={card()}>
      <div style={{ ...sectionLabel(), marginBottom: 12 }}>Step 1 of 3</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy900, marginBottom: 4 }}>Choose the corrected deviation file</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
        Drop the Excel file you exported, edited and saved. The wizard will validate the structure before you continue.
      </div>

      <div
        onClick={() => setFileSelected(true)}
        style={{
          height: 200, border: `1px dashed ${fileSelected ? C.blue600 : C.inputBorder}`,
          borderRadius: 8, background: fileSelected ? C.blue50 : C.rowStripe,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', gap: 8,
        }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 6V22M16 6L10 12M16 6L22 12" stroke={fileSelected ? C.blue600 : C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 22V25C6 25.5523 6.44772 26 7 26H25C25.5523 26 26 25.5523 26 25V22" stroke={fileSelected ? C.blue600 : C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize: 13, fontWeight: 600, color: fileSelected ? C.navy900 : C.textSecondary }}>
          {fileSelected ? 'LR_Deviations_Rule3_20260505.xlsx selected' : 'Drag the corrected file here, or click to browse'}
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MONO }}>
          {fileSelected ? '47 rows \u00b7 24.6 KB' : '.xlsx only'}
        </div>
      </div>

      <div style={{
        marginTop: 16, background: C.rowStripe, border: `1px solid ${C.dividerSubtle}`,
        borderRadius: 6, padding: '10px 12px', display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: C.infoBg, color: C.infoText,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontSize: 11, fontWeight: 700,
        }}>i</div>
        <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>
          File name must match <span style={{ fontFamily: MONO, color: C.navy900 }}>LR_Deviations_Rule3_20260505.xlsx</span>.
          Sheet name must be <span style={{ fontFamily: MONO, color: C.navy900 }}>Rule3_20260505</span>.
          Only one upload per rule per day; additional uploads need approver exception.
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button style={fileSelected ? primaryBtn() : disabledBtn()} disabled={!fileSelected} onClick={fileSelected ? onContinue : undefined}>
          Continue
        </button>
      </div>
    </div>
  );
}

/* ---------- STEP 2 ---------- */
function Step2({ tab, setTab, onBack, onContinue }) {
  return (
    <div style={card({ padding: 0 })}>
      <div style={{ padding: 18, paddingBottom: 0 }}>
        {/* Success banner */}
        <div style={{
          background: C.successBg, border: `1px solid #A7F3D0`, borderRadius: 6,
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill={C.success}/>
            <path d="M5 8L7 10L11 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ fontSize: 13, color: C.successText, fontWeight: 600 }}>
            File validated successfully &middot; <span style={{ fontFamily: MONO }}>47</span> rows parsed
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: C.successText, fontFamily: MONO }}>
            LR_Deviations_Rule3_20260505.xlsx
          </span>
        </div>

        {/* Summary tiles */}
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          <SummaryTile label="Corrections" value="32" dotColor={C.success} context="Will insert new corrected rows" />
          <SummaryTile label="Exceptions" value="12" dotColor={C.warning} context="Flagged with reviewer reason" valueColor={C.warningText} />
          <SummaryTile label="Unchanged" value="3" dotColor={C.neutral} context={'Deferred to tomorrow\u2019s pool'} valueColor={C.textMuted} />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', marginTop: 18, borderBottom: `1px solid ${C.dividerStrong}`,
        }}>
          <TabBtn active={tab === 'corrections'} onClick={() => setTab('corrections')}>Corrections (32)</TabBtn>
          <TabBtn active={tab === 'exceptions'} onClick={() => setTab('exceptions')}>Exceptions (12)</TabBtn>
          <TabBtn active={tab === 'unchanged'} onClick={() => setTab('unchanged')}>Unchanged (3)</TabBtn>
        </div>
      </div>

      {/* Table */}
      {tab === 'corrections' && <CorrectionsTable />}
      {tab === 'exceptions' && <ExceptionsTable />}
      {tab === 'unchanged' && <UnchangedTable />}

      {/* Footer */}
      <div style={{
        padding: '14px 18px', borderTop: `1px solid ${C.dividerStrong}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>
          Showing first 6 rows of each category. Full file will be submitted on approval.
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={secondaryBtn()} onClick={onBack}>Back</button>
          <button style={primaryBtn()} onClick={onContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value, dotColor, context, valueColor }) {
  return (
    <div style={{
      flex: 1, background: '#fff', border: `1px solid ${C.dividerStrong}`,
      borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={sectionLabel()}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: valueColor || C.navy900, fontFamily: MONO, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
        <span style={{ fontSize: 11, color: C.textMuted }}>{context}</span>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: 'none', cursor: 'pointer',
      padding: '0 16px', height: 38,
      fontFamily: FONT, fontSize: 13, fontWeight: 700,
      color: active ? C.navy900 : C.textFaint,
      borderBottom: active ? `2px solid ${C.blue600}` : '2px solid transparent',
      marginBottom: -1,
    }}>{children}</button>
  );
}

function CorrectionsTable() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <table style={tableStyle()}>
        <thead>
          <tr style={tableHeadRow()}>
            <th style={th()}>Contract No</th>
            <th style={th()}>Rule</th>
            <th style={th()}>Field changed</th>
            <th style={th({ textAlign: 'center' })}>Old</th>
            <th style={th({ textAlign: 'center' })}>New</th>
            <th style={th()}>Correction method</th>
          </tr>
        </thead>
        <tbody>
          {corrections.map((r, i) => (
            <tr key={i} style={tableBodyRow(i)}>
              <td style={td({ fontFamily: MONO, fontWeight: 500 })}>{r.contract}</td>
              <td style={td()}>{r.rule}</td>
              <td style={td()}>{r.field}</td>
              <td style={td({ textAlign: 'center' })}><FlagPill v={r.oldVal} muted /></td>
              <td style={td({ textAlign: 'center' })}><FlagPill v={r.newVal} /></td>
              <td style={td()}><Pill kind="info" label={r.method} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExceptionsTable() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <table style={tableStyle()}>
        <thead>
          <tr style={tableHeadRow()}>
            <th style={th({ width: 200 })}>Contract No</th>
            <th style={th({ width: 80 })}>Rule</th>
            <th style={th()}>Reason (reviewer note)</th>
            <th style={th({ width: 110 })}>Status</th>
          </tr>
        </thead>
        <tbody>
          {exceptions.map((r, i) => (
            <tr key={i} style={tableBodyRow(i)}>
              <td style={td({ fontFamily: MONO, fontWeight: 500 })}>{r.contract}</td>
              <td style={td()}>{r.rule}</td>
              <td style={td({ color: C.textSecondary })}>{r.reason}</td>
              <td style={td()}><Pill kind="warning" label="Exception" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UnchangedTable() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <table style={tableStyle()}>
        <thead>
          <tr style={tableHeadRow()}>
            <th style={th({ width: 200 })}>Contract No</th>
            <th style={th({ width: 80 })}>Rule</th>
            <th style={th()}>Note</th>
            <th style={th({ width: 110 })}>Status</th>
          </tr>
        </thead>
        <tbody>
          {unchanged.map((r, i) => (
            <tr key={i} style={tableBodyRow(i)}>
              <td style={td({ fontFamily: MONO, fontWeight: 500 })}>{r.contract}</td>
              <td style={td()}>{r.rule}</td>
              <td style={td({ color: C.textSecondary })}>{r.note}</td>
              <td style={td()}><Pill kind="neutral" label="Deferred" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- STEP 3 ---------- */
function Step3({ note, setNote, onBack }) {
  return (
    <div style={card()}>
      <div style={{ ...sectionLabel(), marginBottom: 12 }}>Step 3 of 3</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy900, marginBottom: 4 }}>Review and submit for approval</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
        Once submitted, this batch is locked. You can still edit it if the approver sends it back.
      </div>

      {/* Summary card */}
      <div style={{
        background: C.rowStripe, border: `1px solid ${C.dividerSubtle}`, borderRadius: 6,
        padding: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 16, rowGap: 12,
      }}>
        <SummaryRow label="File" value="LR_Deviations_Rule3_20260505.xlsx" mono />
        <SummaryRow label="Rule" value={'Rule 3 \u00b7 Flag validation'} />
        <SummaryRow label="Total rows" value="47" mono />
        <SummaryRow label="Corrections" value="32" mono valueColor={C.successText} />
        <SummaryRow label="Exceptions" value="12" mono valueColor={C.warningText} />
        <SummaryRow label="Deferred" value="3" mono valueColor={C.textMuted} />
      </div>

      {/* Reviewer note */}
      <div style={{ marginTop: 16 }}>
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 600, color: C.textFaint,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
        }}>
          Reviewer note (visible to approver) <span style={{ color: C.danger }}>*</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Reviewed all flag mismatches against CBS data. 12 cases flagged as exceptions due to legal hold or pending CBS sync. Awaiting approval to insert corrected records."
          style={{
            width: '100%', minHeight: 92, padding: 10, fontFamily: FONT, fontSize: 13,
            color: C.navy900, border: `1px solid ${C.inputBorder}`, borderRadius: 6,
            resize: 'vertical', boxSizing: 'border-box', outline: 'none',
            background: '#fff',
          }}
        />
      </div>

      {/* Approver dropdown */}
      <div style={{ marginTop: 14 }}>
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 600, color: C.textFaint,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
        }}>Send for approval to</label>
        <div style={{
          height: 32, padding: '0 12px', border: `1px solid ${C.inputBorder}`, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', cursor: 'default',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 11,
            }}>R</div>
            <span style={{ fontSize: 13, color: C.navy900, fontWeight: 600 }}>Ramesh Chandran</span>
            <span style={{ fontSize: 11, color: C.textMuted }}>Approver &middot; Chennai Region</span>
          </div>
          <span style={{ color: C.textFaint, fontSize: 12 }}>&#9662;</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 14, borderTop: `1px solid ${C.dividerSubtle}`,
      }}>
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: MONO }}>
          Batch ID will be assigned: BX-20260505-001
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={secondaryBtn()} onClick={onBack}>Back</button>
          <button style={primaryBtn()}>Submit for approval</button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, mono, valueColor }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.textFaint, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        fontSize: 13, fontWeight: 600,
        color: valueColor || C.navy900,
        fontFamily: mono ? MONO : FONT,
      }}>{value}</div>
    </div>
  );
}

/* ---------- SHARED COMPONENTS ---------- */
function FlagPill({ v, muted }) {
  const colorMap = {
    R: { bg: C.dangerBg, fg: C.dangerText },
    T: { bg: C.warningBg, fg: C.warningText },
    G: { bg: C.successBg, fg: C.successText },
    Z: { bg: '#F1F5F9', fg: C.textSecondary },
  };
  const c = colorMap[v] || { bg: '#F1F5F9', fg: C.textMuted };
  return (
    <span style={{
      display: 'inline-block', minWidth: 22, padding: '2px 8px', borderRadius: 4,
      background: muted ? '#F1F5F9' : c.bg, color: muted ? C.textMuted : c.fg,
      fontSize: 11, fontWeight: 700, fontFamily: MONO, textAlign: 'center',
      opacity: muted ? 0.85 : 1,
    }}>{v}</span>
  );
}

function Pill({ kind, label }) {
  const map = {
    info: { bg: C.infoBg, fg: C.infoText, dot: C.blue600 },
    warning: { bg: C.warningBg, fg: C.warningText, dot: C.warning },
    success: { bg: C.successBg, fg: C.successText, dot: C.success },
    neutral: { bg: '#F1F5F9', fg: C.textSecondary, dot: C.textFaint },
    danger: { bg: C.dangerBg, fg: C.dangerText, dot: C.danger },
  };
  const c = map[kind] || map.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 4,
      background: c.bg, color: c.fg, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />
      {label}
    </span>
  );
}

/* ---------- STYLE HELPERS ---------- */
function card(extra = {}) {
  return {
    background: C.cardBg,
    border: `1px solid ${C.dividerStrong}`,
    borderRadius: 8,
    padding: 18,
    boxShadow: '0 1px 2px rgba(15, 28, 46, 0.04)',
    ...extra,
  };
}

function sectionLabel() {
  return {
    fontSize: 11, fontWeight: 700, letterSpacing: 0.7,
    color: C.textMuted, textTransform: 'uppercase',
  };
}

function tableStyle() {
  return {
    width: '100%', borderCollapse: 'collapse', tableLayout: 'auto',
  };
}

function tableHeadRow() {
  return {
    background: '#F8FAFC',
    borderBottom: `1px solid ${C.dividerStrong}`,
    borderTop: `1px solid ${C.dividerStrong}`,
  };
}

function tableBodyRow(i) {
  return {
    background: i % 2 === 1 ? C.rowStripe : '#fff',
    borderBottom: `1px solid ${C.dividerSubtle}`,
  };
}

function th(extra = {}) {
  return {
    fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase',
    letterSpacing: 0.5, padding: '8px 12px', textAlign: 'left', height: 36,
    ...extra,
  };
}

function td(extra = {}) {
  return {
    fontSize: 12, color: C.navy900, padding: '8px 12px', height: 36,
    ...extra,
  };
}

function primaryBtn() {
  return {
    background: C.blue600, color: '#fff', border: 'none',
    height: 32, padding: '0 16px', borderRadius: 6,
    fontFamily: FONT, fontSize: 13, fontWeight: 600, letterSpacing: 0.2,
    cursor: 'pointer',
  };
}

function secondaryBtn() {
  return {
    background: '#fff', color: C.navy900, border: `1px solid ${C.inputBorder}`,
    height: 32, padding: '0 16px', borderRadius: 6,
    fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: 'pointer',
  };
}

function ghostBtn() {
  return {
    background: 'transparent', color: C.blue600, border: 'none',
    height: 28, padding: '0 10px', borderRadius: 6,
    fontFamily: FONT, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center',
  };
}

function disabledBtn() {
  return {
    background: C.dividerStrong, color: C.textFaint, border: 'none',
    height: 32, padding: '0 16px', borderRadius: 6,
    fontFamily: FONT, fontSize: 13, fontWeight: 600,
    cursor: 'not-allowed',
  };
}

export default App;
