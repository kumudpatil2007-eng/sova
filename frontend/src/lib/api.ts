import { Task, ModelRegistryItem, NetworkTelemetry, AuditLog, KnowledgeDocument } from "../types";

const API_BASE = "http://127.0.0.1:8000/api/v1";

async function ensureAuthHeader(): Promise<Record<string, string>> {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("sovereign_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    // Auto-authenticate with default MRPL engineer demo account if no session exists
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "engineer@mrpl.co.in", password: "mrpl2026" }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("sovereign_token", data.access_token);
        localStorage.setItem("sovereign_user", JSON.stringify(data.user));
        return { Authorization: `Bearer ${data.access_token}` };
      }
    } catch (e) {
      // Backend might be offline
    }
  }
  return {};
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Authentication failed");
    }
    const data = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem("sovereign_token", data.access_token);
      localStorage.setItem("sovereign_user", JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to get user profile");
    return res.json();
  },

  // Tasks
  async createTask(formData: FormData): Promise<Task> {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Network error connecting to FastAPI backend" }));
      throw new Error(err.detail || "Failed to create task");
    }
    return res.json();
  },

  async listTasks(): Promise<Task[]> {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/tasks`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

  async getTask(taskId: string): Promise<Task> {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to fetch task details");
    return res.json();
  },

  // Models
  async listModels(): Promise<ModelRegistryItem[]> {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/models`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to fetch models");
    return res.json();
  },

  async registerModel(modelData: any): Promise<ModelRegistryItem> {
    const authHeaders = await ensureAuthHeader();
    const headers = { "Content-Type": "application/json", ...authHeaders };
    const res = await fetch(`${API_BASE}/models`, {
      method: "POST",
      headers,
      body: JSON.stringify(modelData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to register model");
    }
    return res.json();
  },

  async dryRunRoute(prompt: string, hasAttachment: boolean): Promise<any> {
    const authHeaders = await ensureAuthHeader();
    const headers = { "Content-Type": "application/json", ...authHeaders };
    const res = await fetch(`${API_BASE}/models/route`, {
      method: "POST",
      headers,
      body: JSON.stringify({ prompt, has_attachment: hasAttachment }),
    });
    if (!res.ok) throw new Error("Failed to route model");
    return res.json();
  },

  // Knowledge
  async listDocuments(): Promise<KnowledgeDocument[]> {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/knowledge/documents`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
  },

  async searchKnowledge(query: string): Promise<any[]> {
    const authHeaders = await ensureAuthHeader();
    const headers = { "Content-Type": "application/json", ...authHeaders };
    const res = await fetch(`${API_BASE}/knowledge/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, top_k: 4 }),
    });
    if (!res.ok) throw new Error("Failed to query knowledge base");
    return res.json();
  },

  // Tools
  async listTools(): Promise<any[]> {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/tools`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to fetch tools");
    return res.json();
  },

  // Security & Audit
  async getNetworkTelemetry(): Promise<NetworkTelemetry> {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/security/network-telemetry`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to fetch security telemetry");
    return res.json();
  },

  async listAuditLogs(): Promise<AuditLog[]> {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/security/audit-logs`, {
      headers,
    });
    if (!res.ok) throw new Error("Failed to fetch audit logs");
    return res.json();
  },

  async verifyAirGap(): Promise<any> {
    const headers = await ensureAuthHeader();
    const res = await fetch(`${API_BASE}/security/verify-airgap`, {
      method: "POST",
      headers,
    });
    if (!res.ok) throw new Error("Failed to trigger air-gap verification");
    return res.json();
  },

  getDownloadUrl(filename: string): string {
    return `${API_BASE}/deliverables/download/${filename}`;
  }
};
