import React from 'react'

const ink = "var(--ink)"
const cobalt = "var(--cobalt)"
const cream50 = "var(--cream-50)"
const cream100 = "var(--cream-100)"
const moss = "var(--moss)"
const red = "var(--red)"

const CheckIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
    <polyline points="9 12 12 15 16 9"/>
  </svg>
)
const XIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
    <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)
const ClockIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const MemIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/>
    <path d="M7 12h.01"/><path d="M17 12h.01"/>
  </svg>
)

const SubmissionResults = ({ submission }) => {
  const memoryArr = JSON.parse(submission.memory || '[]')
  const timeArr = JSON.parse(submission.time || '[]')

  const avgMemory = memoryArr.map(m => parseFloat(m)).reduce((a, b) => a + b, 0) / (memoryArr.length || 1)
  const avgTime = timeArr.map(t => parseFloat(t)).reduce((a, b) => a + b, 0) / (timeArr.length || 1)

  const passedTests = submission.testCases.filter(tc => tc.passed).length
  const totalTests = submission.testCases.length
  const successRate = ((passedTests / totalTests) * 100).toFixed(1)

  const accepted = submission.status === 'Accepted'

  const statCard = (label, value, icon) => (
    <div style={{ background: cream50, border: `2px solid ${ink}`, borderRadius: 10, boxShadow: `3px 3px 0 ${ink}`, padding: '14px 18px' }}>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(15,26,61,0.55)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
        {icon}{label}
      </div>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: 26, lineHeight: 1, color: ink }}>{value}</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Status banner */}
      <div style={{ background: accepted ? 'rgba(87,154,71,0.1)' : 'rgba(217,74,61,0.1)', border: `2px solid ${accepted ? moss : red}`, borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: accepted ? moss : red, display: 'inline-flex' }}>
          {accepted ? <CheckIcon /> : <XIcon />}
        </span>
        <span style={{ fontFamily: 'var(--f-display)', fontSize: 22, color: accepted ? moss : red }}>{submission.status}</span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'rgba(15,26,61,0.5)', marginLeft: 'auto' }}>
          {passedTests}/{totalTests} TEST CASES PASSED
        </span>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {statCard('Success rate', `${successRate}%`, null)}
        {statCard('Avg. runtime', `${avgTime.toFixed(3)}s`, <ClockIcon />)}
        {statCard('Avg. memory', `${avgMemory.toFixed(0)} KB`, <MemIcon />)}
      </div>

      {/* Test case table */}
      <div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em', color: cobalt, textTransform: 'uppercase', marginBottom: 8 }}>◇ TEST CASE RESULTS</div>
        <div style={{ border: `1.5px solid ${ink}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px 80px', background: cobalt, color: cream50, padding: '10px 18px', gap: 12, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            <span>Status</span>
            <span>Expected output</span>
            <span>Your output</span>
            <span>Memory</span>
            <span>Time</span>
          </div>
          {submission.testCases.map((tc, i) => (
            <div key={tc.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px 80px', padding: '11px 18px', gap: 12, borderTop: i ? '1px dashed rgba(15,26,61,0.18)' : 'none', background: i % 2 === 0 ? cream50 : cream100, alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: tc.passed ? moss : red, fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 13 }}>
                {tc.passed ? <CheckIcon /> : <XIcon />}
                {tc.passed ? 'Passed' : 'Failed'}
              </span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, wordBreak: 'break-word' }}>{tc.expected}</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, wordBreak: 'break-word', color: tc.passed ? ink : red }}>{tc.stdout || '—'}</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.6)' }}>{tc.memory}</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.6)' }}>{tc.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubmissionResults
