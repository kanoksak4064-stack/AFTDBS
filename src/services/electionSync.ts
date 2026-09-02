// Real-Time Cross-Device Synchronization Service for Election App
// Supports:
// 1. Dual Cloud Sync (restful-api.dev primary + backup) for Static hosting (Render, Vercel, Netlify) & cross-device mobile/PC
// 2. Local Express server API (/api/*) when running full-stack
// 3. Browser BroadcastChannel for instant same-device cross-tab synchronization

export interface Candidate {
  number: number;
  name: string;
  slogan: string;
  color: string;
  accent: string;
  textOnColor: string;
  policy: string[];
  emoji?: string;
  image?: string;
}

export interface ElectionData {
  year: string;
  candidates: Candidate[];
  votes: Record<number, number>;
  votedStudentIds: string[];
  lastUpdated: number;
  resetTimestamp?: number;
}

const CLOUD_PRIMARY_URL = "https://api.restful-api.dev/objects/ff808181a061cdc401a062c8b32204a6";
const CLOUD_BACKUP_URL = "https://api.restful-api.dev/objects/ff808181a061cdc401a062cae18f04ac";

// Local tab broadcast channel
let bc: BroadcastChannel | null = null;
try {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    bc = new BroadcastChannel("dbsurat_election_live_channel");
  }
} catch {}

export function onLocalBroadcast(callback: (data: ElectionData) => void): () => void {
  if (!bc) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data && typeof event.data === "object" && event.data.votes) {
      callback(event.data);
    }
  };
  bc.addEventListener("message", handler);
  return () => {
    bc?.removeEventListener("message", handler);
  };
}

export function mergeElectionData(a: ElectionData | null, b: ElectionData | null): ElectionData {
  if (!a && b) return b;
  if (!b && a) return a;
  if (!a && !b) {
    return {
      year: "ปีการศึกษา 2570",
      candidates: [],
      votes: {},
      votedStudentIds: [],
      lastUpdated: Date.now(),
    };
  }

  const resetTimeA = a?.resetTimestamp || 0;
  const resetTimeB = b?.resetTimestamp || 0;

  // If one dataset has a newer resetTimestamp, that reset takes full precedence over older data
  if (resetTimeA > resetTimeB) {
    return a!;
  }
  if (resetTimeB > resetTimeA) {
    return b!;
  }

  // Same reset timestamp: Merge votes by taking the maximum vote count for each candidate so no votes are lost across devices
  const mergedVotes: Record<number, number> = { ...(a?.votes || {}) };
  for (const [k, v] of Object.entries(b?.votes || {})) {
    const num = Number(k);
    mergedVotes[num] = Math.max(mergedVotes[num] || 0, Number(v) || 0);
  }

  const mergedVoted = Array.from(new Set([...(a?.votedStudentIds || []), ...(b?.votedStudentIds || [])]));

  return {
    year: b?.year || a?.year || "ปีการศึกษา 2570",
    candidates: (b?.candidates && b.candidates.length > 0) ? b.candidates : (a?.candidates || []),
    votes: mergedVotes,
    votedStudentIds: mergedVoted,
    lastUpdated: Math.max(a?.lastUpdated || 0, b?.lastUpdated || 0),
    resetTimestamp: Math.max(resetTimeA, resetTimeB),
  };
}

export async function fetchLiveElectionData(): Promise<{ success: boolean; data?: ElectionData; source: string }> {
  // Fetch from server and cloud in parallel for maximum resilience
  const [serverResult, cloudResult] = await Promise.allSettled([
    (async () => {
      const res = await fetch("/api/election", {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (data && data.votes) return data as ElectionData;
      }
      throw new Error("Server not json");
    })(),
    (async () => {
      // 1. Try Primary Cloud Relay
      try {
        const res = await fetch(CLOUD_PRIMARY_URL, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.payload) {
            const parsed = JSON.parse(json.data.payload);
            if (parsed && parsed.votes) return parsed as ElectionData;
          }
        }
      } catch {}

      // 2. Try Backup Cloud Relay
      const resBackup = await fetch(CLOUD_BACKUP_URL, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (resBackup.ok) {
        const jsonBackup = await resBackup.json();
        if (jsonBackup?.data?.payload) {
          const parsed = JSON.parse(jsonBackup.data.payload);
          if (parsed && parsed.votes) return parsed as ElectionData;
        }
      }
      throw new Error("Cloud not reachable");
    })()
  ]);

  const serverData = serverResult.status === "fulfilled" ? serverResult.value : null;
  const cloudData = cloudResult.status === "fulfilled" ? cloudResult.value : null;

  if (serverData && cloudData) {
    const merged = mergeElectionData(serverData, cloudData);
    return { success: true, data: merged, source: "merged" };
  } else if (cloudData) {
    return { success: true, data: cloudData, source: "cloud" };
  } else if (serverData) {
    return { success: true, data: serverData, source: "server" };
  }

  return { success: false, source: "none" };
}

async function updateCloudStore(url: string, payload: ElectionData): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "dbsurat_election_live",
        data: {
          payload: JSON.stringify(payload),
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function broadcastElectionData(data: ElectionData): Promise<boolean> {
  const payload: ElectionData = {
    ...data,
    lastUpdated: Date.now(),
    resetTimestamp: data.resetTimestamp,
  };

  // Local BroadcastChannel for instant same-device sync
  try {
    bc?.postMessage(payload);
  } catch {}

  // 1. Push to server API if available
  try {
    fetch("/api/admin/update-candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidates: payload.candidates,
        votes: payload.votes,
      }),
    }).catch(() => {});
    fetch("/api/admin/update-year", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: payload.year }),
    }).catch(() => {});
  } catch {}

  // 2. Push to Primary & Backup Clouds simultaneously
  const [p1, p2] = await Promise.allSettled([
    updateCloudStore(CLOUD_PRIMARY_URL, payload),
    updateCloudStore(CLOUD_BACKUP_URL, payload),
  ]);

  return (p1.status === "fulfilled" && p1.value) || (p2.status === "fulfilled" && p2.value);
}

export async function submitVoteLive(
  studentId: string,
  voterName: string,
  candidateNumber: number,
  currentData: ElectionData
): Promise<ElectionData> {
  const num = Number(candidateNumber);
  const cleanId = String(studentId).trim();

  // 1. Fetch latest state from cloud/server first to ensure we add to the newest tally
  let baseData = currentData;
  try {
    const live = await fetchLiveElectionData();
    if (live.success && live.data && live.data.votes) {
      baseData = mergeElectionData(currentData, live.data);
    }
  } catch {}

  // 2. Calculate incremented votes
  const updatedVotes: Record<number, number> = { ...(baseData.votes || {}) };
  updatedVotes[num] = (updatedVotes[num] || 0) + 1;

  const existingVoted = Array.isArray(baseData.votedStudentIds) ? baseData.votedStudentIds : [];
  const updatedVotedIds = Array.from(new Set([...existingVoted, cleanId]));

  const updatedData: ElectionData = {
    year: baseData.year || currentData.year,
    candidates: baseData.candidates?.length ? baseData.candidates : currentData.candidates,
    votes: updatedVotes,
    votedStudentIds: updatedVotedIds,
    lastUpdated: Date.now(),
    resetTimestamp: baseData.resetTimestamp,
  };

  // 3. Post to local server if available
  try {
    fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: cleanId,
        voterName,
        candidateNumber: num,
      }),
    }).catch(() => {});
  } catch {}

  // 4. Broadcast to all clouds & broadcast channels
  await broadcastElectionData(updatedData);

  return updatedData;
}

export async function resetVotesLive(
  candidateList: Candidate[],
  year: string
): Promise<ElectionData> {
  const resetVotes: Record<number, number> = {};
  candidateList.forEach((c) => {
    resetVotes[c.number] = 0;
  });

  const now = Date.now();
  const resetData: ElectionData = {
    year,
    candidates: candidateList,
    votes: resetVotes,
    votedStudentIds: [],
    lastUpdated: now,
    resetTimestamp: now,
  };

  // 1. Local BroadcastChannel for instant same-device cross-tab update
  try {
    bc?.postMessage(resetData);
  } catch {}

  // 2. Local Express server update
  try {
    await fetch("/api/admin/reset-votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetTimestamp: now, votes: resetVotes }),
    });
  } catch (err) {
    console.warn("Local server reset failed or unreachable:", err);
  }

  // 3. Immediately update both Cloud relays with resetTimestamp
  try {
    await Promise.allSettled([
      updateCloudStore(CLOUD_PRIMARY_URL, resetData),
      updateCloudStore(CLOUD_BACKUP_URL, resetData),
    ]);
  } catch {}

  return resetData;
}

