import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Editor from "@monaco-editor/react"
import { axiosInstance } from '../libs/axios'
import toast from "react-hot-toast"
import { Logo } from '../revamp/primitives'
import { useAuthStore } from '../store/useAuthStore'

// ─── Style tokens ────────────────────────────────────────────────────────────

const ink = "var(--ink)"
const cobalt = "var(--cobalt)"
const cream50 = "var(--cream-50)"
const cream100 = "var(--cream-100)"
const red = "var(--red)"
const moss = "var(--moss)"
const mustard = "var(--mustard)"

const cpS = {
  page: { background: cream50, color: ink, fontFamily: "var(--f-body)", padding: "28px 24px 56px" },
  shell: { maxWidth: 1120, margin: "0 auto" },
  card: { background: cream50, border: `2px solid ${ink}`, borderRadius: 14, boxShadow: `5px 5px 0 ${ink}`, padding: 28 },
  section: { background: cream100, border: `2px solid ${ink}`, borderRadius: 12, boxShadow: `4px 4px 0 ${cobalt}`, padding: 22 },
  sectionAlt: { background: cream50, border: `2px solid ${ink}`, borderRadius: 12, boxShadow: `4px 4px 0 ${ink}`, padding: 20 },
  kicker: { fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.18em", color: cobalt, textTransform: "uppercase" },
  h1: { fontFamily: "var(--f-display)", fontSize: 56, lineHeight: 0.95, letterSpacing: "-0.02em", margin: "6px 0 0", color: ink },
  h3: { fontFamily: "var(--f-display)", fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.01em", margin: 0, color: ink, display: "flex", alignItems: "center", gap: 10 },
  label: { fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(15,26,61,0.7)", marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "12px 14px", border: `2px solid ${ink}`, borderRadius: 8, background: cream50, fontFamily: "var(--f-body)", fontSize: 15, color: ink, boxShadow: `3px 3px 0 ${ink}`, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "12px 14px", border: `2px solid ${ink}`, borderRadius: 8, background: cream50, fontFamily: "var(--f-body)", fontSize: 14, color: ink, boxShadow: `3px 3px 0 ${ink}`, minHeight: 110, resize: "vertical", outline: "none", lineHeight: 1.5, boxSizing: "border-box" },
  btn: { fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 13, padding: "10px 16px", border: `2px solid ${ink}`, borderRadius: 8, background: cream50, color: ink, boxShadow: `3px 3px 0 ${ink}`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  btnPrimary: { fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 13, padding: "10px 16px", border: `2px solid ${ink}`, borderRadius: 8, background: cobalt, color: cream100, boxShadow: `3px 3px 0 ${ink}`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  btnDanger: { padding: "6px 12px", border: `2px solid ${red}`, borderRadius: 8, background: "rgba(217,74,61,0.08)", color: red, fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 12, boxShadow: `2px 2px 0 ${red}`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  pill: { fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.14em", padding: "3px 8px", border: `1.5px solid ${ink}`, borderRadius: 999, background: cream50, color: ink, textTransform: "uppercase" },
  editorFrame: { border: `2px solid ${ink}`, borderRadius: 10, overflow: "hidden", boxShadow: `4px 4px 0 ${ink}`, background: "#1e1e1e" },
  errorText: { fontFamily: "var(--f-mono)", fontSize: 11, color: red, marginTop: 5 },
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const CpIcon = {
  Plus:  ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  Trash: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  File:  ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Book:  ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Check: ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 16 9"/></svg>,
  Code:  ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Bulb:  ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c1 1 1.5 2 1.5 3.3h5c0-1.3.5-2.3 1.5-3.3A7 7 0 0 0 12 2z"/></svg>,
  Dl:    ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
}

function CpSectionHeader({ icon: Icon, title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
      <h3 style={cpS.h3}>
        {Icon && <span style={{ color: cobalt, display: "inline-flex" }}><Icon s={20} /></span>}
        {title}
      </h3>
      {action}
    </div>
  )
}

// ─── Zod schema ──────────────────────────────────────────────────────────────

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
    }))
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({ input: z.string().min(1, "Input is required"), output: z.string().min(1, "Output is required"), explanation: z.string().optional() }),
    PYTHON:     z.object({ input: z.string().min(1, "Input is required"), output: z.string().min(1, "Output is required"), explanation: z.string().optional() }),
    JAVA:       z.object({ input: z.string().min(1, "Input is required"), output: z.string().min(1, "Output is required"), explanation: z.string().optional() }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON:     z.string().min(1, "Python code snippet is required"),
    JAVA:       z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON:     z.string().min(1, "Python solution is required"),
    JAVA:       z.string().min(1, "Java solution is required"),
  }),
})

// ─── Sample data ─────────────────────────────────────────────────────────────

const sampledpData = {
  title: "Climbing Stairs",
  category: "dp",
  description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints: "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial: "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testcases: [
    { input: "2", output: "2" },
    { input: "3", output: "3" },
    { input: "4", output: "5" },
  ],
  examples: {
    JAVASCRIPT: { input: "n = 2", output: "2", explanation: "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps" },
    PYTHON:     { input: "n = 3", output: "3", explanation: "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step" },
    JAVA:       { input: "n = 4", output: "5", explanation: "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps" },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys

  # Parse input
  n = int(sys.stdin.readline().strip())

  # Solve
  sol = Solution()
  result = sol.climbStairs(n)

  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }

  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());

      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);

      System.out.println(result);
      scanner.close();
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n

      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2

      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]

      return dp[n]

# Input parsing
if __name__ == "__main__":
  import sys

  # Parse input
  n = int(sys.stdin.readline().strip())

  # Solve
  sol = Solution()
  result = sol.climbStairs(n)

  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }

      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;

      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }

      return dp[n];
  }

  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());

      Main main = new Main();
      int result = main.climbStairs(n);

      System.out.println(result);
      scanner.close();
  }
}`,
  },
}

const sampleStringProblem = {
  title: "Valid Palindrome",
  description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints: "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints: "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial: "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testcases: [
    { input: "A man, a plan, a canal: Panama", output: "true" },
    { input: "race a car", output: "false" },
    { input: " ", output: "true" },
  ],
  examples: {
    JAVASCRIPT: { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
    PYTHON:     { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
    JAVA:       { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }

  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  // Process input line
  rl.on('line', (line) => {
    const result = isPalindrome(line);
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Write your code here
        pass

if __name__ == "__main__":
    import sys
    s = sys.stdin.readline().strip()

    sol = Solution()
    result = sol.isPalindrome(s)

    print(str(result).lower())`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');

    let left = 0;
    let right = s.length - 1;

    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }

    return true;
  }

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line) => {
    const result = isPalindrome(line);
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        filtered_chars = [c.lower() for c in s if c.isalnum()]
        return filtered_chars == filtered_chars[::-1]

if __name__ == "__main__":
    import sys
    s = sys.stdin.readline().strip()

    sol = Solution()
    result = sol.isPalindrome(s)

    print(str(result).lower())`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
}

// ─── Component ───────────────────────────────────────────────────────────────

const BTN = {
  fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 13,
  padding: '9px 14px', border: '2px solid var(--ink)',
  background: 'var(--cream-50)', color: 'var(--ink)',
  cursor: 'pointer', boxShadow: '3px 3px 0 var(--ink)', borderRadius: 8,
  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
}

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP")
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditMode = Boolean(editId)
  const { authUser, logout } = useAuthStore()
  const avatar = authUser?.name?.[0]?.toUpperCase() ?? '?'

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testcases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON:     { input: "", output: "", explanation: "" },
        JAVA:       { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON:     "def solution():\n    # Write your code here\n    pass",
        JAVA:       "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON:     "# Add your reference solution here",
        JAVA:       "// Add your reference solution here",
      },
    },
  })

  const { fields: testCaseFields, append: appendTestCase, remove: removeTestCase, replace: replacetestcases } = useFieldArray({ control, name: "testcases" })
  const { fields: tagFields, append: appendTag, remove: removeTag, replace: replaceTags } = useFieldArray({ control, name: "tags" })

  useEffect(() => {
    if (!editId) return
    axiosInstance.get(`/problem/get-problem/${editId}`)
      .then(({ data }) => {
        const p = data.problem
        replaceTags(p.tags.map(t => t))
        replacetestcases(p.testcases.map(tc => tc))
        reset(p)
      })
      .catch(() => toast.error("Failed to load problem for editing"))
  }, [editId])

  const onSubmit = async (value) => {
    try {
      setIsLoading(true)
      if (isEditMode) {
        const res = await axiosInstance.put(`/problem/update-problem/${editId}`, value)
        toast.success(res.data.message || "Problem updated successfully")
      } else {
        const res = await axiosInstance.post("/problem/create-problem", value)
        toast.success(res.data.message || "Problem created successfully⚡")
      }
      navigation("/dashboard")
    } catch (error) {
      console.log(error)
      toast.error(isEditMode ? "Error updating problem" : "Error creating problem")
    } finally {
      setIsLoading(false)
    }
  }

  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem
    replaceTags(sampleData.tags.map((tag) => tag))
    replacetestcases(sampleData.testcases.map((tc) => tc))
    reset(sampleData)
  }

  return (
    <div style={{ background: cream50, color: ink, fontFamily: 'var(--f-body)', minHeight: '100vh' }}>
      {/* Admin stripe */}
      <div style={{ background: ink, color: cream100, padding: '8px 32px', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em' }}>
        <span>◆ ADMIN CONSOLE — RESTRICTED ACCESS</span>
        <span>{authUser?.email} · {authUser?.name?.toUpperCase() ?? 'ADMIN'}</span>
      </div>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: `1.5px solid ${ink}`, background: cream100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/dashboard"><Logo size={24} /></Link>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em', padding: '3px 8px', background: 'var(--red)', color: cream100, border: `1.5px solid ${ink}`, borderRadius: 4 }}>ADMIN</span>
          </div>
          <nav style={{ display: 'flex', gap: 24, fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 500 }}>
            <Link to="/dashboard" style={{ color: ink, textDecoration: 'none' }}>Overview</Link>
            <Link to="/problems" style={{ color: ink, textDecoration: 'none' }}>Problems</Link>
            <Link to="/add-problem" style={{ color: cobalt, borderBottom: `2px solid ${cobalt}`, paddingBottom: 4, textDecoration: 'none' }}>New problem</Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/dashboard" style={BTN}>← Back to dashboard</Link>
          <div onClick={logout} title="Sign out" style={{ width: 36, height: 36, borderRadius: '50%', background: cobalt, color: cream100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: 16, border: `1.5px solid ${ink}`, cursor: 'pointer' }}>{avatar}</div>
        </div>
      </header>

    <div style={cpS.page}>
      <div style={cpS.shell}>
        <div style={cpS.card}>
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingBottom: 22, marginBottom: 28, borderBottom: "1.5px dashed rgba(15,26,61,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
              <div>
                <div style={cpS.kicker}>{isEditMode ? '◆ ADMIN · EDIT PROBLEM' : '◆ ADMIN · NEW PROBLEM'}</div>
                <h1 style={cpS.h1}>{isEditMode ? <>Edit <em style={{ color: cobalt }}>problem.</em></> : <>Author a <em style={{ color: cobalt }}>problem.</em></>}</h1>
                <p style={{ fontSize: 14, color: "rgba(15,26,61,0.7)", marginTop: 10, maxWidth: 520 }}>
                  {isEditMode
                    ? "Update metadata, test cases, and reference solutions. All solutions are re-validated on save."
                    : "Fill in metadata, test cases, and reference solutions for all three languages. Auto-saves nothing — submit when complete."}
                </p>
              </div>
              {!isEditMode && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ display: "inline-flex", border: `2px solid ${ink}`, borderRadius: 8, overflow: "hidden", boxShadow: `3px 3px 0 ${ink}` }}>
                    {["DP", "string"].map((k, i) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setSampleType(k)}
                        style={{ padding: "9px 14px", border: "none", borderRight: i === 0 ? `2px solid ${ink}` : "none", background: sampleType === k ? cobalt : cream50, color: sampleType === k ? cream100 : ink, fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", fontWeight: 600 }}
                      >
                        {k === "DP" ? "DP PROBLEM" : "STRING PROBLEM"}
                      </button>
                    ))}
                  </div>
                  <button type="button" style={cpS.btn} onClick={loadSampleData}><CpIcon.Dl /> Load sample</button>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Basics */}
              <div style={cpS.section}>
                <CpSectionHeader icon={CpIcon.File} title="Basics" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={cpS.label}>Title</label>
                    <input style={cpS.input} {...register("title")} placeholder="Enter problem title" />
                    {errors.title && <div style={cpS.errorText}>{errors.title.message}</div>}
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={cpS.label}>Description</label>
                    <textarea style={{ ...cpS.textarea, minHeight: 130 }} {...register("description")} placeholder="Enter problem description" />
                    {errors.description && <div style={cpS.errorText}>{errors.description.message}</div>}
                  </div>
                  <div>
                    <label style={cpS.label}>Difficulty</label>
                    <select style={{ ...cpS.input, padding: "11px 14px", cursor: "pointer" }} {...register("difficulty")}>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                    {errors.difficulty && <div style={cpS.errorText}>{errors.difficulty.message}</div>}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div style={cpS.section}>
                <CpSectionHeader
                  icon={CpIcon.Book}
                  title="Tags"
                  action={
                    <button type="button" style={cpS.btnPrimary} onClick={() => appendTag("")}>
                      <CpIcon.Plus /> Add tag
                    </button>
                  }
                />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                  {tagFields.map((field, index) => (
                    <div key={field.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input style={{ ...cpS.input, flex: 1, padding: "10px 12px", fontSize: 13 }} {...register(`tags.${index}`)} placeholder="Enter tag" />
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        disabled={tagFields.length === 1}
                        style={{ width: 32, height: 32, border: `1.5px solid ${red}`, borderRadius: 6, background: "rgba(217,74,61,0.1)", color: red, cursor: tagFields.length === 1 ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", opacity: tagFields.length === 1 ? 0.4 : 1 }}
                      >
                        <CpIcon.Trash />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.tags && <div style={cpS.errorText}>{errors.tags.message}</div>}
              </div>

              {/* Test cases */}
              <div style={cpS.section}>
                <CpSectionHeader
                  icon={CpIcon.Check}
                  title="Test cases"
                  action={
                    <button type="button" style={cpS.btnPrimary} onClick={() => appendTestCase({ input: "", output: "" })}>
                      <CpIcon.Plus /> Add test case
                    </button>
                  }
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {testCaseFields.map((field, index) => (
                    <div key={field.id} style={cpS.sectionAlt}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--f-display)", fontSize: 20 }}>
                          <span style={{ ...cpS.pill, color: cobalt, borderColor: cobalt }}># {String(index + 1).padStart(2, "0")}</span>
                          Test case
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTestCase(index)}
                          disabled={testCaseFields.length === 1}
                          style={{ ...cpS.btnDanger, opacity: testCaseFields.length === 1 ? 0.4 : 1, cursor: testCaseFields.length === 1 ? "not-allowed" : "pointer" }}
                        >
                          <CpIcon.Trash s={12} /> Remove
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                          <label style={cpS.label}>Input</label>
                          <textarea style={{ ...cpS.textarea, minHeight: 80, fontFamily: "var(--f-mono)" }} {...register(`testcases.${index}.input`)} placeholder="Enter test case input" />
                          {errors.testcases?.[index]?.input && <div style={cpS.errorText}>{errors.testcases[index].input.message}</div>}
                        </div>
                        <div>
                          <label style={cpS.label}>Expected output</label>
                          <textarea style={{ ...cpS.textarea, minHeight: 80, fontFamily: "var(--f-mono)" }} {...register(`testcases.${index}.output`)} placeholder="Enter expected output" />
                          {errors.testcases?.[index]?.output && <div style={cpS.errorText}>{errors.testcases[index].output.message}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.testcases && !Array.isArray(errors.testcases) && (
                  <div style={cpS.errorText}>{errors.testcases.message}</div>
                )}
              </div>

              {/* Per-language sections */}
              {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
                <div key={language} style={cpS.section}>
                  <CpSectionHeader
                    icon={CpIcon.Code}
                    title={
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        {language}
                        <span style={{ ...cpS.pill, color: cobalt, borderColor: cobalt }}>
                          {language === "JAVASCRIPT" ? "JS" : language === "PYTHON" ? "PY" : "JV"}
                        </span>
                      </span>
                    }
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {/* Starter code */}
                    <div style={cpS.sectionAlt}>
                      <div style={{ marginBottom: 12 }}><span style={cpS.kicker}>◇ STARTER</span></div>
                      <div style={cpS.editorFrame}>
                        <Controller
                          name={`codeSnippets.${language}`}
                          control={control}
                          render={({ field }) => (
                            <Editor
                              height="300px"
                              language={language.toLowerCase()}
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on", roundedSelection: false, scrollBeyondLastLine: false, automaticLayout: true }}
                            />
                          )}
                        />
                      </div>
                      {errors.codeSnippets?.[language] && <div style={cpS.errorText}>{errors.codeSnippets[language].message}</div>}
                    </div>

                    {/* Reference solution */}
                    <div style={cpS.sectionAlt}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={{ color: moss, display: "inline-flex" }}><CpIcon.Check s={16} /></span>
                        <span style={{ ...cpS.kicker, color: moss }}>◆ REFERENCE SOLUTION</span>
                      </div>
                      <div style={cpS.editorFrame}>
                        <Controller
                          name={`referenceSolutions.${language}`}
                          control={control}
                          render={({ field }) => (
                            <Editor
                              height="300px"
                              language={language.toLowerCase()}
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on", roundedSelection: false, scrollBeyondLastLine: false, automaticLayout: true }}
                            />
                          )}
                        />
                      </div>
                      {errors.referenceSolutions?.[language] && <div style={cpS.errorText}>{errors.referenceSolutions[language].message}</div>}
                    </div>

                    {/* Example */}
                    <div style={cpS.sectionAlt}>
                      <div style={{ marginBottom: 12 }}><span style={cpS.kicker}>◇ EXAMPLE</span></div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                          <label style={cpS.label}>Input</label>
                          <textarea style={{ ...cpS.textarea, minHeight: 70, fontFamily: "var(--f-mono)" }} {...register(`examples.${language}.input`)} placeholder="Example input" />
                          {errors.examples?.[language]?.input && <div style={cpS.errorText}>{errors.examples[language].input.message}</div>}
                        </div>
                        <div>
                          <label style={cpS.label}>Output</label>
                          <textarea style={{ ...cpS.textarea, minHeight: 70, fontFamily: "var(--f-mono)" }} {...register(`examples.${language}.output`)} placeholder="Example output" />
                          {errors.examples?.[language]?.output && <div style={cpS.errorText}>{errors.examples[language].output.message}</div>}
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={cpS.label}>Explanation</label>
                          <textarea style={{ ...cpS.textarea, minHeight: 80 }} {...register(`examples.${language}.explanation`)} placeholder="Explain the example" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional info */}
              <div style={cpS.section}>
                <CpSectionHeader
                  icon={CpIcon.Bulb}
                  title={
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      Additional info
                      <span style={{ ...cpS.pill, color: mustard, borderColor: mustard }}>OPTIONAL</span>
                    </span>
                  }
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={cpS.label}>Constraints</label>
                    <textarea style={{ ...cpS.textarea, minHeight: 80, fontFamily: "var(--f-mono)" }} {...register("constraints")} placeholder="Enter problem constraints" />
                    {errors.constraints && <div style={cpS.errorText}>{errors.constraints.message}</div>}
                  </div>
                  <div>
                    <label style={cpS.label}>Hints (optional)</label>
                    <textarea style={{ ...cpS.textarea, minHeight: 80 }} {...register("hints")} placeholder="Enter hints for solving the problem" />
                  </div>
                  <div>
                    <label style={cpS.label}>Editorial (optional)</label>
                    <textarea style={{ ...cpS.textarea, minHeight: 110 }} {...register("editorial")} placeholder="Enter problem editorial / solution explanation" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 18, borderTop: "1.5px dashed rgba(15,26,61,0.25)" }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ ...cpS.btnPrimary, padding: "14px 26px", fontSize: 15, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
                >
                  {isLoading ? (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.1em" }}>{isEditMode ? 'SAVING...' : 'CREATING...'}</span>
                  ) : (
                    <><CpIcon.Check s={16} /> {isEditMode ? 'Save changes →' : 'Create problem →'}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  )
}

export default CreateProblemForm
