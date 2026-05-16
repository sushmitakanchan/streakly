import React, { useState, useEffect } from 'react'
import Editor from "@monaco-editor/react"
import { Link, useParams } from "react-router-dom"
import { useProblemStore } from "../store/useProblemStore"
import { useExecutionStore } from '../store/useExecutionStore'
import { getLanguageId } from "../libs/lang"
import { useSubmissionStore } from '../store/useSubmissionStore'
import { useAuthStore } from '../store/useAuthStore'
import SubmissionResults from '../components/Submission'
import SubmissionList from '../components/SubmissionsList'

const ink = "var(--ink)"
const cobalt = "var(--cobalt)"
const cream50 = "var(--cream-50)"
const cream100 = "var(--cream-100)"
const moss = "var(--moss)"
const mustard = "var(--mustard)"

const ppS = {
  page: {
    background: cream50,
    backgroundImage: `linear-gradient(to right, rgba(30,63,168,0.08) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(30,63,168,0.08) 1px, transparent 1px)`,
    backgroundSize: "28px 28px",
    color: ink,
    fontFamily: "var(--f-body)",
    minHeight: "100vh",
  },
  nav: { background: cream100, borderBottom: `1.5px solid ${ink}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" },
  card: { background: cream50, border: `2px solid ${ink}`, borderRadius: 12, boxShadow: `4px 4px 0 ${ink}`, overflow: "hidden" },
  cardCobaltShadow: { background: cream50, border: `2px solid ${ink}`, borderRadius: 12, boxShadow: `4px 4px 0 ${cobalt}`, overflow: "hidden" },
  iconBtn: { width: 38, height: 38, borderRadius: 8, border: `2px solid ${ink}`, background: cream50, color: ink, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: `2px 2px 0 ${ink}` },
  select: { padding: "8px 12px", border: `2px solid ${ink}`, borderRadius: 8, background: cream50, color: ink, fontFamily: "var(--f-mono)", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `2px 2px 0 ${ink}`, minWidth: 150 },
  btnPrimary: { fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 14, padding: "11px 20px", border: `2px solid ${ink}`, borderRadius: 8, background: cobalt, color: cream100, boxShadow: `3px 3px 0 ${ink}`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  btnSuccess: { fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 14, padding: "11px 20px", border: `2px solid ${ink}`, borderRadius: 8, background: moss, color: cream50, boxShadow: `3px 3px 0 ${ink}`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  kicker: { fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.16em", color: cobalt, textTransform: "uppercase" },
  tabsBar: { display: "flex", background: cream100, borderBottom: `1.5px solid ${ink}`, padding: "0 12px" },
  tabBtn: (active) => ({
    padding: "14px 16px", background: "transparent", border: "none",
    borderBottom: active ? `3px solid ${cobalt}` : "3px solid transparent",
    fontFamily: "var(--f-sans)", fontSize: 13, fontWeight: active ? 700 : 500,
    color: active ? cobalt : "rgba(15,26,61,0.65)", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 6, marginBottom: -1.5,
  }),
  codeChip: { display: "inline-block", background: ink, color: cream50, padding: "4px 10px", borderRadius: 6, fontFamily: "var(--f-mono)", fontSize: 14, fontWeight: 600, wordBreak: "break-all" },
  exampleBlock: { background: cream100, border: `1.5px solid ${ink}`, borderRadius: 10, padding: 18, marginBottom: 14, fontFamily: "var(--f-mono)" },
  labelMicro: { fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.14em", color: cobalt, textTransform: "uppercase", marginBottom: 6, display: "block" },
}

const Icons = {
  Home:  ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>,
  Chev:  ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Clock: ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Users: ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Thumb: ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-6 0v4H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h13.4a2 2 0 0 0 2-1.6L22 12a2 2 0 0 0-2-2h-6z"/></svg>,
  File:  ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Code:  ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Chat:  ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Bulb:  ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c1 1 1.5 2 1.5 3.3h5c0-1.3.5-2.3 1.5-3.3A7 7 0 0 0 12 2z"/></svg>,
  Term:  ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  Play:  ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Check: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" strokeWidth="2"/><polyline points="9 12 12 15 16 9"/></svg>,
}

function DiffPill({ level }) {
  const map = {
    Easy:   { bg: "#DCEAD0", c: "var(--moss)" },
    Medium: { bg: "#F8E4B6", c: "#b08000" },
    Hard:   { bg: "#F4C9C5", c: "var(--red)" },
  }
  const m = map[level] || { bg: cream100, c: ink }
  return (
    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.14em", padding: "4px 10px", border: `1.5px solid ${m.c}`, borderRadius: 999, background: m.bg, color: m.c, textTransform: "uppercase", fontWeight: 700 }}>
      {level}
    </span>
  )
}

const fmtDiff = (d) => d ? d[0] + d.slice(1).toLowerCase() : ''

const ProblemPage = () => {
  const { id } = useParams()
  const { getProblemById, problem, isProblemLoading } = useProblemStore()

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore()

  const [code, setCode] = useState("")
  const [activeTab, setActiveTab] = useState("description")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [testCases, setTestCases] = useState([])

  const { executeCode, submission, isExecuting } = useExecutionStore()
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    getProblemById(id)
    getSubmissionCountForProblem(id)
  }, [id])

  // Refresh authUser after an accepted submission so the streak badge updates
  useEffect(() => {
    if (submission?.status === 'Accepted') {
      checkAuth()
    }
  }, [submission])

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "")
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      )
    }
  }, [problem, selectedLanguage])

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id)
    }
  }, [activeTab, id])

  const handleLanguageChange = (e) => {
    const lang = e.target.value
    setSelectedLanguage(lang)
    setCode(problem.codeSnippets?.[lang] || "")
  }

  const handleRunCode = (e) => {
    e.preventDefault()
    try {
      const language_id = getLanguageId(selectedLanguage)
      const stdin = problem.testcases.map((tc) => tc.input)
      const expected_outputs = problem.testcases.map((tc) => tc.output)
      executeCode(code, language_id, stdin, expected_outputs, id)
    } catch (error) {
      console.log("Error executing code", error)
    }
  }

  if (isProblemLoading || !problem) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: cream50 }}>
        <div style={{ background: cream100, border: `2px solid ${ink}`, borderRadius: 12, padding: 32, boxShadow: `4px 4px 0 ${ink}`, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.14em", color: cobalt, textTransform: "uppercase" }}>◆ LOADING PROBLEM...</div>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(15,26,61,0.85)", margin: "0 0 22px" }}>{problem.description}</p>
            {problem.examples && (
              <>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 24, margin: "0 0 14px", letterSpacing: "-0.01em" }}>Examples</h3>
                {Object.entries(problem.examples).map(([lang, example]) => (
                  <div key={lang} style={ppS.exampleBlock}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={ppS.labelMicro}>◇ INPUT</div>
                      <span style={ppS.codeChip}>{example.input}</span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={ppS.labelMicro}>◆ OUTPUT</div>
                      <span style={ppS.codeChip}>{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div>
                        <div style={{ ...ppS.labelMicro, color: moss }}>✓ EXPLANATION</div>
                        <p style={{ color: "rgba(15,26,61,0.78)", fontFamily: "var(--f-body)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{example.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            {problem.constraints && (
              <>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 24, margin: "8px 0 14px", letterSpacing: "-0.01em" }}>Constraints</h3>
                <div style={ppS.exampleBlock}>
                  <span style={ppS.codeChip}>{problem.constraints}</span>
                </div>
              </>
            )}
          </div>
        )
      case "submissions":
        return <SubmissionList submissions={submissions} isLoading={isSubmissionsLoading} />
      case "discussion":
        return (
          <div style={{ padding: "32px 16px", textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.14em", color: "rgba(15,26,61,0.55)", textTransform: "uppercase" }}>
            ◇ No discussions yet
          </div>
        )
      case "hints":
        return problem?.hints ? (
          <div style={ppS.exampleBlock}>
            <div style={{ ...ppS.labelMicro, color: mustard }}>◆ HINT</div>
            <span style={ppS.codeChip}>{problem.hints}</span>
          </div>
        ) : (
          <div style={{ padding: "32px 16px", textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.14em", color: "rgba(15,26,61,0.55)", textTransform: "uppercase" }}>
            ◇ No hints available
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={ppS.page}>
      {/* Nav */}
      <nav style={ppS.nav}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, minWidth: 0, flex: 1 }}>
          <Link
            to="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, color: cobalt, padding: "8px 10px", border: `2px solid ${ink}`, borderRadius: 8, background: cream50, boxShadow: `2px 2px 0 ${ink}`, flexShrink: 0, textDecoration: "none" }}
          >
            <Icons.Home /><Icons.Chev />
          </Link>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={ppS.kicker}>◆ PROBLEM</div>
            <h1 style={{ fontFamily: "var(--f-display)", fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "2px 0 8px" }}>
              {problem.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.06em", color: "rgba(15,26,61,0.65)" }}>
              <DiffPill level={fmtDiff(problem.difficulty)} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <Icons.Clock /> UPDATED {new Date(problem.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
              </span>
              <span style={{ color: "rgba(15,26,61,0.3)" }}>·</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <Icons.Users /> {submissionCount} SUBMISSIONS
              </span>
              <span style={{ color: "rgba(15,26,61,0.3)" }}>·</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: moss }}>
                <Icons.Thumb /> 95% SUCCESS
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <select style={ppS.select} value={selectedLanguage} onChange={handleLanguageChange}>
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div style={{ padding: "20px 24px 32px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left: tabs + content */}
          <div style={ppS.cardCobaltShadow}>
            <div style={ppS.tabsBar}>
              <button style={ppS.tabBtn(activeTab === "description")} onClick={() => setActiveTab("description")}><Icons.File /> Description</button>
              <button style={ppS.tabBtn(activeTab === "submissions")} onClick={() => setActiveTab("submissions")}><Icons.Code /> Submissions</button>
              <button style={ppS.tabBtn(activeTab === "discussion")} onClick={() => setActiveTab("discussion")}><Icons.Chat /> Discussion</button>
              <button style={ppS.tabBtn(activeTab === "hints")} onClick={() => setActiveTab("hints")}><Icons.Bulb /> Hints</button>
            </div>
            <div style={{ padding: 24 }}>{renderTabContent()}</div>
          </div>

          {/* Right: Monaco editor */}
          <div style={ppS.card}>
            <div style={ppS.tabsBar}>
              <button style={ppS.tabBtn(true)}><Icons.Term /> Code editor</button>
            </div>
            <div style={{ height: 600 }}>
              <Editor
                height="100%"
                language={selectedLanguage.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                }}
              />
            </div>
            <div style={{ padding: 16, background: cream100, borderTop: `1.5px solid ${ink}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <button
                style={{ ...ppS.btnPrimary, opacity: isExecuting ? 0.7 : 1 }}
                onClick={handleRunCode}
                disabled={isExecuting}
              >
                <Icons.Play /> {isExecuting ? "Running..." : "Run code"}
              </button>
              <button
                style={{ ...ppS.btnSuccess, opacity: isExecuting ? 0.7 : 1 }}
                onClick={handleRunCode}
                disabled={isExecuting}
              >
                <Icons.Check /> {isExecuting ? "Submitting..." : "Submit solution"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: submission results or test cases */}
        <div style={{ ...ppS.card, marginTop: 20, padding: 24 }}>
          {submission ? (
            <SubmissionResults submission={submission} />
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div style={ppS.kicker}>◇ VERIFY</div>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: 28, margin: "2px 0 0", letterSpacing: "-0.01em" }}>Test cases</h3>
                </div>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.14em", color: "rgba(15,26,61,0.6)", textTransform: "uppercase" }}>
                  {testCases.length} cases
                </span>
              </div>
              <div style={{ border: `1.5px solid ${ink}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: cobalt, color: cream100, padding: "10px 18px", gap: 16, fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                  <span>Input</span>
                  <span>Expected output</span>
                </div>
                {testCases.map((tc, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "12px 18px", gap: 16, borderTop: i ? "1px dashed rgba(15,26,61,0.18)" : "none", background: i % 2 === 0 ? cream50 : cream100, fontFamily: "var(--f-mono)", fontSize: 13 }}>
                    <span style={{ wordBreak: "break-word" }}>{tc.input}</span>
                    <span style={{ wordBreak: "break-word" }}>{tc.output}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProblemPage
