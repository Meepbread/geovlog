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

export async function getPresignedUrl(pinId, filename) {
  const res = await fetch(`${BASE}/videos/presigned-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin_id: pinId, filename }),
  });
  if (!res.ok) throw new Error("Failed to get upload URL");
  return res.json();
}

export async function confirmUpload(pinId, objectKey) {
  const res = await fetch(
    `${BASE}/videos/confirm?pin_id=${pinId}&object_key=${encodeURIComponent(objectKey)}`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to confirm upload");
  return res.json();
}

export async function uploadVideoToS3(uploadUrl, file) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4" },
    body: file,
  });
  if (!res.ok) throw new Error("Failed to upload to S3");
}