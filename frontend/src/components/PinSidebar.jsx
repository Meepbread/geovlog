import { deletePin } from "../api/pins";

export default function PinSidebar({ pin, onClose, onDelete }) {
  if (!pin) return null;

  async function handleDelete() {
    if (!confirm(`Delete "${pin.title}"?`)) return;
    await deletePin(pin.id);
    onDelete(pin.id);
    onClose();
  }

  return (
    <div style={{
      position: "absolute", top: 0, right: 0, zIndex: 20,
      width: 300, height: "100vh",
      background: "white", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
      padding: 24, boxSizing: "border-box",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <button onClick={onClose} style={{
        alignSelf: "flex-end", background: "none",
        border: "none", fontSize: 20, cursor: "pointer", color: "#888",
      }}>x</button>

      <h2 style={{ margin: 0, fontSize: 20, color: "#1e1e2e" }}>{pin.title}</h2>

      {pin.description && (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{pin.description}</p>
      )}

      <div style={{ fontSize: 12, color: "#888" }}>
        <div>Lat: {pin.latitude.toFixed(5)}</div>
        <div>Lng: {pin.longitude.toFixed(5)}</div>
        <div>Added: {new Date(pin.created_at).toLocaleDateString()}</div>
      </div>

      <button onClick={handleDelete} style={{
        marginTop: "auto", padding: "10px", borderRadius: 8,
        border: "none", background: "#fee2e2", color: "#ef4444",
        fontWeight: 600, cursor: "pointer",
      }}>
        Delete pin
      </button>
    </div>
  );
}