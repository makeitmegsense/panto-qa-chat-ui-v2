import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Link2, RefreshCw, Plus } from "lucide-react";

/* ================= TYPES ================= */

type Mode = "autonomous" | "guided";
type StepStatus = "pending" | "running" | "success" | "failed";
type ChatMessage =
  | {
      id: string;
      role: "user" | "bot";
      text: string;
    }
  | {
      id: string;
      role: "execution";
      testName: string;
      result: "Passed" | "Failed";
      steps: ExecutionStep[];
      mode: Mode;
      retries?: number;
      canRetry?: boolean;
    };

interface ExecutionStep {
  id: string;
  title: string;
  logs: string[];
  status: StepStatus;
}

interface TestHistory {
  id: number;
  name: string;
  result: "Passed" | "Failed";
  duration: string;
}
function RunningBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 gap">
      
      {/* perfectly centered pulse */}
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute h-2 w-2 rounded-full bg-teal-400 animate-ping opacity-75" />
        <span className="relative h-2 w-2 rounded-full bg-teal-600" />
      </span>

      {/* text with corrected line-height */}
      <span className="text-[12px] leading-none font-semibold text-teal-700">
        Running…
      </span>
    </div>
  );
}
/* ================= BRAND ================= */

const BRAND = {
  primary: "#019D91",
  red: "#EF4444",
  gray: "#6B7280",
};

/* ================= HEADER ================= */
function ExecuteHeader() {
  return (
    <div className="w-full border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">

      {/* LEFT */}
      <div>
        <div className="text-sm text-gray-500">
          Execute / Create New Test Flow
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3">

        {/* Bridge */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#019D91] text-teal-700 bg-white hover:bg-teal-50 transition text-sm font-medium">
          <Link2 className="w-4 h-4" />
          Bridge
        </button>

        {/* Health */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#019D91] text-teal-700 bg-white hover:bg-teal-50 transition text-sm font-medium">
          <Activity className="w-4 h-4" />
          Health
        </button>
      </div>
    </div>
  );
}

/* ================= STREAMING TEXT ================= */

function StreamingText({
  text,
  delay = 0,
  animate = true,
}: {
  text: string;
  delay?: number;
  animate?: boolean;
}) {
  const [visible, setVisible] = useState(animate ? "" : text);

  useEffect(() => {
    if (!animate) {
      setVisible(text);
      return;
    }

    let timeout: ReturnType<typeof setInterval>;
    let i = 0;

    const start = () => {
      timeout = setInterval(() => {
        i++;
        setVisible(text.slice(0, i));
        if (i >= text.length) clearInterval(timeout);
      }, 32); //slow
    };

    const delayTimer = setTimeout(start, delay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timeout);
    };
  }, [text, delay, animate]);

  return <>{visible}</>;
}



/* ================= SIDEBAR ================= */

function Sidebar() {
  const items = [
    "Execute",
    "Test Runs",
    "Test Flows",
    "Devices",
    "Apps",
    "Team",
    "Tools",
    "Settings",
  ];

  return (
    <div className="w-64 min-h-screen border-r border-gray-200 bg-white p-6 flex flex-col justify-between">
      <div>
        <div className="text-2xl font-semibold mb-8" style={{ color: BRAND.primary }}>
          &lt;panto&gt;
        </div>

        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={item}
              className={`px-3 py-2 text-sm cursor-pointer ${
                i === 0 ? "bg-teal-50 font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
              style={{ color: i === 0 ? BRAND.primary : undefined, borderRadius: 4 }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-400">Free Trial</div>
    </div>
  );
}

/* ================= THINKING INDICATOR ================= */

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 text-sm px-2 py-2">
      <div className="flex gap-1.5">
        {[0, 0.12, 0.24].map((d, i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: BRAND.primary }}
            animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: d }}
          />
        ))}
      </div>
      <span className="text-gray-500 font-medium">Panto QA is thinking…</span>
    </div>
  );
}

/* ================= DEVICE PREVIEW ================= */

function DevicePreview() {
  return (
    <div className="relative w-[300px] h-[620px]">
      <div className="absolute inset-0 blur-2xl opacity-30" style={{ background: "#ffffff" }} />

      <div className="relative w-full h-full bg-black rounded-[40px] border border-gray-800 shadow-2xl overflow-hidden">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Android_12_home_screen.png/512px-Android_12_home_screen.png"
          alt="Android device"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

/* ================= PREVIOUS TESTS ================= */

function PreviousTests({ tests }: { tests: TestHistory[] }) {
  const visible = tests.slice(0, 2);
  const hasMore = tests.length > 2;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm uppercase tracking-wide" style={{ color: BRAND.gray }}>
          Previous Tests
        </h3>
        <span className="text-xs text-gray-400">{tests.length} tasks</span>
      </div>

      {tests.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-400" style={{ borderRadius: 4 }}>
          No previous tests yet.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visible.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between bg-white border border-gray-200 px-4 py-4"
                style={{ borderRadius: 4 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: t.result === "Passed" ? BRAND.primary : BRAND.red }}
                  />
                  <div className="text-sm">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.duration}</div>
                  </div>
                </div>

                <button className="text-xs border border-gray-200 px-3 py-1 hover:bg-gray-50" style={{ borderRadius: 4 }}>
                  Report
                </button>
              </div>
            ))}
          </div>

          {hasMore && (
            <button className="mt-3 text-xs text-gray-500 hover:text-gray-700">
              View older tests →
            </button>
          )}
        </>
      )}
    </div>
  );
}

//testing

/* ================= STEP BUILDERS ================= */

const GUIDED_STEPS = [
  "Fetching Image and XML",
  "Searching for required element from data",
  "Executing action on device",
  "Validating actions",
];

const buildAutonomousSteps = (task: string, fail: boolean): ExecutionStep[] => [
  {
    id: "1",
    title: task,
    logs: [
      "I’m first understanding the current screen and determining the safest way to begin this task.",
      "My immediate goal is to open the correct application so the workflow can proceed.",
    ],
    status: "pending",
  },
  {
    id: "2",
    title: "Understanding UI state",
    logs: [
      "The application is loading, so I’m waiting for the main interface to become visible.",
      "Once visible, I’ll capture the UI hierarchy to understand the next possible actions.",
    ],
    status: "pending",
  },
  {
    id: "3",
    title: "Executing interaction",
    logs: [
      "I’ve identified the most relevant UI element for progressing toward the goal.",
      "I’m performing the interaction and monitoring the screen for confirmation.",
    ],
    status: "pending",
  },
  {
    id: "4",
    title: "Validating result",
    logs: fail
      ? [
          "The expected UI state did not appear after the interaction.",
          "This means the test has failed specifically during validation.",
        ]
      : [
          "The expected UI state is visible on the screen.",
          "Validation succeeded and the test scenario has passed.",
        ],
    status: "pending",
  },
];

function LoveableLogStream({
  logs,
  active,
  onDone,
}: {
  logs: string[];
  active: boolean;
  onDone?: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(active ? 0 : logs.length);

  useEffect(() => {
    if (!active) {
      setVisibleCount(logs.length);
      return;
    }

    let cancelled = false;

    const thinkPause = 900;
    const betweenPause = 1700;

    async function run() {
      await new Promise((r) => setTimeout(r, thinkPause));

      for (let i = 1; i <= logs.length; i++) {
        if (cancelled) return;

        setVisibleCount(i);

        if (i < logs.length) {
          await new Promise((r) => setTimeout(r, betweenPause));
        }
      }

      onDone?.(); // ✅ notify execution engine
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [logs, active]);

  return (
    <div className="space-y-2">
      {logs.slice(0, visibleCount).map((log, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-xs text-gray-600 leading-relaxed"
        >
          {active ? <StreamingText text={log} /> : log}
        </motion.p>
      ))}
    </div>
  );
}

/* ================= MAIN ================= */

export default function ChatLayout() {
  const [mode, setMode] = useState<Mode>("guided");
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState<"Passed" | "Failed" | null>(null);
  const [history, setHistory] = useState<TestHistory[]>([]);
  const [chatRuns, setChatRuns] = useState<ExecutionStep[][]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [currentTestName, setCurrentTestName] = useState<string | null>(null);


  useEffect(() => {
  setMessages([
    {
      id: "welcome",
      role: "bot",
      text: "Hi! I’m your QA assistant. What scenario would you like me to test today?"
    }
  ]);
}, []);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const el = chatScrollRef.current;
  if (!el) return;

  el.scrollTo({
    top: el.scrollHeight,
    behavior: "smooth",
  });
}, [messages, running, steps]);

  const validateInput = (text: string) => {
    if (!text.trim()) return "Please enter a task to test.";
    if (text.length < 3) return "Task description is too short.";
    return null;
  };
async function executeScenario(
  taskName: string,
  mode: Mode,
  fail: boolean,
  retryCount: number
): Promise<{
  result: "Passed" | "Failed";
  steps: ExecutionStep[];
}> {
  /* ================= BUILD STEPS ================= */
  const generatedSteps: ExecutionStep[] =
    mode === "guided"
      ? GUIDED_STEPS.map((title, i) => ({
          id: String(i + 1),
          title,
          logs: [],
          status: "pending" as StepStatus,
        }))
      : buildAutonomousSteps(taskName, fail);

  /* ================= INIT UI STATE ================= */
  setSteps(generatedSteps);
  setRunning(true);
  setFinished(null);
  setExpanded("1");

  /* =========================================================
     SEQUENTIAL EXECUTION — waits for logs to fully stream
  ========================================================= */
  for (let i = 0; i < generatedSteps.length; i++) {
    /* ----- mark running step ----- */
    setSteps((prev) =>
      prev.map((s, idx) =>
        idx < i
          ? { ...s, status: "success" }
          : idx === i
          ? { ...s, status: "running" }
          : s
      )
    );

    setExpanded(String(i + 1));

    /* ----- realistic timing based on logs ----- */
    const logCount = generatedSteps[i].logs.length || 1;

    const THINK = 900;      // pause before thinking
    const TYPE = 1200;      // typing duration per log
    const BETWEEN = 1700;   // pause between logs

    const wait = THINK + logCount * TYPE + (logCount - 1) * BETWEEN;

    await new Promise((r) => setTimeout(r, wait));
  }

  /* =========================================================
     FINAL RESULT — SINGLE SOURCE OF TRUTH
     Ensures FAILED test NEVER shows success logs
  ========================================================= */
/* =========================================================
   FINAL RESULT + FAILED STEP DETECTION
========================================================= */
const result: "Passed" | "Failed" = fail ? "Failed" : "Passed";

/* 
   Fail ONLY the last step.
   Everything before it must be success.
*/
const failedStepIndex = fail ? generatedSteps.length - 1 : -1;

/* =========================================================
   FREEZE FINAL STEPS (single source of truth for UI)
========================================================= */
const finalizedSteps: ExecutionStep[] = generatedSteps.map((s, i) => {
  let status: StepStatus;

  if (i === failedStepIndex) {
    status = "failed";
  } else {
    status = "success";
  }

  return {
    ...s,
    status,
    logs: [...s.logs], // freeze logs to avoid mutation bugs
  };
});

  /* ================= CLEANUP UI STATE ================= */
  setSteps(finalizedSteps);
  setRunning(false);
  setFinished(result);
  setExpanded(null);

  /* =========================================================
     RETURN ATOMIC SNAPSHOT
     (used by retry system + execution history card)
  ========================================================= */
  return {
    result,
    steps: finalizedSteps,
  };
}


const runTest = async (taskOverride?: string, retryCount = 0) => {
  const taskName = taskOverride ?? input;

  const validationError = validateInput(taskName);
  if (validationError) {
    setError(validationError);
    return;
  }

  setError(null);

  /* ================= USER MESSAGE ================= */
  if (!taskOverride) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + "-user", role: "user", text: taskName },
    ]);
  }

  /* ================= EXECUTION ================= */
const fail = taskName.toLowerCase().includes("orange");

const { result, steps: finalSteps } = await executeScenario(
  taskName,
  mode,
  fail,
  retryCount
);



  /* ================= AUTONOMOUS AUTO-RETRY ================= */
  if (mode === "autonomous" && result === "Failed" && retryCount < 2) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + "-bot",
        role: "bot",
        text: `Retrying automatically (${retryCount + 1}/3)…`,
      },
    ]);

    return runTest(taskName, retryCount + 1);
  }

  const executionId = String(Date.now());
  const canRetry = result === "Failed";

  /* ================= EXECUTION CARD ================= */
  setMessages((prev) => [
    ...prev,
    {
      id: executionId,
      role: "execution",
      testName: taskName,
      result,
      steps: finalSteps, // ✅ correct snapshot
      mode,
      retries: retryCount,
      canRetry,
    },
  ]);

  /* ================= BOT RESPONSE ================= */
  const text =
    result === "Passed"
      ? "Great! The test passed. Would you like me to validate another flow?"
      : mode === "autonomous"
      ? "I tried fixing this 3 times but it still failed. Would you like me to retry manually or debug it?"
      : "The test failed. Would you like to retry?";

  setMessages((prev) => [
    ...prev,
    { id: Date.now() + "-bot", role: "bot", text },
  ]);

  /* ================= HISTORY ================= */
  setHistory((h) => [
    { id: Date.now(), name: taskName, result, duration: "1m 42s" },
    ...h,
  ]);

  setInput("");
};

return (
<div className="flex bg-white h-screen overflow-hidden text-gray-900">
    <Sidebar />

  <div className="flex-1 flex flex-col overflow-hidden">
  <ExecuteHeader />

<div className="p-6 grid grid-cols-[1fr_360px] gap-8 flex-1 min-h-0 overflow-hidden">
        {/* ================= CHAT ================= */}
        <div className="flex flex-col min-h-0 flex-1">

  {/* CHAT AREA*/}
  <div className="
flex flex-col flex-1 min-h-0
p-6
rounded-[4px]

bg-white/40
backdrop-blur-xl
backdrop-saturate-150

border border-gray-200
shadow-sm
" style={{ borderRadius: 4 }}>

{/* HEADER */}
<div className="border-b border-gray-200 pb-4 mb-4 flex items-center justify-between">

  {/* LEFT: title */}
  <div className="flex items-center gap-3">
    <h1 className="text-lg font-semibold">
      {history[0]?.name || "New QA Task"}
    </h1>
    {running && <RunningBadge />}
  </div>

  {/* RIGHT: actions */}
  <div className="flex items-center gap-3">

    {/* Refresh */}
    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-teal-500 text-teal-700 bg-white hover:bg-teal-50 transition text-sm font-medium">
      <RefreshCw className="w-4 h-4" />
      Refresh
    </button>

    {/* Connect Device */}
    <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold shadow-sm hover:opacity-90 transition bg-teal-600">
      <Plus className="w-4 h-4" />
      Connect Device
    </button>

  </div>
</div>

          {/* CHAT STREAM */}
          <div className="flex-1 flex flex-col min-h-0">
<div
  ref={chatScrollRef}
  className="flex-1 overflow-y-auto pr-2 space-y-6"
>
        {/* === CHAT CONVERSATION === */}
           {/* === PREVIOUS RUNS === */}
{chatRuns.map((run, r) => {
  const isOpen = expandedRun === String(r);
  const title = history[r]?.name ?? "Test";

  return (
    <div key={r} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">

      {/* Collapsed header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">
          Test run: {title}
        </div>

        <button
          onClick={() => setExpandedRun(isOpen ? null : String(r))}
          className="text-xs font-medium text-teal-700 hover:underline"
        >
          {isOpen ? "Hide details" : "View details"}
        </button>
      </div>
      {history[r] && (
  <div className="mt-2">
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full"
      style={{
        background:
          history[r].result === "Passed" ? "#ECFDF5" : "#FEF2F2",
        color:
          history[r].result === "Passed" ? BRAND.primary : BRAND.red,
      }}
    >
      {history[r].result === "Passed" ? "Success" : "Failed"}
    </span>
  </div>
)}

      {/* Expanded content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {run.map((step) => (
              <div key={step.id} className="space-y-1">

                {/* GUIDED → show step label only */}
                {mode === "guided" && (
                  <div className="text-sm font-medium text-gray-900">
                    Step {step.id}: {step.title}
                  </div>
                )}

                {/* AUTONOMOUS → preview + expandable reasoning */}
                {mode === "autonomous" && step.logs.length > 0 && (
                  <>
                    {/* Sneak-peek log */}
                    <div className="text-xs text-gray-600">
                      {step.logs[0]}
                    </div>

                    {/* Toggle reasoning */}
                    <button
                      onClick={() =>
                        setExpanded(expanded === step.id ? null : step.id)
                      }
                      className="text-xs text-teal-700 hover:underline"
                    >
                      {expanded === step.id ? "Hide reasoning" : "Show reasoning"}
                    </button>

                    <AnimatePresence>
                      {expanded === step.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs space-y-1"
                        >
                          {step.logs.map((log, i) => (
                            <p key={i}>
                              <StreamingText text={log} />
                            </p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
})}
{messages.map((m) => {
  /* ================= USER ================= */
  if (m.role === "user") {
    return (
      <div key={m.id} className="flex justify-end">
        <div className="max-w-[70%] px-4 py-2 text-sm rounded-2xl shadow-sm bg-teal-600 text-white">
          {m.text}
        </div>
      </div>
    );
  }

  /* ================= BOT ================= */
  if (m.role === "bot") {
    return (
      <div key={m.id} className="flex justify-start">
        <div className="max-w-[70%] px-4 py-2 text-sm rounded-2xl shadow-sm bg-gray-100 text-gray-800">
          {m.text}
        </div>
      </div>
    );
  }

  /* ================= EXECUTION CARD ================= */
if (m.role === "execution") {
  const isOpen = expandedRun === m.id;
  const executionMode = m.mode; 
  return (
<motion.div
  key={m.id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25 }}
  className="flex justify-start"
>
  <div className="w-full border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">
            Test run: {m.testName}
          </div>

          <button
            onClick={() => setExpandedRun(isOpen ? null : m.id)}
            className="text-xs font-medium text-teal-700 hover:underline"
          >
            {isOpen ? "Hide details" : "View details"}
          </button>
        </div>

        {/* Result badge */}
        <div className="mt-3">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: m.result === "Passed" ? "#ECFDF5" : "#FEF2F2",
              color: m.result === "Passed" ? BRAND.primary : BRAND.red,
            }}
          >
            {m.result === "Passed" ? "Success" : "Failed"}
          </span>
        </div>

        {/* ================= EXPANDED DETAILS ================= */}
        {isOpen && (
          <div className="mt-4 space-y-3">
            {m.steps.map((step) => (
              <div key={step.id} className="text-sm text-gray-700">
                
                {/* Guided → simple step list */}
                {executionMode === "guided" && (
  <div
    className={`
      flex items-center gap-2 text-sm font-medium
      ${step.status === "failed"
        ? "text-red-600"
        : step.status === "success"
        ? "text-teal-700"
        : "text-gray-500"}
    `}
  >
    {/* status dot */}
    <span
      className={`
        w-2 h-2 rounded-full
        ${step.status === "failed"
          ? "bg-red-500"
          : step.status === "success"
          ? "bg-teal-500"
          : "bg-gray-300"}
      `}
    />

    Step {step.id}: {step.title}
  </div>
)}

                {/* Autonomous → reasoning logs */}
{executionMode === "autonomous" && (
  <div className="space-y-3 mt-3">
   <div
  className={`
    font-medium
    ${
      step.status === "failed"
        ? "text-red-600"
        : "text-[#019D91]"
    }
  `}
>
  {step.title}
</div>

{step.logs.map((log, i) => (
  <motion.p
    key={i}
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: running ? i * 2.2 : 0, // stagger only while running
      duration: 0.35,
      ease: "easeOut",
    }}
    className="text-xs text-gray-600 leading-relaxed"
  >
    {log}
  </motion.p>
))}

  </div>
)}
              </div>
            ))}
          </div>
        )}
                {m.canRetry && (
 <button
  onClick={() => runTest(m.testName, 0)}
  className="
    mt-4 inline-flex items-center gap-2
    px-3.5 py-1.5 rounded-lg
    text-xs font-semibold
    bg-white text-teal-700
    border border-[#019D91]
    shadow-sm
    hover:bg-teal-50 hover:border-teal-300
    active:scale-[0.97]
    transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-teal-500/30
  "
>
  <RefreshCw className="w-3.5 h-3.5" />
  Retry test
</button>
)}
      </div>
    </motion.div>
  );
}


  return null;
})}

              {/* === CURRENT RUN === */}
              {!finished && steps.map((step) => {
                const isExpanded = expanded === step.id;

                return (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          background:
                            step.status === "failed"
                              ? BRAND.red
                              : step.status === "success"
                              ? BRAND.primary
                              : "#9CA3AF",
                        }}
                      />
                      {step.title}
                    </div>

                    {mode === "autonomous" && (
                      <>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="px-4 py-3 text-sm text-gray-800
bg-white/40
backdrop-blur-md backdrop-saturate-150
border border-teal-100
shadow-[0_4px_16px_rgba(1,157,145,0.08)]
rounded-[4px]"
                              style={{ borderRadius: 4 }}
                            >
                              {mode === "autonomous" && (
  <div className="space-y-3 mt-3">
   <div
  className={`
    flex items-center gap-2 text-[13px] font-semibold tracking-tight
    ${step.status === "running"
      ? "text-teal-700"
      : "text-gray-500"}
  `}
>
  <span
    className={`
      ${
      step.status === "failed"
        ? "text-red-600 font-semibold"
        : step.status === "running"
        ? "text-teal-700"
        : step.status === "success"
        ? "text-teal-700"
        : "text-gray-500"}
    `}
  />
  {step.title}
</div>

    <LoveableLogStream
      logs={step.logs}
      active={running}
    />
  </div>
)}

                              {step.status !== "pending" && (
                                <button
                                  onClick={() => setExpanded(null)}
                                  className="text-xs text-gray-400 mt-2"
                                >
                                  Hide
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {!isExpanded && step.logs.length > 0 && step.status !== "pending" && (
                          <button onClick={() => setExpanded(step.id)} className="text-xs text-gray-400">
                            Show reasoning
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

              <div ref={chatEndRef} />
            </div>

            {/* PINNED THINKING INDICATOR */}
            {running && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <ThinkingIndicator />
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="sticky bottom-0 border border-gray-200 bg-white flex items-center gap-3 p-3 mt-4 rounded-xl shadow-sm" style={{ borderRadius: 4 }}>
            <input
              value={input}
              disabled={running}
              onChange={(e) => setInput(e.target.value)}
              placeholder={finished ? "What would you like me to do next?" : "Describe the QA task…"}
              className="flex-1 outline-none text-sm px-2 disabled:opacity-50"
            />

            {/* MODE TOGGLE */}
<div className="flex items-center bg-gray-100 rounded-lg p-1">
  {(["guided", "autonomous"] as Mode[]).map((m) => {
    const active = mode === m;

    return (
      <button
        key={m}
        disabled={running}
        onClick={() => setMode(m)}
        className={`
          px-3 py-1.5 text-xs font-semibold rounded-md transition-all
          ${active
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-500 hover:text-gray-700"}
          ${running ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {m === "guided" ? "Guided" : "Autonomous"}
      </button>
    );
  })}
</div>

{/* RUN BUTTON */}
<button
  onClick={() => runTest()}
  disabled={running}
  className={`
    flex items-center justify-center gap-2
    px-5 py-2 text-sm font-semibold rounded-lg
    text-white transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-teal-500/40
    ${running
      ? "bg-teal-500/70 cursor-not-allowed"
      : "bg-teal-600 hover:bg-teal-700 active:scale-[0.97] shadow-sm"}
  `}
>
  {running && (
    <span className="flex items-center gap-1">
      {[0, 0.15, 0.3].map((d, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </span>
  )}

  <span className="min-w-[64px] text-center">
    {running ? "Running…" : "Run"}
  </span>
</button>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
        </div>

        {/* DEVICE */}
        <div className="flex items-start justify-center pt-6">
          <DevicePreview />
        </div>
      </div>
    </div>
    </div>
  );
}
