import { useState, useEffect } from "react";
import { fetchLiveElectionData, broadcastElectionData, submitVoteLive } from "./services/electionSync";

const LOGO = "data:image/png;base64,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";


const initialCandidates = [
  {
    number: 1,
    name: "แผนกช่างกลโรงงาน",
    slogan: "สร้างงาน สร้างอาชีพ พัฒนาฝีมือ",
    color: "#16A34A",
    accent: "#DCFCE7",
    textOnColor: "white",
    policy: [
      "จัดอบรมทักษะงานช่างและเทคโนโลยีใหม่",
      "สนับสนุนการแข่งขันทักษะวิชาชีพ",
      "พัฒนาอุปกรณ์และสื่อการเรียนรู้ให้ทันสมัย",
      "สร้างโอกาสฝึกประสบการณ์ร่วมกับสถานประกอบการ",
    ],
    emoji: "⚙️",
  },
  {
    number: 2,
    name: "แผนกช่างยนต์",
    slogan: "พลังช่างยนต์ พร้อมพัฒนา",
    color: "#6B7280",
    accent: "#F3F4F6",
    textOnColor: "white",
    policy: [
      "จัดกิจกรรมเสริมทักษะงานซ่อมและบำรุงรักษา",
      "ส่งเสริมการเรียนรู้เทคโนโลยียานยนต์สมัยใหม่",
      "จัดโครงการบริการตรวจเช็กยานพาหนะเพื่อสังคม",
      "สร้างความสามัคคีและการทำงานเป็นทีม",
    ],
    emoji: "🔧",
  },
  {
    number: 3,
    name: "แผนกช่างไฟฟ้า",
    slogan: "ไฟฟ้าก้าวหน้า พัฒนาทุกด้าน",
    color: "#CA8A04",
    accent: "#FEF9C3",
    textOnColor: "white",
    policy: [
      "ส่งเสริมความรู้ด้านไฟฟ้าและพลังงานทดแทน",
      "จัดกิจกรรมจิตอาสาด้านงานไฟฟ้าในชุมชน",
      "พัฒนาทักษะความปลอดภัยในการทำงาน",
      "สนับสนุนการแข่งขันและการสร้างนวัตกรรม",
    ],
    emoji: "⚡",
  },
  {
    number: 4,
    name: "แผนกคอมพิวเตอร์ธุรกิจ",
    slogan: "คิดทันสมัย ก้าวไกลด้วยเทคโนโลยี",
    color: "#DB2777",
    accent: "#FCE7F3",
    textOnColor: "white",
    policy: [
      "พัฒนาทักษะดิจิทัลและการใช้ AI เพื่อการเรียน",
      "จัดอบรมโปรแกรมและเทคโนโลยีที่จำเป็นต่ออาชีพ",
      "เพิ่มช่องทางประชาสัมพันธ์กิจกรรมผ่านสื่อออนไลน์",
      "สร้างสรรค์กิจกรรมที่ตอบโจทย์คนรุ่นใหม่และทุกแผนกวิชา",
    ],
    emoji: "💻",
  },
];

const ORG_NAME = "องค์การนักวิชาชีพในอนาคตแห่งประเทศไทย";
const SCHOOL_NAME = "วิทยาลัยเทคโนโลยีดอนบอสโกสุราษฎร์";

export default function ElectionApp() {
  const [step, setStep] = useState<string>("login"); // login | home | vote | confirm | result | admin
  const [year, setYear] = useState<string>(() => {
    const saved = localStorage.getItem("election_year");
    return saved || "ปีการศึกษา 2570";
  });
  const [selected, setSelected] = useState<number | null>(null);
  
  const [candidateList, setCandidateList] = useState<any[]>(() => {
    const saved = localStorage.getItem("election_candidates");
    return saved ? JSON.parse(saved) : initialCandidates;
  });

  const [votes, setVotes] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem("election_votes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { 1: 0, 2: 0, 3: 0, 4: 0 };
  });

  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Sync with server/cloud in real-time
  const applyServerData = (data: any) => {
    if (!data) return;
    if (data.year) setYear(data.year);
    if (data.candidates && Array.isArray(data.candidates)) setCandidateList(data.candidates);
    if (data.votes && typeof data.votes === "object") setVotes(data.votes);
    if (data.votedStudentIds && Array.isArray(data.votedStudentIds)) {
      setVotedIds(data.votedStudentIds);
    }
  };

  const fetchServerData = async () => {
    try {
      const res = await fetchLiveElectionData();
      if (res.success && res.data) {
        applyServerData(res.data);
        setIsLiveConnected(true);
      } else {
        setIsLiveConnected(false);
      }
    } catch {
      setIsLiveConnected(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchServerData();

    // 1. Establish zero-latency Server-Sent Events (SSE) stream
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/election/stream");
      eventSource.onopen = () => {
        setIsLiveConnected(true);
      };
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          applyServerData(data);
          setIsLiveConnected(true);
        } catch (e) {
          console.error("Error parsing live stream data", e);
        }
      };
      eventSource.onerror = () => {
        // Fallback to polling if SSE is disconnected
        setIsLiveConnected(false);
      };
    } catch (err) {
      console.warn("SSE not supported, falling back to interval polling", err);
    }

    // 2. High-reliability Polling (1.5s interval)
    const interval = setInterval(fetchServerData, 1500);

    // 3. Instant sync on tab focus or screen unlock
    const handleFocusOrVisible = () => {
      fetchServerData();
    };
    window.addEventListener("focus", handleFocusOrVisible);
    document.addEventListener("visibilitychange", handleFocusOrVisible);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
      window.removeEventListener("focus", handleFocusOrVisible);
      document.removeEventListener("visibilitychange", handleFocusOrVisible);
    };
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem("election_year", year);
  }, [year]);

  useEffect(() => {
    localStorage.setItem("election_candidates", JSON.stringify(candidateList));
  }, [candidateList]);

  useEffect(() => {
    localStorage.setItem("election_votes", JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem("election_has_voted", hasVoted ? "true" : "false");
  }, [hasVoted]);

  // Login fields
  const [loginName, setLoginName] = useState<string>("");
  const [loginId, setLoginId] = useState<string>("");
  const [loginNameErr, setLoginNameErr] = useState<string>("");
  const [loginIdErr, setLoginIdErr] = useState<string>("");
  const [voterName, setVoterName] = useState<string>("");

  // Admin and candidate management states
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [adminErr, setAdminErr] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // State to create candidate
  const [newCamName, setNewCamName] = useState<string>("");
  const [newCamSlogan, setNewCamSlogan] = useState<string>("");
  const [newCamEmoji, setNewCamEmoji] = useState<string>("👤");
  const [newCamImage, setNewCamImage] = useState<string>("");
  const [newCamColor, setNewCamColor] = useState<string>("#16A34A");
  const [newCamPolicies, setNewCamPolicies] = useState<string>("");

  // States to edit candidate
  const [editingCandidateNum, setEditingCandidateNum] = useState<number | null>(null);
  const [editCamName, setEditCamName] = useState<string>("");
  const [editCamSlogan, setEditCamSlogan] = useState<string>("");
  const [editCamEmoji, setEditCamEmoji] = useState<string>("👤");
  const [editCamImage, setEditCamImage] = useState<string>("");
  const [editCamColor, setEditCamColor] = useState<string>("#16A34A");
  const [editCamPolicies, setEditCamPolicies] = useState<string>("");

  const totalVotes = candidateList.reduce((sum, c) => sum + (votes[c.number] || 0), 0);
  
  const getWinnerCandidate = () => {
    let maxVotes = -1;
    let leader = candidateList[0] || initialCandidates[0];
    candidateList.forEach((c) => {
      const current = votes[c.number] || 0;
      if (current > maxVotes) {
        maxVotes = current;
        leader = c;
      }
    });
    return leader;
  };

  const winnerCandidate = getWinnerCandidate();
  const winnerVotes = winnerCandidate ? (votes[winnerCandidate.number] || 0) : 0;

  const handleLogin = () => {
    let valid = true;
    if (!loginName.trim()) {
      setLoginNameErr("กรุณากรอกชื่อ-นามสกุล");
      valid = false;
    } else {
      setLoginNameErr("");
    }

    if (!loginId.trim()) {
      setLoginIdErr("กรุณากรอกรหัสนักเรียน");
      valid = false;
    } else if (!/^\d{5,10}$/.test(loginId.trim())) {
      setLoginIdErr("รหัสนักเรียนต้องเป็นตัวเลข 5–10 หลัก");
      valid = false;
    } else {
      setLoginIdErr("");
    }

    if (valid) {
      const cleanId = loginId.trim();
      localStorage.setItem("election_student_id", cleanId);
      setVoterName(loginName.trim());
      setStep("home");
    }
  };

  const handleNextVoter = () => {
    setLoginName("");
    setLoginId("");
    setLoginNameErr("");
    setLoginIdErr("");
    setVoterName("");
    setSelected(null);
    setHasVoted(false);
    setStep("login");
  };

  const confirmVote = async () => {
    if (selected !== null) {
      const candidateToVote = selected;
      const cleanId = loginId.trim() || localStorage.getItem("election_student_id") || `voter-${Date.now()}`;

      // Optimistic update
      setVotes((prev) => ({ ...prev, [candidateToVote]: (prev[candidateToVote] || 0) + 1 }));
      setHasVoted(true);
      setStep("result");

      try {
        const updated = await submitVoteLive(
          cleanId,
          voterName || loginName.trim(),
          candidateToVote,
          {
            year,
            candidates: candidateList,
            votes,
            votedStudentIds: votedIds,
            lastUpdated: Date.now(),
          }
        );
        if (updated) {
          setVotes(updated.votes);
          setVotedIds(updated.votedStudentIds);
          setIsLiveConnected(true);
        }
      } catch (err) {
        console.error("Failed to submit vote:", err);
      }
    }
  };

  const getPercent = (num: number) =>
    totalVotes === 0 ? 0 : Math.round(((votes[num] || 0) / totalVotes) * 100);

  const navTo = (s: string) => {
    setStep(s);
    if (s === "vote") {
      setSelected(null);
    }
  };

  // ── Shared header ──
  const Header = () => (
    <header style={{
      background: "#7B1C1C", color: "white",
      padding: "12px 20px", boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <img 
            src="https://i.postimg.cc/VNQ6dTcq/tra-xngkh-kar-him.png" 
            alt="อวท. Logo" 
            style={{ width: 42, height: 42, objectFit: "contain", flexShrink: 0 }} 
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, lineHeight: 1.3 }}>การเลือกตั้งนายก องค์การนักวิชาชีพในอนาคตแห่งประเทศไทย</div>
            <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 2, fontWeight: 500 }}>{SCHOOL_NAME} · {year}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {(step !== "login" || isAdmin) && (
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {[
                ["home", "หน้าแรก"],
                ["vote", "ลงคะแนน"],
                ["result", "ผลคะแนน"],
                ...(isAdmin ? [["admin", "ผู้ดูแลระบบ"]] : [])
              ].map(([s, label]) => (
                <button key={s} onClick={() => navTo(s)} style={{
                  padding: "6px 11px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12,
                  background: step === s ? "#F5C518" : "rgba(255,255,255,0.15)",
                  color: step === s ? "#7B1C1C" : "white",
                  fontFamily: "inherit", fontWeight: 700, transition: "background 0.2s",
                }}>{label}</button>
              ))}
            </div>
          )}

          {step !== "login" && (
            <button
              onClick={handleNextVoter}
              title="รีเซ็ตฟอร์มสำหรับผู้มีสิทธิ์คนถัดไปที่เครื่องกลาง"
              style={{
                padding: "6px 12px", borderRadius: 20, border: "1px solid rgba(254,240,138,0.6)",
                cursor: "pointer", fontSize: 12, background: "rgba(0,0,0,0.25)", color: "#FEF08A",
                fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 4,
                transition: "all 0.2s"
              }}
            >
              👥 ผู้ลงคะแนนคนถัดไป
            </button>
          )}
        </div>
      </div>
    </header>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Sarabun', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <Header />

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>

        {/* ── LOGIN ── */}
        {step === "login" && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: 460, width: "100%" }}>
              {/* Hero card */}
              <div style={{
                background: "linear-gradient(160deg, #7B1C1C 0%, #A52828 50%, #5C1010 100%)",
                borderRadius: 20, padding: "32px 24px", color: "white", textAlign: "center",
                marginBottom: 24, boxShadow: "0 8px 32px rgba(123,28,28,0.3)",
              }}>
                <img 
                  src="https://i.postimg.cc/VNQ6dTcq/tra-xngkh-kar-him.png" 
                  alt="อวท. Logo" 
                  style={{ width: 80, height: 80, objectFit: "contain", margin: "0 auto 16px", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))" }} 
                />

                <div style={{ fontSize: 14, opacity: 0.95, letterSpacing: 0.5, fontWeight: 700, marginBottom: 4 }}>
                  {SCHOOL_NAME}
                </div>
                <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>
                  การเลือกตั้งนายก
                </h1>
                <div style={{ fontSize: 13.5, fontWeight: 700, opacity: 0.95, marginBottom: 8, lineHeight: 1.4 }}>
                  {ORG_NAME}
                </div>
                <div style={{
                  display: "inline-block", background: "#F5C518", color: "#7B1C1C",
                  borderRadius: 20, padding: "3px 14px", fontSize: 12, fontWeight: 800,
                }}>{year}</div>
              </div>

              {!showAdminLogin ? (
                /* Login form */
                <div style={{
                  background: "white", borderRadius: 20, padding: "28px 24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                    🎓 ลงทะเบียนก่อนลงคะแนน
                  </h2>
                  <p style={{ margin: "0 0 22px", fontSize: 13, color: "#64748B" }}>
                    กรุณากรอกข้อมูลของคุณเพื่อยืนยันตัวตน
                  </p>

                  {/* Name */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                      ชื่อ-นามสกุล
                    </label>
                    <input
                      type="text" value={loginName}
                      onChange={(e) => { setLoginName(e.target.value); setLoginNameErr(""); }}
                      placeholder="เช่น นายสมชาย ใจดี"
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
                        border: `2px solid ${loginNameErr ? "#EF4444" : "#E2E8F0"}`,
                        background: loginNameErr ? "#FEF2F2" : "white",
                        fontSize: 15, fontFamily: "inherit", outline: "none",
                      }} />
                    {loginNameErr && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 5 }}>⚠️ {loginNameErr}</div>}
                  </div>

                  {/* Student ID */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                      รหัสนักเรียน / นักศึกษา
                    </label>
                    <input
                      type="text" value={loginId}
                      onChange={(e) => { setLoginId(e.target.value); setLoginIdErr(""); }}
                      placeholder="เช่น 12345"
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
                        border: `2px solid ${loginIdErr ? "#EF4444" : "#E2E8F0"}`,
                        background: loginIdErr ? "#FEF2F2" : "white",
                        fontSize: 15, fontFamily: "inherit", outline: "none",
                      }} />
                    {loginIdErr && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 5 }}>⚠️ {loginIdErr}</div>}
                  </div>

                  <button onClick={handleLogin} style={{
                    width: "100%", padding: "14px", borderRadius: 12, border: "none",
                    background: "#7B1C1C", color: "white", fontSize: 16, fontWeight: 800,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 4px 14px rgba(123,28,28,0.3)",
                  }}>
                    เข้าสู่ระบบเลือกตั้ง →
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("result")}
                    style={{
                      width: "100%", padding: "13px", borderRadius: 12,
                      border: "2px solid #7B1C1C", background: "white", color: "#7B1C1C",
                      fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                      marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "all 0.2s",
                    }}
                  >
                    📊 ดูผลคะแนนการเลือกตั้ง (Live Results)
                  </button>

                  <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 12, marginTop: 14, marginBottom: 0 }}>
                    ข้อมูลของคุณจะถูกเก็บเป็นความลับ และใช้เพื่อยืนยันสิทธิ์เท่านั้น
                  </p>

                  <div style={{ borderTop: "1px solid #E2E8F0", marginTop: 20, paddingTop: 16, textAlign: "center" }}>
                    <button
                      onClick={() => {
                        setShowAdminLogin(true);
                        setAdminUsername("");
                        setAdminPassword("");
                        setAdminErr("");
                      }}
                      style={{
                        background: "none", border: "none", color: "#7B1C1C", fontWeight: 700,
                        cursor: "pointer", fontSize: 13, textDecoration: "underline", fontFamily: "inherit"
                      }}
                    >
                      เข้าสู่ระบบสำหรับแอดมิน (Admin Login) →
                    </button>
                  </div>
                </div>
              ) : (
                /* Admin Login form */
                <div style={{
                  background: "white", borderRadius: 20, padding: "28px 24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800, color: "#1E293B" }}>
                    🔐 เข้าสู่ระบบผู้ดูแลระบบ (Admin)
                  </h2>
                  <p style={{ margin: "0 0 22px", fontSize: 13, color: "#64748B" }}>
                    กรุณากรอกชื่อผู้ใช้และรหัสผ่านเพื่อจัดการระบบ
                  </p>

                  {/* Admin Username */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                      ชื่อผู้ใช้ (Username)
                    </label>
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => { setAdminUsername(e.target.value); setAdminErr(""); }}
                      placeholder="ป้อนชื่อผู้ใช้"
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
                        border: `2px solid ${adminErr ? "#EF4444" : "#E2E8F0"}`,
                        background: adminErr ? "#FEF2F2" : "white",
                        fontSize: 15, fontFamily: "inherit", outline: "none",
                      }}
                    />
                  </div>

                  {/* Admin Password */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                      รหัสผ่าน (Password)
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => { setAdminPassword(e.target.value); setAdminErr(""); }}
                      placeholder="ป้อนรหัสผ่าน"
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
                        border: `2px solid ${adminErr ? "#EF4444" : "#E2E8F0"}`,
                        background: adminErr ? "#FEF2F2" : "white",
                        fontSize: 15, fontFamily: "inherit", outline: "none",
                      }}
                    />
                    {adminErr && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 5 }}>⚠️ {adminErr}</div>}
                  </div>

                  <button
                    onClick={() => {
                      if (adminUsername.trim() === "admin1234" && adminPassword === "admin1234") {
                        setIsAdmin(true);
                        setStep("admin");
                        setAdminErr("");
                      } else {
                        setAdminErr("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (สิทธิ์ผู้ดูแลระบบจำเป็นต้องใช้ admin1234)");
                      }
                    }}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 12, border: "none",
                      background: "#7B1C1C", color: "white", fontSize: 16, fontWeight: 800,
                      cursor: "pointer", fontFamily: "inherit",
                      boxShadow: "0 4px 14px rgba(123,28,28,0.3)", marginBottom: 12
                    }}
                  >
                    เข้าสู่ระบบแอดมิน →
                  </button>

                  <button
                    onClick={() => {
                      setShowAdminLogin(false);
                      setAdminErr("");
                    }}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #E2E8F0",
                      background: "white", color: "#374151", fontSize: 14, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    ← กลับไปหน้าลงทะเบียนผู้เรียน
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── HOME ── */}
        {step === "home" && (
          <div>
            {/* Hero */}
            <div style={{
              background: "linear-gradient(160deg, #7B1C1C 0%, #A52828 50%, #5C1010 100%)",
              borderRadius: 20, padding: "28px 24px", color: "white", marginBottom: 24,
              boxShadow: "0 8px 32px rgba(123,28,28,0.3)", textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -30, left: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(245,197,24,0.07)" }} />

              <img 
                src="https://i.postimg.cc/VNQ6dTcq/tra-xngkh-kar-him.png" 
                alt="อวท. Logo" 
                style={{ width: 72, height: 72, objectFit: "contain", margin: "0 auto 12px", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.2))" }} 
              />

              <div style={{ fontSize: 14, opacity: 0.95, letterSpacing: 0.5, fontWeight: 700, marginBottom: 4 }}>{SCHOOL_NAME}</div>
              <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>
                การเลือกตั้งนายก
              </h1>
              <div style={{ fontSize: 13.5, fontWeight: 700, opacity: 0.95, marginBottom: 8, lineHeight: 1.4 }}>
                {ORG_NAME}
              </div>
              <div style={{
                display: "inline-block", background: "#F5C518", color: "#7B1C1C",
                borderRadius: 20, padding: "2px 14px", fontSize: 12, fontWeight: 800, marginBottom: 18,
              }}>{year}</div>
              {voterName && (
                <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                  <span>ยินดีต้อนรับ, <strong>{voterName}</strong> 👋</span>
                  <button
                    onClick={handleNextVoter}
                    style={{
                      background: "rgba(255,255,255,0.2)", border: "none", color: "white",
                      borderRadius: 12, padding: "2px 8px", fontSize: 11, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit"
                    }}
                  >
                    (เปลี่ยนผู้ลงคะแนน)
                  </button>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => navTo("vote")} style={{
                  background: "#F5C518", color: "#7B1C1C", border: "none",
                  borderRadius: 12, padding: "11px 32px", fontSize: 15, fontWeight: 800,
                  cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(245,197,24,0.4)",
                }}>
                  🗳️ เริ่มลงคะแนนเสียง
                </button>
                <button onClick={handleNextVoter} style={{
                  background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 12, padding: "11px 20px", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit"
                }}>
                  👥 ผู้มีสิทธิ์คนถัดไป
                </button>
              </div>
            </div>

            <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: "#0F172A" }}>ผู้สมัครทั้งหมด</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {candidateList.map((c) => (
                <div key={c.number}
                  style={{
                    background: "white", borderRadius: 16, padding: "16px 18px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    border: `2px solid ${expandedCard === c.number ? c.color : "transparent"}`,
                    cursor: "pointer", transition: "border-color 0.2s",
                  }}
                  onClick={() => setExpandedCard(expandedCard === c.number ? null : c.number)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 12, background: c.accent,
                      border: `2px solid ${c.color}33`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26, flexShrink: 0, overflow: "hidden"
                    }}>
                      {c.image ? (
                        <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        c.emoji
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{
                          background: c.color, color: c.textOnColor,
                          borderRadius: 8, padding: "2px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0,
                        }}>เบอร์ {c.number}</span>
                        <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{c.name}</span>
                      </div>
                      <div style={{ color: c.color, fontSize: 12, fontWeight: 600, marginTop: 3 }}>"{c.slogan}"</div>
                    </div>
                    <div style={{ color: "#9CA3AF", fontSize: 15, flexShrink: 0 }}>
                      {expandedCard === c.number ? "▲" : "▼"}
                    </div>
                  </div>
                  {expandedCard === c.number && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.accent}` }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#374151", marginBottom: 8 }}>📋 นโยบายหลัก</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {c.policy.map((p, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "#374151" }}>
                            <span style={{
                              width: 22, height: 22, borderRadius: "50%", background: c.color,
                              color: c.textOnColor, display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1,
                            }}>{i + 1}</span>
                            <span style={{ lineHeight: 1.4 }}>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── VOTE ── */}
        {step === "vote" && (
          <div>
            {hasVoted ? (
              <div style={{
                background: "white", borderRadius: 20, padding: "36px 24px", textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)", maxWidth: 480, margin: "0 auto",
              }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
                <h2 style={{ color: "#16A34A", margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>บันทึกคะแนนของคุณเรียบร้อยแล้ว</h2>
                <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 24px" }}>ขอบคุณที่มีส่วนร่วมในการเลือกตั้งนายก อวท.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={handleNextVoter} style={{
                    width: "100%", padding: "14px", borderRadius: 12, border: "none",
                    background: "#7B1C1C", color: "white", fontSize: 16, fontWeight: 800,
                    cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(123,28,28,0.3)"
                  }}>
                    👥 ผู้ลงคะแนนคนถัดไป (เริ่มลงทะเบียนคนใหม่) →
                  </button>

                  <button onClick={() => { setHasVoted(false); setSelected(null); }} style={{
                    width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #E2E8F0",
                    background: "white", color: "#374151", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit"
                  }}>
                    🗳️ ลงคะแนนเสียงอีกครั้ง
                  </button>

                  <button onClick={() => navTo("result")} style={{
                    width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #E2E8F0",
                    background: "#F8FAFC", color: "#64748B", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit"
                  }}>
                    📊 ดูผลคะแนนสด
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Voter greeting */}
                {voterName && (
                  <div style={{
                    background: "linear-gradient(135deg, #7B1C1C, #A52828)",
                    borderRadius: 14, padding: "12px 18px", marginBottom: 18,
                    display: "flex", alignItems: "center", gap: 12,
                    boxShadow: "0 2px 10px rgba(123,28,28,0.2)",
                  }}>

                    <div>
                      <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{voterName}</div>
                      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>กรุณาเลือกผู้สมัครเพียง 1 หมายเลข</div>
                    </div>
                  </div>
                )}

                <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: "#0F172A" }}>
                  เลือกผู้สมัครที่ต้องการ
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {candidateList.map((c) => (
                    <div key={c.number}
                      onClick={() => setSelected(selected === c.number ? null : c.number)}
                      style={{
                        background: selected === c.number ? c.accent : "white",
                        border: `2px solid ${selected === c.number ? c.color : "#E2E8F0"}`,
                        borderRadius: 16, padding: "15px 18px", cursor: "pointer",
                        transition: "all 0.18s",
                        boxShadow: selected === c.number ? `0 4px 16px ${c.color}33` : "0 1px 4px rgba(0,0,0,0.05)",
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                          background: selected === c.number ? c.color : c.accent,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 24, transition: "background 0.18s", overflow: "hidden",
                        }}>
                          {c.image ? (
                            <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            c.emoji
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{
                              background: c.color, color: c.textOnColor,
                              borderRadius: 7, padding: "2px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0,
                            }}>เบอร์ {c.number}</span>
                            <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{c.name}</span>
                          </div>
                          <div style={{ color: c.color, fontSize: 12, fontWeight: 600, marginTop: 3 }}>"{c.slogan}"</div>
                          {/* Policy preview */}
                          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                            {c.policy.map((p, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "#6B7280" }}>
                                <span style={{
                                  width: 16, height: 16, borderRadius: "50%",
                                  background: selected === c.number ? c.color : "#E5E7EB",
                                  color: selected === c.number ? "white" : "#9CA3AF",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 9, fontWeight: 700, flexShrink: 0, marginTop: 1,
                                }}>{i + 1}</span>
                                <span style={{ lineHeight: 1.4 }}>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                          border: `2px solid ${selected === c.number ? c.color : "#CBD5E1"}`,
                          background: selected === c.number ? c.color : "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          alignSelf: "flex-start", marginTop: 2,
                        }}>
                          {selected === c.number && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => selected && setStep("confirm")} disabled={!selected} style={{
                  width: "100%", padding: "14px", borderRadius: 14, border: "none",
                  background: selected ? "#7B1C1C" : "#CBD5E1",
                  color: "white", fontSize: 16, fontWeight: 700,
                  cursor: selected ? "pointer" : "not-allowed", fontFamily: "inherit",
                  transition: "background 0.2s",
                  boxShadow: selected ? "0 4px 14px rgba(123,28,28,0.3)" : "none",
                }}>
                  {selected ? `ยืนยันเลือกเบอร์ ${selected} ${candidateList.find(c => c.number === selected)?.emoji || "👤"} →` : "กรุณาเลือกผู้สมัครก่อน"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── CONFIRM ── */}
        {step === "confirm" && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "white", borderRadius: 20, padding: "28px 24px", maxWidth: 440, width: "100%",
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)", textAlign: "center",
            }}>

              <h2 style={{ margin: "0 0 4px", color: "#0F172A", fontSize: 20 }}>ยืนยันการลงคะแนน?</h2>
              {voterName && <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 16px" }}>ผู้ลงคะแนน: <strong>{voterName}</strong></p>}
              {(() => {
                const c = candidateList.find((c) => c.number === selected);
                if (!c) return null;
                return (
                  <div style={{
                    background: c.accent, borderRadius: 14, padding: "16px 20px", margin: "0 0 16px",
                    border: `2px solid ${c.color}`, textAlign: "left",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 12, background: c.accent,
                        border: `2px solid ${c.color}33`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 26, flexShrink: 0, overflow: "hidden"
                      }}>
                        {c.image ? (
                          <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          c.emoji
                        )}
                      </div>
                      <div>
                        <div style={{
                          background: c.color, color: c.textOnColor, display: "inline-block",
                          borderRadius: 7, padding: "2px 12px", fontSize: 12, fontWeight: 700, marginBottom: 4,
                        }}>เบอร์ {c.number}</div>
                        <div style={{ fontWeight: 800, fontSize: 17, color: "#0F172A" }}>{c.name}</div>
                        <div style={{ color: c.color, fontSize: 12, fontWeight: 600 }}>"{c.slogan}"</div>
                      </div>
                    </div>
                    <div style={{ borderTop: `1px solid ${c.color}33`, paddingTop: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#374151", marginBottom: 6 }}>นโยบายหลัก</div>
                      {c.policy.map((p, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "#374151", marginBottom: 4 }}>
                          <span style={{
                            width: 16, height: 16, borderRadius: "50%", background: c.color, color: "white",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, fontWeight: 700, flexShrink: 0, marginTop: 1,
                          }}>{i + 1}</span>
                          <span style={{ lineHeight: 1.4 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <p style={{ color: "#94A3B8", fontSize: 12, margin: "0 0 18px" }}>เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep("vote")} style={{
                  flex: 1, padding: "12px", borderRadius: 12, border: "2px solid #E2E8F0",
                  background: "white", color: "#374151", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>← ย้อนกลับ</button>
                <button onClick={confirmVote} style={{
                  flex: 1, padding: "12px", borderRadius: 12, border: "none",
                  background: "#7B1C1C", color: "white", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}>ยืนยัน ✓</button>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && (
          <div>
            {/* Kiosk Mode Notice & Quick Next Voter Action */}
            <div style={{
              background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              borderRadius: 16, padding: "16px 20px", color: "white", marginBottom: 18,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)", display: "flex",
              justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#FEF08A", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🗳️</span> สำหรับเครื่องลงคะแนนกลาง (Kiosk Booth)
                </div>
                <div style={{ fontSize: 13, color: "#CBD5E1", marginTop: 2 }}>
                  สามารถกดปุ่มเพื่อเริ่มให้ผู้มีสิทธิ์คนถัดไปเข้าสู่ระบบลงคะแนนได้ทันที
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={handleNextVoter}
                  style={{
                    padding: "10px 18px", borderRadius: 10, border: "none",
                    background: "#F5C518", color: "#7B1C1C", fontWeight: 800, fontSize: 14,
                    cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(245,197,24,0.3)",
                    display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  👥 ผู้มีสิทธิ์คนถัดไป →
                </button>
              </div>
            </div>

            {totalVotes > 0 && winnerCandidate && (
              <div style={{
                background: `linear-gradient(135deg, ${winnerCandidate.color} 0%, ${winnerCandidate.color}BB 100%)`,
                borderRadius: 20, padding: "22px 24px", color: "white", marginBottom: 20,
                boxShadow: `0 8px 28px ${winnerCandidate.color}55`, textAlign: "center",
              }}>
                <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>🏆 ผู้นำคะแนนขณะนี้</div>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", background: "white", margin: "0 auto 12px",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}>
                  {winnerCandidate.image ? (
                    <img src={winnerCandidate.image} alt={winnerCandidate.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    winnerCandidate.emoji
                  )}
                </div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{winnerCandidate.name}</div>
                <div style={{ opacity: 0.9, fontSize: 14, marginTop: 4 }}>
                  {winnerVotes} คะแนน · {getPercent(winnerCandidate.number)}%
                </div>
              </div>
            )}

            <div style={{
              background: "white", borderRadius: 14, padding: "14px 18px", marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
            }}>
              <div>
                <div style={{ color: "#64748B", fontSize: 13 }}>คะแนนรวมทั้งหมด</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: "#0F172A" }}>{totalVotes} เสียง</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: isLiveConnected ? "#DCFCE7" : "#FEF3C7",
                  color: isLiveConnected ? "#15803D" : "#B45309",
                  borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 700,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: isLiveConnected ? "#22C55E" : "#F59E0B",
                    display: "inline-block",
                    boxShadow: isLiveConnected ? "0 0 6px #22C55E" : "none",
                  }} />
                  {isLiveConnected ? "ซิงค์สดทุกเครื่อง (Live Sync)" : "กำลังซิงค์ข้อมูล..."}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    fetchServerData();
                  }}
                  title="กดเพื่อดึงคะแนนสดล่าสุดทันที"
                  style={{
                    border: "1px solid #CBD5E1", background: "#F8FAFC", borderRadius: 8,
                    padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#475569",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                  }}
                >
                  🔄 ดึงคะแนนสด
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...candidateList].sort((a, b) => (votes[b.number] || 0) - (votes[a.number] || 0)).map((c, rank) => (
                <div key={c.number} style={{
                  background: "white", borderRadius: 16, padding: "14px 18px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  border: rank === 0 && totalVotes > 0 ? `2px solid ${c.color}` : "2px solid transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: rank === 0 && totalVotes > 0 ? c.color : "#F1F5F9",
                      color: rank === 0 && totalVotes > 0 ? "white" : "#94A3B8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 14,
                    }}>
                      {rank === 0 && totalVotes > 0 ? "🥇" : rank + 1}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 160 }}>
                      <span style={{
                        background: c.color, color: c.textOnColor,
                        borderRadius: 6, padding: "1px 8px", fontSize: 12, fontWeight: 700, flexShrink: 0,
                      }}>เบอร์ {c.number}</span>
                      <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}>{c.name}</span>
                      <div style={{
                        width: 24, height: 24, borderRadius: 6, background: c.accent,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, overflow: "hidden", flexShrink: 0
                      }}>
                        {c.image ? (
                          <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          c.emoji
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "auto" }}>
                      <div style={{ fontWeight: 800, fontSize: 18, color: c.color }}>{getPercent(c.number)}%</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{(votes[c.number] || 0)} เสียง</div>
                    </div>
                  </div>
                  <div style={{ background: "#F1F5F9", borderRadius: 999, height: 10, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 999, background: c.color,
                      width: `${getPercent(c.number)}%`,
                      transition: "width 0.8s ease",
                      minWidth: (votes[c.number] || 0) > 0 ? 8 : 0,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {totalVotes === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8", fontSize: 15 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                ยังไม่มีคะแนน — รอผลการลงคะแนน
              </div>
            )}

            {/* Action buttons at bottom of results */}
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleNextVoter}
                style={{
                  flex: "1 1 200px", padding: "13px 18px", borderRadius: 12, border: "none",
                  background: "#7B1C1C", color: "white", fontSize: 15, fontWeight: 800,
                  cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(123,28,28,0.25)"
                }}
              >
                👥 ผู้ลงคะแนนคนถัดไป (เริ่มคนใหม่)
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setHasVoted(false);
                  setStep("vote");
                }}
                style={{
                  flex: "1 1 150px", padding: "13px 18px", borderRadius: 12, border: "2px solid #7B1C1C",
                  background: "white", color: "#7B1C1C", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8
                }}
              >
                🗳️ ลงคะแนนอีกครั้ง
              </button>

              <button
                type="button"
                onClick={() => setStep("home")}
                style={{
                  flex: "1 1 120px", padding: "13px 18px", borderRadius: 12, border: "2px solid #E2E8F0",
                  background: "white", color: "#374151", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8
                }}
              >
                🏠 หน้าแรก
              </button>

              <button
                type="button"
                onClick={handleNextVoter}
                style={{
                  flex: "1 1 120px", padding: "13px 18px", borderRadius: 12, border: "2px solid #E2E8F0",
                  background: "#F8FAFC", color: "#64748B", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8
                }}
              >
                🚪 ออกจากระบบ
              </button>
            </div>
          </div>
        )}

        {/* ── ADMIN PANEL ── */}
        {step === "admin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Admin Header Title */}
            <div style={{
              background: "linear-gradient(135deg, #7B1C1C 0%, #4C1111 100%)",
              borderRadius: 20, padding: "24px 20px", color: "white",
              boxShadow: "0 8px 30px rgba(123,28,28,0.25)", position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(245,197,24,0.15)" }} />
              <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>ADMIN CONTROL PANEL</div>
              <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>⚙️ ระบบจัดการข้อมูลผู้ดูแลระบบ</h1>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>
                คุณสามารถเพิ่มผู้สมัคร, อัปโหลดรูปภาพประจำตัวผู้สมัคร, ปรับเปลี่ยนคะแนน, หรือล้างข้อมูลคะแนนเพื่อเริ่มการเลือกตั้งใหม่ได้ที่นี่
              </p>
            </div>

            {/* Main Admin Section Divided Into 2 Parts: Add Candidate & Candidates List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Card 0: System Configurations */}
              <div style={{
                background: "white", borderRadius: 20, padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}>
                <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#1E293B", borderBottom: "2px solid #F1F5F9", paddingBottom: 10 }}>
                  ⚙️ ตั้งค่าข้อมูลสถาบันและระบบ
                </h2>
                <div>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                    ปีการศึกษาการเลือกตั้ง
                  </label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="เช่น ปีการศึกษา 2570"
                      style={{
                        flex: "1 1 200px", padding: "11px 14px", borderRadius: 8, boxSizing: "border-box",
                        border: "1px solid #CBD5E1", fontSize: 14, fontFamily: "inherit", outline: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        broadcastElectionData({
                          year,
                          candidates: candidateList,
                          votes,
                          votedStudentIds: votedIds,
                          lastUpdated: Date.now(),
                        });
                        alert("อัปเดต ปีการศึกษา เรียบร้อยแล้ว!");
                      }}
                      style={{
                        padding: "11px 20px", borderRadius: 8, border: "none",
                        background: "#7B1C1C", color: "white", fontWeight: "bold", cursor: "pointer",
                        fontFamily: "inherit", fontSize: 13, boxShadow: "0 2px 6px rgba(123,28,28,0.2)"
                      }}
                    >
                      🔄 บันทึกปีการศึกษา
                    </button>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>
                    * เมื่อรับเปลี่ยน ข้อมูลจะแสดงผลจริงทันทีที่ส่วนหัวของระบบ, หน้าเข้าสู่ระบบ, หน้าข้อมูลเสียง และส่วนล่างของเว็บไซต์
                  </p>
                </div>
              </div>

              {/* Card 1: Add New Candidate */}
              <div style={{
                background: "white", borderRadius: 20, padding: "28px 24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}>
                <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#1E293B", borderBottom: "2px solid #F1F5F9", paddingBottom: 10 }}>
                  👤 เพิ่มผู้สมัครคนใหม่
                </h2>

                {/* Candidate Name Input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                    ชื่อแผนกวิชา / ชื่อผู้สมัคร <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newCamName}
                    onChange={(e) => setNewCamName(e.target.value)}
                    placeholder="เช่น แผนกเบเกอรี่และคอมพิวเตอร์"
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 8, boxSizing: "border-box",
                      border: "1px solid #CBD5E1", fontSize: 14, fontFamily: "inherit", outline: "none",
                    }}
                  />
                </div>

                {/* Slogan Input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                    สโลแกนประจำใจ <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newCamSlogan}
                    onChange={(e) => setNewCamSlogan(e.target.value)}
                    placeholder="เช่น เรียนดี มีคุณธรรม ร่วมสร้างผู้นำ"
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 8, boxSizing: "border-box",
                      border: "1px solid #CBD5E1", fontSize: 14, fontFamily: "inherit", outline: "none",
                    }}
                  />
                </div>

                {/* Flex layout for Emoji, Color selection */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                  {/* Emoji selection */}
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                      อีโมจิผู้สมัคร (Emoji)
                    </label>
                    <input
                      type="text"
                      value={newCamEmoji}
                      onChange={(e) => setNewCamEmoji(e.target.value)}
                      placeholder="เช่น ⚙️ หรือ 👤"
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 8, boxSizing: "border-box",
                        border: "1px solid #CBD5E1", fontSize: 14, fontFamily: "inherit", outline: "none",
                      }}
                    />
                  </div>

                  {/* Themes/Color Selection */}
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                      ธีมสีประจำพรรค
                    </label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                      {[
                        { color: "#16A34A", name: "เขียว" },
                        { color: "#3B82F6", name: "น้ำเงิน" },
                        { color: "#EF4444", name: "แดง" },
                        { color: "#CA8A04", name: "เหลือง" },
                        { color: "#DB2777", name: "ชมพู" },
                        { color: "#8B5CF6", name: "ม่วง" },
                        { color: "#4B5563", name: "เทา" }
                      ].map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setNewCamColor(item.color)}
                          title={item.name}
                          style={{
                            width: 28, height: 28, borderRadius: "50%", background: item.color,
                            border: newCamColor === item.color ? "3px solid #0F172A" : "2px solid white",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.15)", cursor: "pointer", transition: "all 0.15s"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Photo Upload Input (เพิ่มรูปภาพของผู้สมัคร) */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                    รูปภาพผู้สมัคร (อัปโหลดรูปภาพจริง)
                  </label>
                  <div style={{
                    border: "2px dashed #CBD5E1", borderRadius: 12, padding: "16px",
                    textAlign: "center", background: "#F8FAFC", cursor: "pointer",
                    position: "relative", display: "flex", flexDirection: "column", alignItems: "center"
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewCamImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{
                        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                        opacity: 0, cursor: "pointer"
                      }}
                    />
                    {newCamImage ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <img
                          src={newCamImage}
                          alt="preview"
                          style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewCamImage("");
                          }}
                          style={{
                            background: "#EF4444", color: "white", border: "none", borderRadius: 15,
                            padding: "4px 12px", fontSize: 11, cursor: "pointer", fontWeight: "bold"
                          }}
                        >
                          ล้างรูปภาพ ❌
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 28, marginBottom: 4 }}>📸</div>
                        <div style={{ fontSize: 13, color: "#475569", fontWeight: "bold" }}>
                          คลิกเพื่ออัปโหลดไฟล์รูปภาพที่นี่
                        </div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                          รองรับไฟล์ JPG, PNG, WEBP
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Policies textarea */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 6 }}>
                    นโยบายประจำตัว (ระบุทีละข้อ บรรทัดละ 1 นโยบาย)
                  </label>
                  <textarea
                    rows={4}
                    value={newCamPolicies}
                    onChange={(e) => setNewCamPolicies(e.target.value)}
                    placeholder={`เช่น:\nยกระดับห้องเรียนไอทีด้วยเทคโนโลยีล้ำสมัย\nส่งเสริมกิจกรรมกีฬาแกร่งนอกเวลาเรียน\nประสานงานนักศึกษากับสโมรวิชาชีพทั่วไทย`}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 8, boxSizing: "border-box",
                      border: "1px solid #CBD5E1", fontSize: 13, fontFamily: "inherit", outline: "none",
                      resize: "vertical", lineHeight: 1.5
                    }}
                  />
                </div>

                {/* Action button: Save candidate */}
                <button
                  type="button"
                  onClick={() => {
                    if (!newCamName.trim()) {
                      alert("กรุณากรอกชื่อแผนกวิชา / ชื่อผู้สมัคร");
                      return;
                    }
                    if (!newCamSlogan.trim()) {
                      alert("กรุณากรอกสโลแกนประจำใจ");
                      return;
                    }

                    const nextNum = candidateList.length > 0 
                      ? Math.max(...candidateList.map(c => c.number)) + 1 
                      : 1;

                    const policiesArr = newCamPolicies
                      .split("\n")
                      .map(p => p.trim())
                      .filter(p => p !== "");

                    const newCandidateObj = {
                      number: nextNum,
                      name: newCamName.trim(),
                      slogan: newCamSlogan.trim(),
                      color: newCamColor,
                      accent: newCamColor + "15",
                      textOnColor: "white",
                      policy: policiesArr.length > 0 ? policiesArr : ["นโยบายพร้อมสนับสนุนนักเรียนนักศึกษา"],
                      emoji: newCamEmoji.trim() || "👤",
                      image: newCamImage || undefined
                    };

                    const updatedCandidates = [...candidateList, newCandidateObj];
                    const updatedVotes = { ...votes, [nextNum]: 0 };
                    setCandidateList(updatedCandidates);
                    setVotes(updatedVotes);

                    broadcastElectionData({
                      year,
                      candidates: updatedCandidates,
                      votes: updatedVotes,
                      votedStudentIds: votedIds,
                      lastUpdated: Date.now(),
                    });

                    // Reset form states
                    setNewCamName("");
                    setNewCamSlogan("");
                    setNewCamEmoji("👤");
                    setNewCamImage("");
                    setNewCamPolicies("");
                    alert("บันทึกข้อมูลผู้สมัครรายใหม่ เรียบร้อยแล้ว!");
                  }}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 10, border: "none",
                    background: "#16A34A", color: "white", fontSize: 15, fontWeight: 800,
                    cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 10px rgba(22,163,74,0.3)"
                  }}
                >
                  💾 บันทึกผู้สมัครรายนี้ +
                </button>
              </div>

              {/* Card 2: Candidates management panel & Live Statistics */}
              <div style={{
                background: "white", borderRadius: 20, padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}>
                <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#1E293B", borderBottom: "2px solid #F1F5F9", paddingBottom: 10 }}>
                  📊 ตารางควบคุมผู้สมัครและคะแนนโหวตสด
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {candidateList.map((c) => {
                    const count = votes[c.number] || 0;
                    if (editingCandidateNum === c.number) {
                      return (
                        <div
                          key={c.number}
                          style={{
                            background: "#F8FAFC", borderRadius: 14, padding: "20px",
                            border: "2px solid #3B82F6", boxShadow: "0 4px 15px rgba(59,130,246,0.1)",
                            display: "flex", flexDirection: "column", gap: 14
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E2E8F0", paddingBottom: 8 }}>
                            <strong style={{ fontSize: 15, color: "#1E293B" }}>
                              📝 แก้ไขข้อมูล เบอร์ {c.number}
                            </strong>
                            <span style={{ fontSize: 11, color: "#94A3B8" }}>รหัสระบบ: #{c.number}</span>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {/* Name Input */}
                            <div>
                              <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#475569", marginBottom: 4 }}>
                                ชื่อแผนกวิชา / ชื่อผู้สมัคร <span style={{ color: "#EF4444" }}>*</span>
                              </label>
                              <input
                                type="text"
                                value={editCamName}
                                onChange={(e) => setEditCamName(e.target.value)}
                                style={{
                                  width: "100%", padding: "8px 12px", borderRadius: 8, boxSizing: "border-box",
                                  border: "1px solid #CBD5E1", fontSize: 13, fontFamily: "inherit", outline: "none",
                                }}
                              />
                            </div>

                            {/* Slogan Input */}
                            <div>
                              <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#475569", marginBottom: 4 }}>
                                สโลแกนประจำใจ <span style={{ color: "#EF4444" }}>*</span>
                              </label>
                              <input
                                type="text"
                                value={editCamSlogan}
                                onChange={(e) => setEditCamSlogan(e.target.value)}
                                style={{
                                  width: "100%", padding: "8px 12px", borderRadius: 8, boxSizing: "border-box",
                                  border: "1px solid #CBD5E1", fontSize: 13, fontFamily: "inherit", outline: "none",
                                }}
                              />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                              {/* Emoji input */}
                              <div>
                                <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#475569", marginBottom: 4 }}>
                                  อีโมจิประจำตัว (เว้นว่างได้)
                                </label>
                                <input
                                  type="text"
                                  value={editCamEmoji}
                                  onChange={(e) => setEditCamEmoji(e.target.value)}
                                  style={{
                                    width: "100%", padding: "8px 12px", borderRadius: 8, boxSizing: "border-box",
                                    border: "1px solid #CBD5E1", fontSize: 13, fontFamily: "inherit", outline: "none",
                                  }}
                                />
                              </div>

                              {/* Color selector */}
                              <div>
                                <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#475569", marginBottom: 4 }}>
                                  เลือกสีธีมประจำตัว
                                </label>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  <input
                                    type="color"
                                    value={editCamColor}
                                    onChange={(e) => setEditCamColor(e.target.value)}
                                    style={{
                                      width: 42, height: 34, border: "1px solid #CBD5E1", borderRadius: 6,
                                      padding: 2, cursor: "pointer", background: "white", flexShrink: 0
                                    }}
                                  />
                                  <input
                                    type="text"
                                    value={editCamColor}
                                    onChange={(e) => setEditCamColor(e.target.value)}
                                    style={{
                                      width: "100%", padding: "7px 10px", borderRadius: 8, boxSizing: "border-box",
                                      border: "1px solid #CBD5E1", fontSize: 12, fontFamily: "inherit", outline: "none"
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Image Upload / Change */}
                            <div>
                              <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#475569", marginBottom: 4 }}>
                                รูปภาพประจำตัว (อัปโหลดใหม่)
                              </label>
                              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <div style={{
                                  position: "relative", border: "1px dashed #CBD5E1", borderRadius: 8,
                                  padding: "8px 12px", background: "white", textAlign: "center", cursor: "pointer", flex: 1
                                }}>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setEditCamImage(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    style={{
                                      position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                                      opacity: 0, cursor: "pointer"
                                    }}
                                  />
                                  <span style={{ fontSize: 12, color: "#475569" }}>
                                    📁 เลือกไฟล์รูปภาพใหม่
                                  </span>
                                </div>

                                {editCamImage && (
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <img src={editCamImage} alt="Preview" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", border: "1px solid #CBD5E1" }} />
                                    <button
                                      type="button"
                                      onClick={() => setEditCamImage("")}
                                      style={{
                                        border: "none", background: "#FEF2F2", color: "#EF4444",
                                        borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", fontWeight: "bold"
                                      }}
                                    >
                                      ลบ ❌
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Policies textarea */}
                            <div>
                              <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#475569", marginBottom: 4 }}>
                                นโยบายประจำตัว (ระบุบรรทัดละ 1 ข้อ)
                              </label>
                              <textarea
                                rows={3}
                                value={editCamPolicies}
                                onChange={(e) => setEditCamPolicies(e.target.value)}
                                placeholder="ใส่ทีละนโยบาย บรรทัดละ 1 ข้อ"
                                style={{
                                  width: "100%", padding: "8px 12px", borderRadius: 8, boxSizing: "border-box",
                                  border: "1px solid #CBD5E1", fontSize: 12, fontFamily: "inherit", outline: "none",
                                  resize: "vertical", lineHeight: 1.4
                                }}
                              />
                            </div>
                          </div>

                          {/* Action Form buttons */}
                          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                            <button
                              type="button"
                              onClick={() => {
                                if (!editCamName.trim()) {
                                  alert("กรุณากรอกชื่อแผนกวิชา / ชื่อผู้สมัคร");
                                  return;
                                }
                                if (!editCamSlogan.trim()) {
                                  alert("กรุณากรอกสโลแกนประจำใจ");
                                  return;
                                }

                                const policiesArr = editCamPolicies
                                  .split("\n")
                                  .map(p => p.trim())
                                  .filter(p => p !== "");

                                const updatedList = candidateList.map(cand => {
                                  if (cand.number === c.number) {
                                    return {
                                      ...cand,
                                      name: editCamName.trim(),
                                      slogan: editCamSlogan.trim(),
                                      emoji: editCamEmoji.trim() || "👤",
                                      image: editCamImage || undefined,
                                      color: editCamColor,
                                      accent: editCamColor + "15",
                                      policy: policiesArr.length > 0 ? policiesArr : ["นโยบายพร้อมสนับสนุนนักเรียนนักศึกษา"]
                                    };
                                  }
                                  return cand;
                                });
                                setCandidateList(updatedList);
                                broadcastElectionData({
                                  year,
                                  candidates: updatedList,
                                  votes,
                                  votedStudentIds: votedIds,
                                  lastUpdated: Date.now(),
                                });
                                setEditingCandidateNum(null);
                                alert(`แก้ไขข้อมูลผู้สมัคร เบอร์ ${c.number} เรียบร้อยแล้ว!`);
                              }}
                              style={{
                                flex: 1, padding: "10px", borderRadius: 8, border: "none",
                                background: "#16A34A", color: "white", fontSize: 13, fontWeight: "bold",
                                cursor: "pointer", boxShadow: "0 2px 4px rgba(22,163,74,0.15)"
                              }}
                            >
                              💾 บันทึกการแก้ไข
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCandidateNum(null)}
                              style={{
                                flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #CBD5E1",
                                background: "white", color: "#64748B", fontSize: 13, fontWeight: "bold",
                                cursor: "pointer"
                              }}
                            >
                              ✕ ยกเลิก
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={c.number}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          background: "#F8FAFC", borderRadius: 14, padding: "12px 16px",
                          borderLeft: `5px solid ${c.color}`, flexWrap: "wrap", justifyContent: "space-between"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 150 }}>
                          {/* Avatar/Emoji */}
                          <div style={{
                            width: 44, height: 44, borderRadius: 10, background: c.accent,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 22, overflow: "hidden", flexShrink: 0, border: "1px solid #CBD5E1"
                          }}>
                            {c.image ? (
                              <img src={c.image} alt="candidate" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              c.emoji
                            )}
                          </div>

                          {/* Candidate Details */}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <span style={{
                              background: c.color, color: "white", borderRadius: 6,
                              padding: "2px 8px", fontSize: 11, fontWeight: "bold", marginRight: 8
                            }}>เบอร์ {c.number}</span>
                            <strong style={{ fontSize: 14, color: "#1E293B" }}>{c.name}</strong>
                            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{c.slogan}</div>
                          </div>
                        </div>

                        {/* Adjust Vote Stats */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "4px 0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => {
                                const newVotes = {
                                  ...votes,
                                  [c.number]: Math.max(0, (votes[c.number] || 0) - 1)
                                };
                                setVotes(newVotes);
                                broadcastElectionData({
                                  year,
                                  candidates: candidateList,
                                  votes: newVotes,
                                  votedStudentIds: votedIds,
                                  lastUpdated: Date.now(),
                                });
                              }}
                              style={{
                                width: 28, height: 28, borderRadius: "50%", border: "1px solid #CBD5E1",
                                background: "white", cursor: "pointer", fontWeight: "bold", display: "flex",
                                alignItems: "center", justifyContent: "center", color: "#64748B"
                              }}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: 800, fontSize: 16, minWidth: 24, textAlign: "center" }}>
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newVotes = {
                                  ...votes,
                                  [c.number]: (votes[c.number] || 0) + 1
                                };
                                setVotes(newVotes);
                                broadcastElectionData({
                                  year,
                                  candidates: candidateList,
                                  votes: newVotes,
                                  votedStudentIds: votedIds,
                                  lastUpdated: Date.now(),
                                });
                              }}
                              style={{
                                width: 28, height: 28, borderRadius: "50%", border: "1px solid #CBD5E1",
                                background: "white", cursor: "pointer", fontWeight: "bold", display: "flex",
                                alignItems: "center", justifyContent: "center", color: "#16A34A"
                              }}
                            >
                              +
                            </button>
                          </div>

                          {/* Edit Candidate Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCandidateNum(c.number);
                              setEditCamName(c.name);
                              setEditCamSlogan(c.slogan);
                              setEditCamEmoji(c.emoji || "👤");
                              setEditCamImage(c.image || "");
                              setEditCamColor(c.color || "#16A34A");
                              setEditCamPolicies(c.policy ? c.policy.join("\n") : "");
                            }}
                            style={{
                              background: "#EFF6FF", color: "#3B82F6", border: "1px solid #93C5FD",
                              borderRadius: 10, padding: "6px 12px", fontSize: 12, cursor: "pointer",
                              fontWeight: "bold", transition: "all 0.15s"
                            }}
                          >
                            แก้ไข ✏️
                          </button>

                          {/* Delete Candidate Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ "เบอร์ ${c.number}: ${c.name}" ออกจากระบบ?`)) {
                                const updatedCandidates = candidateList.filter(cand => cand.number !== c.number);
                                const newVotes = { ...votes };
                                delete newVotes[c.number];
                                setCandidateList(updatedCandidates);
                                setVotes(newVotes);
                                broadcastElectionData({
                                  year,
                                  candidates: updatedCandidates,
                                  votes: newVotes,
                                  votedStudentIds: votedIds,
                                  lastUpdated: Date.now(),
                                });
                              }
                            }}
                            style={{
                              background: "#FEF2F2", color: "#EF4444", border: "1px solid #FCA5A5",
                              borderRadius: 10, padding: "6px 12px", fontSize: 12, cursor: "pointer",
                              fontWeight: "bold", transition: "all 0.15s"
                            }}
                          >
                            ลบ 🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {candidateList.length === 0 && (
                    <div style={{ textAlign: "center", padding: "16px", color: "#94A3B8", fontSize: 13 }}>
                      ไม่มีผู้สมัครในขณะนี้ กรุณาเพิ่มผู้สมัครจากช่องด้านบน
                    </div>
                  )}
                </div>

                {/* System Reset Utilities */}
                <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("คุณแน่ใจหรือไม่ที่จะรีเซ็ตคะแนนโหวตทั้งหมดกลับไปเป็น 0?")) {
                        const resetVotes: Record<number, number> = {};
                        candidateList.forEach(c => {
                          resetVotes[c.number] = 0;
                        });
                        setVotes(resetVotes);
                        broadcastElectionData({
                          year,
                          candidates: candidateList,
                          votes: resetVotes,
                          votedStudentIds: votedIds,
                          lastUpdated: Date.now(),
                        });
                        alert("รีเซ็ตคะแนนโหวตทั้งหมดเป็น 0 เรียบร้อยแล้ว!");
                      }
                    }}
                    style={{
                      flex: "1 1 180px", padding: "11px", borderRadius: 8, border: "2px solid #EF4444",
                      background: "white", color: "#EF4444", fontSize: 13, fontWeight: "bold", cursor: "pointer"
                    }}
                  >
                    🔄 รีเซ็ตคะแนนโหวตทั้งหมดเป็น 0
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("กรุณายืนยันการล้างประวัติการโหวตของผู้ใช้งานทุกคน (เพื่อให้สามารถเริ่มลงคะแนนใหม่ได้)?")) {
                        setHasVoted(false);
                        localStorage.removeItem("election_has_voted");
                        localStorage.removeItem("election_student_id");
                        try {
                          await fetch("/api/admin/clear-voted-status", { method: "POST" });
                        } catch {}
                        alert("ล้างประวัติการลงคะแนนเรียบร้อยแล้ว! ทุกท่านสามารถเข้ามาลงคะแนนใหม่ได้");
                      }
                    }}
                    style={{
                      flex: "1 1 180px", padding: "11px", borderRadius: 8, border: "2px solid #CA8A04",
                      background: "white", color: "#CA8A04", fontSize: 13, fontWeight: "bold", cursor: "pointer"
                    }}
                  >
                    🗳️ ล้างสถานะโหวต (ให้ทุกคนโหวตใหม่ได้)
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("กรุณายืนยันการตั้งค่าผู้สมัครทั้งหมดกลับไปเป็นค่าเริ่มต้นจากวิทยาลัย?")) {
                        setCandidateList(initialCandidates);
                        const rVotes: Record<number, number> = {};
                        initialCandidates.forEach(c => {
                          rVotes[c.number] = 0;
                        });
                        setVotes(rVotes);
                        setHasVoted(false);
                        localStorage.removeItem("election_has_voted");
                        localStorage.removeItem("election_student_id");
                        localStorage.removeItem("election_candidates");
                        localStorage.removeItem("election_votes");
                        try {
                          await fetch("/api/admin/reset-all-default", { method: "POST" });
                        } catch {}
                        alert("รีเซ็ตรายชื่อผู้สมัครและคะแนนโหวตเป็นค่าเริ่มต้นเรียบร้อยแล้ว!");
                      }
                    }}
                    style={{
                      flex: "1 1 180px", padding: "11px", borderRadius: 8, border: "2px solid #64748B",
                      background: "white", color: "#64748B", fontSize: 13, fontWeight: "bold", cursor: "pointer"
                    }}
                  >
                    ⚙️ ตั้งค่าผู้สมัครกลับเป็นค่าเริ่มต้น
                  </button>
                </div>
              </div>

              {/* Card 3: Back to election or log out admin */}
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep("home")}
                  style={{
                    flex: 1, padding: "14px", borderRadius: 12, border: "none",
                    background: "#0F172A", color: "white", fontSize: 15, fontWeight: "bold",
                    cursor: "pointer", textAlign: "center", boxShadow: "0 4px 10px rgba(15,23,42,0.2)"
                  }}
                >
                  👁️ ดูหน้าแรกในฐานะผู้ชมทั่วไป
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAdmin(false);
                    setStep("login");
                    setShowAdminLogin(false);
                  }}
                  style={{
                    flex: 1, padding: "14px", borderRadius: 12, border: "2px solid #E2E8F0",
                    background: "white", color: "#EF4444", fontSize: 15, fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  🚪 ออกจากระบบแอดมิน (Log Out)
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

      <footer style={{
        textAlign: "center", padding: "32px 16px", color: "#94A3B8", fontSize: 12,
        borderTop: "1px solid #E2E8F0", marginTop: 40,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
      }}>
        <img 
          src="https://i.postimg.cc/VNQ6dTcq/tra-xngkh-kar-him.png" 
          alt="อวท. Logo" 
          style={{ width: 36, height: 36, objectFit: "contain", filter: "grayscale(1) opacity(0.65)" }} 
        />
        <span>{ORG_NAME} · {SCHOOL_NAME} · {year}</span>
      </footer>
    </div>
  );
}
