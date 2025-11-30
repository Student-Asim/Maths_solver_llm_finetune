import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const runInference = async () => {
    setLoading(true);
    setOutput("");
    let resultText = "";

    try {
      const res = await fetch("http://127.0.0.1:8000/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      resultText = data.answer;
    } catch (e) {
      resultText = e.message || "request failed";
    }

    setOutput(resultText);
    setHistory((h) => [{ q: input, a: resultText }, ...h].slice(0, 5));
    setLoading(false);
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        minHeight: "100vh",
        backgroundImage:
          "url('https://wallup.net/wp-content/uploads/2019/09/903504-physics-equation-mathematics-math-formula-poster-science-text-typography.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",

        
      }}
    >
      {/* Header container: Title + Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "rgba(0, 119, 182, 0.8)",
        }}
      >
        <h1 style={{ margin: 0, color:"white" }}>Math Solver</h1>
        <nav style={{ display: "flex", gap: 20 }}>
          <a href="#" style={{ color: "white", textDecoration: "none", gap:5 }}>
            Home
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none", gap:5}}>
            About
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none", gap:5 }}>
            Docs
          </a>
        </nav>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 20 }}>
          {/* Sidebar */}
          <aside
            style={{
              width: 300,
              background: "rgba(255, 255, 255, 0.9)",
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 4,
              height: "80vh",
              overflowY: "auto",
              color: "black",
            }}
          >
            <h3>Recent Questions</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {history.map((h, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      borderRadius: 4,
                      background: "skyblue",
                      marginBottom: 5,
                      cursor: "pointer",
                    }}
                  >
                    <strong>Q:</strong> {h.q}
                  </div>
                  <div
                    style={{
                      border: "1px solid #eee",
                      padding: 6,
                      borderRadius: 4,
                      background: "#7b7b83ff",
                    }}
                  >
                    Ans= {h.a}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1 }}>
            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter math question..."
              style={{ width: "100%", padding: 8 }}
            />

            <div style={{ marginTop: 10 }}>
              <button onClick={runInference} disabled={loading}>
                {loading ? "Running..." : "Run"}
              </button>
              <button
                onClick={() => {
                  setInput("");
                  setOutput("");
                }}
                style={{ marginLeft: 10 }}
              >
                Clear
              </button>
            </div>

            <pre
              style={{
                background: "White",
                padding: 10,
                marginTop: 10,
                minHeight: 100,
                color: "black",
              }}
            >
              {output}
            </pre>
          </main>
        </div>
      </div>
    </div>
  );
}
