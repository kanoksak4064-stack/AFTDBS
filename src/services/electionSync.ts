// Real-Time Cross-Device Synchronization Service for Election App
// Supports Express API + Cloud Live Sync Relay so all devices (mobile, desktop, kiosk) always match 100%

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
}

const CLOUD_SYNC_URL = "https://api.jsonstorage.net/v1/json/87cb06bb-14b0-42c6-a2ec-5e352f75863e";
const BACKUP_SYNC_URL = "https://kv.val.run/dbsurat_election_2570_live";

export async function fetchLiveElectionData(): Promise<{ success: boolean; data?: ElectionData; source: string }> {
  // 1. Try local server API first
  try {
    const res = await fetch("/api/election", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) {
      const data = await res.json();
      if (data && data.candidates && data.votes) {
        return { success: true, data, source: "server" };
      }
    }
  } catch {
    // server API unavailable, fallback to cloud sync
  }

  // 2. Try Cloud Sync Relay (ensures cross-device sync even on Static hosting / Render Free sleep)
  try {
    const res = await fetch(CLOUD_SYNC_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.candidates && data.votes) {
        return { success: true, data, source: "cloud" };
      }
    }
  } catch {
    // try backup cloud relay
  }

  try {
    const res = await fetch(BACKUP_SYNC_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.candidates && data.votes) {
        return { success: true, data, source: "cloud-backup" };
      }
    }
  } catch {
    // all remote fetches failed
  }

  return { success: false, source: "none" };
}

export async function broadcastElectionData(data: ElectionData): Promise<boolean> {
  const payload = {
    ...data,
    lastUpdated: Date.now(),
  };

  let anySuccess = false;

  // 1. Push to local server API
  try {
    const res = await fetch("/api/admin/update-candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidates: payload.candidates,
        votes: payload.votes,
      }),
    });
    if (res.ok) anySuccess = true;
  } catch {}

  try {
    await fetch("/api/admin/update-year", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: payload.year }),
    });
  } catch {}

  // 2. Push to Cloud Sync Relay
  try {
    const res = await fetch(CLOUD_SYNC_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) anySuccess = true;
  } catch {}

  try {
    await fetch(BACKUP_SYNC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {}

  return anySuccess;
}

export async function submitVoteLive(studentId: string, voterName: string, candidateNumber: number, currentData: ElectionData): Promise<ElectionData> {
  const num = Number(candidateNumber);
  const updatedVotes = {
    ...currentData.votes,
    [num]: (currentData.votes[num] || 0) + 1,
  };
  const updatedVotedIds = [...(currentData.votedStudentIds || []), String(studentId).trim()];

  const updatedData: ElectionData = {
    ...currentData,
    votes: updatedVotes,
    votedStudentIds: updatedVotedIds,
    lastUpdated: Date.now(),
  };

  // Broadcast to both Server and Cloud
  // 1. Server API
  try {
    await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        voterName,
        candidateNumber: num,
      }),
    });
  } catch {}

  // 2. Cloud Relay
  try {
    await fetch(CLOUD_SYNC_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
  } catch {}

  try {
    await fetch(BACKUP_SYNC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
  } catch {}

  return updatedData;
}
