import { useState } from "react";

const FIELDS = [
  { key: "pregnancies", label: "Pregnancies", min: 0, max: 20, step: 1, unit: "times", desc: "Number of times pregnant" },
  { key: "glucose", label: "Glucose", min: 0, max: 300, step: 1, unit: "mg/dL", desc: "Plasma glucose concentration (2hr oral glucose tolerance test)" },
  { key: "bloodPressure", label: "Blood Pressure", min: 0, max: 150, step: 1, unit: "mm Hg", desc: "Diastolic blood pressure" },
  { key: "skinThickness", label: "Skin Thickness", min: 0, max: 100, step: 1, unit: "mm", desc: "Triceps skin fold thickness" },
  { key: "insulin", label: "Insulin", min: 0, max: 900, step: 1, unit: "Î¼U/mL", desc: "2-Hour serum insulin" },
  { key: "bmi", label: "BMI", min: 0, max: 70, step: 0.1, unit: "kg/mÂ²", desc: "Body mass index" },
  { key: "dpf", label: "Diabetes Pedigree", min: 0, max: 3, step: 0.001, unit: "score", desc: "Diabetes pedigree function (genetic risk score)" },
  { key: "age", label: "Age", min: 1, max: 120, step: 1, unit: "years", desc: "Age in years" },
];

const DEFAULT_VALUES = {
  pregnancies: 2,
  glucose: 120,
  bloodPressure: 72,
  skinThickness: 25,
  insulin: 80,
  bmi: 28.5,
  dpf: 0.45,
  age: 35,
};

export default function App() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleChange = (key, val) => {
    setValues((v) => ({ ...v, [key]: parseFloat(val) }));
    setResult(null);
  };

  const predict = async () => {
    setLoading(true);
    setResult(null);
    try {
      const prompt = `You are a diabetes prediction model trained on the Pima Indians Diabetes Dataset using Logistic Regression. Analyze the following patient data and predict whether the patient is diabetic or not.

Patient Data:
- Pregnancies: ${values.pregnancies}
- Plasma Glucose (mg/dL): ${values.glucose}
- Diastolic Blood Pressure (mm Hg): ${values.bloodPressure}
- Skin Thickness (mm): ${values.skinThickness}
- Insulin (Î¼U/mL): ${values.insulin}
- BMI (kg/mÂ²): ${values.bmi}
- Diabetes Pedigree Function: ${values.dpf}
- Age: ${values.age}

Respond ONLY in this JSON format (no extra text):
{
  "prediction": "Diabetic" or "Non-Diabetic",
  "confidence": a number between 60 and 99 (integer),
  "risk_level": "Low", "Moderate", or "High",
  "key_factors": [list of 2-3 most influential factors as short strings],
  "recommendation": "A single concise clinical recommendation sentence."
}`;

const res = await fetch("/api/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt }),
});
const data = await res.json();
const clean = data.text.replace(/```json|```/g, "").trim();
setResult(JSON.parse(clean));
    } catch (e) {
      setResult({ error: "Prediction failed. Please try again." });
    }
    setLoading(false);
  };

  const riskColor = result?.risk_level === "High" ? "#ff4d4d" : result?.risk_level === "Moderate" ? "#ffaa00" : "#00d97e";
  const isDiabetic = result?.prediction === "Diabetic";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0e1a",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e8eaf0",
      padding: "0",
      overflowX: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Glow orb */}
      <div style={{
        position: "fixed", top: "-200px", right: "-200px",
        width: "600px", height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,217,126,0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "960px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "8px",
              background: "linear-gradient(135deg, #00d97e, #00a8ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
            }}>ðŸ©º</div>
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "3px", color: "#00d97e", textTransform: "uppercase" }}>
              ML Health Analytics
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 800,
            margin: "0 0 12px",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #ffffff 40%, #00d97e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Diabetes<br />Prediction Model
          </h1>
          <p style={{ color: "#7b8196", fontSize: "15px", maxWidth: "520px", lineHeight: 1.7, margin: 0 }}>
            Logistic Regression model trained on the Pima Indians Diabetes Dataset.
            Enter patient vitals below for an AI-powered risk assessment.
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
            {["Logistic Regression", "Scikit-Learn", "Pandas", "NumPy"].map(t => (
              <span key={t} style={{
                padding: "4px 12px", borderRadius: "100px",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "12px", color: "#7b8196",
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Input grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}>
          {FIELDS.map((f) => {
            const pct = ((values[f.key] - f.min) / (f.max - f.min)) * 100;
            const isActive = activeField === f.key;
            return (
              <div key={f.key}
                onMouseEnter={() => setActiveField(f.key)}
                onMouseLeave={() => setActiveField(null)}
                style={{
                  background: isActive ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isActive ? "rgba(0,217,126,0.3)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "16px",
                  padding: "20px",
                  transition: "all 0.2s ease",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: isActive ? "#fff" : "#a0a8b8", letterSpacing: "0.5px" }}>
                    {f.label}
                  </label>
                  <span style={{
                    fontSize: "18px", fontWeight: 600,
                    color: isActive ? "#00d97e" : "#e8eaf0",
                    fontFamily: "'Syne', monospace",
                  }}>
                    {f.key === "bmi" ? values[f.key].toFixed(1) : f.key === "dpf" ? values[f.key].toFixed(3) : values[f.key]}
                    <span style={{ fontSize: "11px", color: "#7b8196", marginLeft: "4px", fontFamily: "'DM Sans'" }}>{f.unit}</span>
                  </span>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#555e73", lineHeight: 1.5 }}>{f.desc}</p>
                <div style={{ position: "relative" }}>
                  <div style={{
                    height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px",
                    marginBottom: "8px", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", width: `${pct}%`,
                      background: "linear-gradient(90deg, #00d97e, #00a8ff)",
                      borderRadius: "2px", transition: "width 0.15s",
                    }} />
                  </div>
                  <input
                    type="range"
                    min={f.min} max={f.max} step={f.step}
                    value={values[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    style={{
                      width: "100%", appearance: "none", height: "0",
                      position: "absolute", top: "-9px", cursor: "pointer",
                      background: "transparent",
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "10px", color: "#444d5e" }}>{f.min}</span>
                  <span style={{ fontSize: "10px", color: "#444d5e" }}>{f.max}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Predict button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
          <button
            onClick={predict}
            disabled={loading}
            style={{
              padding: "16px 56px",
              borderRadius: "100px",
              border: "none",
              background: loading ? "rgba(0,217,126,0.2)" : "linear-gradient(135deg, #00d97e, #00a8ff)",
              color: loading ? "#00d97e" : "#0a0e1a",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "1px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 40px rgba(0,217,126,0.3)",
              transition: "all 0.3s ease",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
            {loading ? (
              <>
                <span style={{
                  display: "inline-block", width: "16px", height: "16px",
                  border: "2px solid #00d97e", borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                ANALYZING...
              </>
            ) : "RUN PREDICTION"}
          </button>
        </div>

        {/* Result */}
        {result && !result.error && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${isDiabetic ? "rgba(255,77,77,0.3)" : "rgba(0,217,126,0.3)"}`,
            borderRadius: "24px",
            padding: "32px",
            animation: "fadeIn 0.4s ease",
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start", marginBottom: "28px" }}>
              <div style={{ flex: "1", minWidth: "200px" }}>
                <p style={{ margin: "0 0 6px", fontSize: "11px", letterSpacing: "2px", color: "#7b8196", textTransform: "uppercase" }}>Prediction</p>
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: isDiabetic ? "rgba(255,77,77,0.15)" : "rgba(0,217,126,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px",
                  }}>
                    {isDiabetic ? "âš ï¸" : "âœ…"}
                  </div>
                  <div>
                    <p style={{
                      margin: 0, fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800,
                      color: isDiabetic ? "#ff4d4d" : "#00d97e",
                    }}>{result.prediction}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#7b8196" }}>Confidence: {result.confidence}%</p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "16px 20px",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#7b8196", letterSpacing: "1px" }}>RISK LEVEL</p>
                  <p style={{ margin: 0, fontFamily: "'Syne'", fontSize: "20px", fontWeight: 700, color: riskColor }}>
                    {result.risk_level}
                  </p>
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "16px 20px",
                  border: "1px solid rgba(255,255,255,0.07)", minWidth: "140px",
                }}>
                  <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#7b8196", letterSpacing: "1px" }}>KEY FACTORS</p>
                  {result.key_factors?.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#00a8ff" }} />
                      <p style={{ margin: 0, fontSize: "12px", color: "#c0c8d8" }}>{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              background: isDiabetic ? "rgba(255,77,77,0.07)" : "rgba(0,217,126,0.07)",
              borderRadius: "12px", padding: "16px 20px",
              borderLeft: `3px solid ${isDiabetic ? "#ff4d4d" : "#00d97e"}`,
            }}>
              <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#7b8196", letterSpacing: "1px" }}>CLINICAL RECOMMENDATION</p>
              <p style={{ margin: 0, fontSize: "14px", color: "#c0c8d8", lineHeight: 1.7 }}>{result.recommendation}</p>
            </div>

            <p style={{ margin: "20px 0 0", fontSize: "11px", color: "#444d5e", textAlign: "center" }}>
              âš ï¸ This is a demonstration model for educational purposes only. Not a substitute for professional medical advice.
            </p>
          </div>
        )}

        {result?.error && (
          <div style={{
            background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.2)",
            borderRadius: "12px", padding: "20px", textAlign: "center", color: "#ff6b6b",
          }}>
            {result.error}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#444d5e" }}>
            Built with Python Â· Scikit-Learn Â· Logistic Regression
          </p>
          <a href="https://github.com/lakshita56/diabetesPrediction" target="_blank" rel="noreferrer"
            style={{ fontSize: "12px", color: "#00d97e", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
            âŸ¢ View on GitHub
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #00d97e;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0,217,126,0.5);
        }
        input[type=range]::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #00d97e;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
