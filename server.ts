import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "20mb" }));

// Enable CORS for cross-device support
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// File storage path for persistent votes & candidates
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "election_store.json");

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

interface ElectionStore {
  year: string;
  candidates: any[];
  votes: Record<number, number>;
  votedStudentIds: string[];
  lastUpdated: number;
}

const defaultData: ElectionStore = {
  year: "ปีการศึกษา 2570",
  candidates: initialCandidates,
  votes: { 1: 0, 2: 0, 3: 0, 4: 0 },
  votedStudentIds: [],
  lastUpdated: Date.now(),
};

function loadStore(): ElectionStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return {
        year: parsed.year || defaultData.year,
        candidates: parsed.candidates || defaultData.candidates,
        votes: parsed.votes || defaultData.votes,
        votedStudentIds: parsed.votedStudentIds || defaultData.votedStudentIds,
        lastUpdated: parsed.lastUpdated || Date.now(),
      };
    }
  } catch (err) {
    console.error("Error reading election store:", err);
  }
  return { ...defaultData };
}

let currentStore: ElectionStore = loadStore();

// Track active SSE client connections for zero-latency live updates
const sseClients: Set<express.Response> = new Set();

function broadcastUpdate() {
  const payload = JSON.stringify({
    year: currentStore.year,
    candidates: currentStore.candidates,
    votes: currentStore.votes,
    votedStudentIds: currentStore.votedStudentIds,
    lastUpdated: currentStore.lastUpdated,
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    currentStore.lastUpdated = Date.now();
    fs.writeFileSync(DATA_FILE, JSON.stringify(currentStore, null, 2), "utf-8");
    broadcastUpdate();

    // Async sync to cloud storage relay
    const cloudPayload = JSON.stringify({
      name: "dbsurat_election_live",
      data: {
        payload: JSON.stringify(currentStore),
      },
    });
    fetch("https://api.restful-api.dev/objects/ff808181a061cdc401a062c8b32204a6", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: cloudPayload,
    }).catch(() => {});
    fetch("https://api.restful-api.dev/objects/ff808181a061cdc401a062cae18f04ac", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: cloudPayload,
    }).catch(() => {});
  } catch (err) {
    console.error("Error writing election store:", err);
  }
}

// Initial and periodic sync from cloud to keep server in sync with all external devices
async function syncFromCloud() {
  try {
    const res = await fetch("https://api.restful-api.dev/objects/ff808181a061cdc401a062c8b32204a6");
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.payload) {
        const cloudData = JSON.parse(json.data.payload);
        if (cloudData && cloudData.votes) {
          const totalLocalVotes = Object.values(currentStore.votes).reduce((a, b) => a + b, 0);
          const totalCloudVotes = Object.values(cloudData.votes as Record<number, number>).reduce((a, b) => a + b, 0);
          if (totalCloudVotes > totalLocalVotes) {
            currentStore.votes = cloudData.votes;
            if (cloudData.year) currentStore.year = cloudData.year;
            if (cloudData.candidates?.length) currentStore.candidates = cloudData.candidates;
            if (cloudData.votedStudentIds) currentStore.votedStudentIds = cloudData.votedStudentIds;
            currentStore.lastUpdated = cloudData.lastUpdated || Date.now();
            saveStore();
            broadcastUpdate();
            console.log("Synced latest votes from cloud relay:", cloudData.votes);
          }
        }
      }
    }
  } catch {}
}

syncFromCloud();
setInterval(syncFromCloud, 2500);

// ── Real-Time SSE Stream Route ──
app.get("/api/election/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  // Send current data immediately on connection
  const initialPayload = JSON.stringify({
    year: currentStore.year,
    candidates: currentStore.candidates,
    votes: currentStore.votes,
    votedStudentIds: currentStore.votedStudentIds,
    lastUpdated: currentStore.lastUpdated,
  });
  res.write(`data: ${initialPayload}\n\n`);

  sseClients.add(res);

  // Keep-alive heartbeat every 15 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(": heartbeat\n\n");
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// ── API Routes ──
app.get("/api/election", (_req, res) => {
  res.json({
    year: currentStore.year,
    candidates: currentStore.candidates,
    votes: currentStore.votes,
    votedStudentIds: currentStore.votedStudentIds,
    lastUpdated: currentStore.lastUpdated,
  });
});

app.post("/api/vote", (req, res) => {
  const { studentId, candidateNumber } = req.body;
  if (!studentId || candidateNumber === undefined) {
    return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
  }

  const cleanId = String(studentId).trim();
  const num = Number(candidateNumber);
  currentStore.votes[num] = (currentStore.votes[num] || 0) + 1;
  currentStore.votedStudentIds.push(cleanId);
  saveStore();

  return res.json({
    success: true,
    votes: currentStore.votes,
    votedStudentIds: currentStore.votedStudentIds,
    lastUpdated: currentStore.lastUpdated,
  });
});

app.post("/api/admin/update-year", (req, res) => {
  const { year } = req.body;
  if (year && typeof year === "string") {
    currentStore.year = year.trim();
    saveStore();
  }
  res.json({ success: true, year: currentStore.year });
});

app.post("/api/admin/update-candidates", (req, res) => {
  const { candidates, votes } = req.body;
  if (Array.isArray(candidates)) {
    currentStore.candidates = candidates;
  }
  if (votes && typeof votes === "object") {
    currentStore.votes = votes;
  }
  saveStore();
  res.json({ success: true, candidates: currentStore.candidates, votes: currentStore.votes });
});

app.post("/api/admin/adjust-vote", (req, res) => {
  const { candidateNumber, delta } = req.body;
  const num = Number(candidateNumber);
  const change = Number(delta);
  if (!isNaN(num) && !isNaN(change)) {
    const current = currentStore.votes[num] || 0;
    currentStore.votes[num] = Math.max(0, current + change);
    saveStore();
  }
  res.json({ success: true, votes: currentStore.votes });
});

app.post("/api/admin/reset-votes", (_req, res) => {
  const resetVotes: Record<number, number> = {};
  currentStore.candidates.forEach((c) => {
    resetVotes[c.number] = 0;
  });
  currentStore.votes = resetVotes;
  saveStore();
  res.json({ success: true, votes: currentStore.votes });
});

app.post("/api/admin/clear-voted-status", (_req, res) => {
  currentStore.votedStudentIds = [];
  saveStore();
  res.json({ success: true, votedStudentIds: [] });
});

app.post("/api/admin/reset-all-default", (_req, res) => {
  currentStore = {
    year: "ปีการศึกษา 2570",
    candidates: initialCandidates,
    votes: { 1: 0, 2: 0, 3: 0, 4: 0 },
    votedStudentIds: [],
    lastUpdated: Date.now(),
  };
  saveStore();
  res.json({ success: true, ...currentStore });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
