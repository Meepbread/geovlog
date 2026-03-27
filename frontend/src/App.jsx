import { useState } from "react";
import Map from "./components/Map";
import PinSidebar from "./components/PinSidebar";

export default function App() {
  const [selectedPin, setSelectedPin] = useState(null);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Map onPinSelect={setSelectedPin} />
      <PinSidebar
        pin={selectedPin}
        onClose={() => setSelectedPin(null)}
        onDelete={() => setSelectedPin(null)}
      />
    </div>
  );
}