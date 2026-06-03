const { useState, useRef, useEffect } = React;

const API_KEY = "PASTE_YOUR_API_KEY_HERE";

const SYSTEM_PROMPT = `You are the Okland Safety Assistant. You answer construction safety questions drawing from three specific sources. Always label which source your answer comes from using brackets like [Okland Specific Manual], [Subcontractor Specific Manual], or [OSHA 29 CFR 1926].

SOURCE 1: OKLAND SPECIFIC MANUAL (112 pages) — for Okland employees
This manual is for Okland Construction's own staff. It contains everything in the Subcontractor manual PLUS a Safety & Health Responsibility Matrix:
- Senior Leadership: Owns overall SHE program. Provides resources and policies for a proactive safety culture.
- Director of Operations: Holds Project Directors accountable. Ensures safety roles are in each position's scorecard.
- Field Operations Directors: Holds Superintendents accountable. Walks jobsites. Contributes to policy development.
- Project Directors: Evaluates RFPs for safety risks. Provides adequate safety budgets. Leads project kick-off meetings.
- Project Managers: Includes Safety Professional in all high-risk preconstruction meetings.
- General Superintendents / Project Superintendents: Leads and implements Okland SHE program on-site. Runs weekly safety inspections. Enables field employees to attend Monthly Field Safety Trainings and monthly F10 video/quiz. Holds Assistant Supers, Foremen, and Subcontractors accountable.
- Project Engineers: Supports PM and Superintendent with SHE oversight.
- Assistant Superintendents / General Foreman / Foreman / Field Engineers: Conducts task risk assessments. Develops JHAs and PTPs. Trains crews.
- Lead Carpenters: Field safety leader within individual crews. Supports JHA/PTP development.
- All Okland Workers: Maintains positive safety attitude. Leads by example. Inspects work area, PPE, tools before use. Reviews JHA daily. Attends all trainings and toolbox safety meetings.
- Crane Superintendent: Crane/hoisting/rigging technical expert. Reviews lift plans. Approves critical lifts.
- HR: Evaluates safety culture fit in hiring. Maintains disciplinary action program.
- Regional Safety and Health Directors: Provide technical SHE expertise. Develop corporate SHE systems.
- Safety and Health Managers (Rovers): Roving safety and risk technical expertise to project teams.

SOURCE 2: SUBCONTRACTOR SPECIFIC MANUAL (100 pages) — for trade partners on Okland jobsites

GENERAL:
- Stop Work Authority: every worker can stop unsafe work, notify supervisor immediately
- No one under 18 on project
- English-proficient competent supervisor on site at all times
- Subcontractors not allowed on site without Okland supervisor present
- Tobacco only in designated areas. No audio devices in work areas. Cell phones only in designated areas.

LONE WORKER — cannot work alone when:
- Using Personal Fall Arrest System (PFAS)
- In trench 4 feet or deeper
- Conducting live electrical work
- Using a respirator
- Conducting demolition work

PPE REQUIRED 100% OF THE TIME:
- Hard hat (ANSI Z89.1) with worker name and employer on front. No bump caps or cowboy hats.
- Safety glasses (ANSI Z87.1 with side shields). No dark lenses indoors.
- Over-ankle work boots (no sport shoes).
- Full-length pants (no sweatpants). Shirt with sleeves.
- High-visibility shirt/vest/jacket (orange, fluorescent yellow, or fluorescent green) as outermost layer.
- Green hard hats ONLY for Qualified Riggers actively rigging.
- Face shields required when using grinders, chop-saws, or concrete chipping tools.
- Knee pads required when kneeling.

FALL PROTECTION:
- Required at 6 feet or more (4 feet for Baker scaffolds)
- Guardrail is primary method. PFAS used only if guardrail is not feasible.
- 100% tie-off required beyond leading edge guardrail.
- Fall rescue plan required before assigning PFAS work.
- All falls must be immediately reported to Okland Safety Department.

HOT WORK (welding, cutting, grinding, chop-saw use, etc.):
- Written Hot Work Permit required daily from Okland Superintendent before any hot work
- Supervisor inspects 35-foot radial sphere around work area, removes all fire hazards
- Fire watch required with no other duties for 30 minutes after hot work stops
- Permits valid one day only

ELECTRICAL / LOTO:
- GFCI required on all extension cords and power tools
- Each worker exposed to hazardous energy needs their own personal lock and tag
- All wiring treated as energized until confirmed otherwise
- Extension cords must be 12 AWG minimum, 3-wire grounded type

SCAFFOLDS:
- Scaffolds over 24 feet platform height: Stationary Supported Scaffold Erection Permit required
- Inspected by competent person before each shift, documented on scaffold tag
- Green tag = safe. Yellow tag = caution, specific controls required. Red tag = do not use. No tag = treat as Red.
- Platforms minimum 18 inches wide. Fully planked required.

EXCAVATIONS AND SOIL DISTURBANCE:
- ANY soil disturbance requires Soil Disturbance Permit daily
- Trenches 4 feet or deeper: Over 4-foot Excavation and Trench Access Permit required
- Hand dig zone: 2 feet each side of any utility
- Never work alone in trench deeper than 6 feet

CONFINED SPACES:
- Written confined space entry procedure required
- Atmospheric testing required before entry
- One dedicated attendant (hole watch) with no other duties at all times

WIND:
- 20 MPH: Evaluate and consider suspending exterior elevated work
- 30 MPH: Suspend ALL elevated work (cranes, aerial lifts, scaffolds, ladder work, roofs)
- 40 MPH: Suspend ALL outdoor activities

LIGHTNING:
- Within 10 miles: Suspend all exterior elevated work
- Within 5 miles: Suspend ALL outdoor activities
- Wait 30 minutes after last detected strike before resuming

CRANES:
- Operators must be NCCCO certified
- Lift plan submitted 14 days before lift
- Qualified Rigger and Qualified Signal Person required for all crane operations
- Critical lift thresholds: 90% capacity for mobile cranes, 95% for tower cranes

BARRICADE TAPE:
- RED DANGER: immediately dangerous, do not cross without training, PPE, and permission
- YELLOW CAUTION: potential hazard, may cross with PPE and awareness
- BLUE CARE: protect finished surfaces only, not a safety barricade

DRUG TESTING:
- Required per Okland Substance Abuse Program
- Rapid test results must go to lab for final confirmation

SOURCE 3: OSHA 29 CFR 1926 — federal construction safety standards
All Okland requirements meet or exceed OSHA 1926. Reference relevant subparts when asked about specific standards (Subpart M = fall protection, Subpart L = scaffolds, Subpart P = excavations, Subpart AA = confined spaces, Subpart CC = cranes, Subpart K = electrical).

Always cite sources clearly. Use bullet points for lists. Be practical and direct. Recommend consulting the Okland Safety Manager for site-specific or complex situations.`;

const SUGGESTIONS = [
  "What PPE is required on site?",
  "When is fall protection required?",
  "Who handles crane safety at Okland?",
  "How do I get a hot work permit?",
  "What are confined space rules?",
  "Wind speed work restrictions?",
];

function SourceTag({ label }) {
  const styles = {
    "Okland Specific Manual": { background: "#FFF8CC", color: "#7a5f00", border: "0.5px solid #E0C000" },
    "Subcontractor Specific Manual": { background: "#EBF0FB", color: "#1a3c8f", border: "0.5px solid #7a9cd4" },
    "OSHA 29 CFR 1926": { background: "#EAF3DE", color: "#2d5a14", border: "0.5px solid #639922" },
  };
  const s = styles[label] || { background: "#f0f0f0", color: "#555", border: "0.5px solid #ccc" };
  return React.createElement("span", {
    style: { ...s, fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 500, whiteSpace: "nowrap", display: "inline-block" }
  }, label);
}

function detectSources(text) {
  const t = text.toLowerCase();
  const srcs = new Set();
  if (t.includes("okland specific") || t.includes("responsibility matrix") || t.includes("project superintendent") || t.includes("f10") || t.includes("scorecard")) srcs.add("Okland Specific Manual");
  if (t.includes("subcontractor") || t.includes("hot work") || t.includes("soil disturbance") || t.includes("barricade") || t.includes("confined space") || t.includes("excavat") || t.includes("scaffold") || t.includes("fall protection") || t.includes("ppe") || t.includes("lone worker")) srcs.add("Subcontractor Specific Manual");
  if (t.includes("osha") || t.includes("29 cfr") || t.includes("1926") || t.includes("subpart")) srcs.add("OSHA 29 CFR 1926");
  if (srcs.size === 0) srcs.add("Subcontractor Specific Manual");
  return [...srcs];
}

function App() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "Hi! I'm the Okland Safety Assistant. Ask me anything about jobsite safety — I'll answer using Okland's manuals and OSHA standards.",
    sources: ["Okland Specific Manual", "Subcontractor Specific Manual", "OSHA 29 CFR 1926"],
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const history = useRef([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    if (!text.trim() || loading) return;
    setShowSuggestions(false);
    setInput("");
    setMessages(m => [...m, { role: "user", text }]);
    history.current = [...history.current, { role: "user", content: text }];
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history.current,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I could not generate a response. Please try again or consult your Okland Safety Manager.";
      history.current = [...history.current, { role: "assistant", content: reply }];
      setMessages(m => [...m, { role: "assistant", text: reply, sources: detectSources(reply) }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", text: "Connection error. Please check your internet and try again.", sources: [] }]);
    }
    setLoading(false);
  }

  return React.createElement("div", {
    style: { display: "flex", flexDirection: "column", height: "90vh", maxHeight: 700, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }
  },
    // Header
    React.createElement("div", { style: { background: "#1a1a1a", padding: "13px 18px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 } },
      React.createElement("div", { style: { width: 34, height: 34, background: "#F5C400", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, color: "#1a1a1a", flexShrink: 0 } }, "O"),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { color: "#fff", fontWeight: 500, fontSize: 15 } }, "Okland Safety Assistant"),
        React.createElement("div", { style: { display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" } },
          ["Okland Specific Manual", "Subcontractor Specific Manual", "OSHA 29 CFR 1926"].map(s =>
            React.createElement(SourceTag, { key: s, label: s })
          )
        )
      ),
      React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "#22c55e" } })
    ),

    // Messages
    React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, background: "#f9f9f9" } },
      messages.map((msg, i) =>
        React.createElement("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "88%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" } },
          React.createElement("div", { style: { width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, marginTop: 2, background: msg.role === "user" ? "#F5C400" : "#1a1a1a", color: msg.role === "user" ? "#1a1a1a" : "#F5C400" } },
            msg.role === "user" ? "ME" : "O"
          ),
          React.createElement("div", null,
            React.createElement("div", {
              style: { padding: "10px 14px", fontSize: 13.5, lineHeight: 1.65, wordBreak: "break-word", background: msg.role === "user" ? "#F5C400" : "#fff", color: "#1a1a1a", border: msg.role === "user" ? "none" : "1px solid #e8e8e8", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", whiteSpace: "pre-wrap" }
            }, msg.text),
            msg.role === "assistant" && msg.sources?.length > 0 &&
              React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 } },
                msg.sources.map(s => React.createElement(SourceTag, { key: s, label: s }))
              )
          )
        )
      ),
      loading && React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" } },
        React.createElement("div", { style: { width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, background: "#1a1a1a", color: "#F5C400" } }, "O"),
        React.createElement("div", { style: { padding: "10px 16px", background: "#fff", border: "1px solid #e8e8e8", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 5, alignItems: "center" } },
          [0, 0.2, 0.4].map((d, i) =>
            React.createElement("div", { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: "#999", animation: `pulse 1.2s ${d}s infinite` } })
          )
        )
      ),
      React.createElement("div", { ref: bottomRef })
    ),

    // Suggestions
    showSuggestions && React.createElement("div", { style: { padding: "8px 16px", display: "flex", gap: 6, flexWrap: "wrap", background: "#fff", borderTop: "1px solid #f0f0f0" } },
      SUGGESTIONS.map(s =>
        React.createElement("button", { key: s, onClick: () => send(s), style: { background: "#f5f5f5", border: "1px solid #e0e0e0", borderRadius: 16, padding: "5px 11px", fontSize: 11.5, color: "#555", cursor: "pointer", whiteSpace: "nowrap" } }, s)
      )
    ),

    // Input
    React.createElement("div", { style: { padding: "10px 14px", borderTop: "1px solid #e8e8e8", display: "flex", gap: 8, alignItems: "center", background: "#fff" } },
      React.createElement("textarea", {
        value: input,
        onChange: e => setInput(e.target.value),
        onKeyDown: e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } },
        placeholder: "Ask a safety question...",
        rows: 1,
        style: { flex: 1, padding: "9px 13px", border: "1px solid #ddd", borderRadius: 18, fontSize: 13.5, background: "#f9f9f9", color: "#1a1a1a", fontFamily: "inherit", outline: "none", resize: "none", maxHeight: 72 }
      }),
      React.createElement("button", {
        onClick: () => send(input),
        disabled: loading || !input.trim(),
        style: { width: 36, height: 36, borderRadius: "50%", background: loading || !input.trim() ? "#ddd" : "#F5C400", border: "none", cursor: loading || !input.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }
      }, "↑")
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
