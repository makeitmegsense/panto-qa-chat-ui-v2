import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= TYPES ================= */

type Mode = "autonomous" | "guided";
type StepStatus = "pending" | "running" | "success" | "failed";

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

/* ================= BRAND ================= */

const BRAND = {
  primary: "#019D91",
  red: "#EF4444",
  gray: "#6B7280",
};

/* ================= STREAMING TEXT ================= */

function StreamingText({ text }: { text: string }) {
  const [visible, setVisible] = useState("");

  useEffect(() => {
    setVisible("");
    let i = 0;

    const id = setInterval(() => {
      i++;
      setVisible(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 12);

    return () => clearInterval(id);
  }, [text]);

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
      <span className="text-gray-500 font-medium">Mahoraga is working…</span>
    </div>
  );
}

/* ================= DEVICE PREVIEW ================= */

function DevicePreview() {
  return (
    <div className="relative w-[300px] h-[620px]">
      <div className="absolute inset-0 blur-2xl opacity-30" style={{ background: BRAND.primary }} />

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

  /* === NEW: persistent chat history === */
  const [chatRuns, setChatRuns] = useState<ExecutionStep[][]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps, running, finished, chatRuns]);

  const validateInput = (text: string) => {
    if (!text.trim()) return "Please enter a task to test.";
    if (text.length < 3) return "Task description is too short.";
    return null;
  };

  const runTest = () => {
    const validationError = validateInput(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    const fail = input.toLowerCase().includes("orange");

    const generatedSteps =
      mode === "guided"
        ? GUIDED_STEPS.map((title, i) => ({
            id: String(i + 1),
            title,
            logs: [],
            status: "pending" as StepStatus,
          }))
        : buildAutonomousSteps(input, fail);

    setSteps(generatedSteps);
    setRunning(true);
    setFinished(null);
    setExpanded("1");

    let index = 0;

    intervalRef.current = setInterval(() => {
      setSteps((prev) =>
        prev.map((s, i) => {
          if (i < index) return { ...s, status: "success" };
          if (i === index) return { ...s, status: "running" };
          return s;
        })
      );

      setExpanded(String(index + 1));
      index++;

      if (index >= 4) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const failCase = input.toLowerCase().includes("orange");
        const result: "Passed" | "Failed" = failCase ? "Failed" : "Passed";

        setSteps((prev) =>
          prev.map((s, i) => ({
            ...s,
            status: i === 3 && failCase ? "failed" : "success",
          }))
        );

        setRunning(false);
        setFinished(result);
        setExpanded(null);

        /* === store finished run in chat history === */
        setChatRuns((prev) => [...prev, generatedSteps]);

        setHistory((h) => [
          { id: Date.now(), name: input, result, duration: "1m 42s" },
          ...h,
        ]);

        setInput("");
      }
    }, 1800);
  };

  return (
    <div className="flex bg-white min-h-screen text-gray-900">
      <Sidebar />

      <div className="flex-1 p-6 grid grid-cols-[1fr_360px] gap-8">
        {/* ================= CHAT ================= */}
        <div className="flex flex-col h-[calc(100vh-48px)]">

  {/* CHAT AREA gets full priority height */}
  <div className="flex flex-col flex-1 min-h-0">

          {/* HEADER */}
          <div className="border-b border-gray-200 pb-4 mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Android Emulator • QA Execution</div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold">{steps[0]?.title || "New QA Task"}</h1>
                {running && (
                  <span className="text-xs px-2 py-1 rounded-full bg-teal-50 text-teal-700 font-medium">
                    Running
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CHAT STREAM */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">

              {/* === PREVIOUS RUNS === */}
              {chatRuns.map((run, r) => (
                <div key={r} className="space-y-6">
                  {run.map((step) => (
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

                      {mode === "autonomous" && step.logs.length > 0 && (
                        <div
                          className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700"
                          style={{ borderRadius: 4 }}
                        >
                          {step.logs.map((log, i) => (
                            <p key={i}>
                              <StreamingText text={log} />
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* === CURRENT RUN === */}
              {steps.map((step) => {
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
                              className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700"
                              style={{ borderRadius: 4 }}
                            >
                              {step.logs.map((log, i) => (
                                <p key={i}>
                                  <StreamingText text={log} />
                                </p>
                              ))}

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

              {/* RESULT */}
              {finished && (
                <div>
                  <span
                    className="text-sm font-semibold px-4 py-1.5 rounded-full"
                    style={{
                      background: finished === "Passed" ? "#ECFDF5" : "#FEF2F2",
                      color: finished === "Passed" ? BRAND.primary : BRAND.red,
                    }}
                  >
                    {finished === "Passed" ? "Success" : "Failed"}
                  </span>
                </div>
              )}

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
          <div className="border border-gray-200 bg-white flex items-center gap-3 p-3 mt-4" style={{ borderRadius: 4 }}>
            <input
              value={input}
              disabled={running}
              onChange={(e) => setInput(e.target.value)}
              placeholder={finished ? "What would you like me to do next?" : "Describe the QA task…"}
              className="flex-1 outline-none text-sm px-2 disabled:opacity-50"
            />

            <select
              value={mode}
              disabled={running}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="text-sm px-2 py-1 border"
              style={{ borderRadius: 4 }}
            >
              <option value="guided">Guided</option>
              <option value="autonomous">Autonomous</option>
            </select>

            <button
              onClick={runTest}
              disabled={running}
              className="px-4 py-1 text-white text-sm"
              style={{ background: BRAND.primary, borderRadius: 4, opacity: running ? 0.5 : 1 }}
            >
              {running ? "Running…" : "Run"}
            </button>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <PreviousTests tests={history} />
        </div>
        </div>

        {/* DEVICE */}
        <div className="flex items-start justify-center pt-6">
          <DevicePreview />
        </div>
      </div>
    </div>
  );
}
