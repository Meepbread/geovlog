const BASE = import.meta.env.VITE_API_URL;

export async function fetchPins() {
  const res = await fetch(`${BASE}/pins/`);
  if (!res.ok) throw new Error("Failed to fetch pins");
  return res.json();
}

export async function createPin(data) {
  const res = await fetch(`${BASE}/pins/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create pin");
  return res.json();
}

export async function deletePin(id) {
  const res = await fetch(`${BASE}/pins/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete pin");
}