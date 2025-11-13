import type { Camp, CampUpsert } from "@/lib/validations/camp";

const API_BASE = "/api/camps";

export async function getCamps(): Promise<Camp[]> {
  const response = await fetch(API_BASE);

  if (!response.ok) {
    throw new Error(`Failed to fetch camps: ${response.statusText}`);
  }

  return response.json();
}

export async function getCamp(name: string): Promise<Camp> {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(name)}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Camp not found");
    }
    throw new Error(`Failed to fetch camp: ${response.statusText}`);
  }

  return response.json();
}

export async function upsertCamp(
  name: string,
  campData: CampUpsert
): Promise<Camp> {
  // Get admin secret from localStorage
  const adminSecret = typeof window !== "undefined" 
    ? localStorage.getItem("adminSecret") 
    : null;

  const response = await fetch(`${API_BASE}/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(adminSecret && { "x-admin-secret": adminSecret }),
    },
    body: JSON.stringify(campData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Invalid or missing admin credentials");
    }
    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(
        `Validation failed: ${JSON.stringify(errorData.errors)}`
      );
    }
    throw new Error(`Failed to upsert camp: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteCamp(name: string): Promise<void> {
  // Get admin secret from localStorage
  const adminSecret = typeof window !== "undefined" 
    ? localStorage.getItem("adminSecret") 
    : null;

  const response = await fetch(`${API_BASE}/${encodeURIComponent(name)}`, {
    method: "DELETE",
    headers: {
      ...(adminSecret && { "x-admin-secret": adminSecret }),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Invalid or missing admin credentials");
    }
    if (response.status === 404) {
      throw new Error("Camp not found");
    }
    throw new Error(`Failed to delete camp: ${response.statusText}`);
  }
}

