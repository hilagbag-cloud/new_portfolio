import { ImageResponse } from "next/og";

// Image metadata for Google Search and Browser Tabs
export const size = {
  width: 48,
  height: 48,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 28,
          background: "#0d110e",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9fff00",
          fontWeight: 900,
          fontFamily: "sans-serif",
          borderRadius: "10px",
          border: "2px solid #9fff00",
          boxShadow: "0 0 12px rgba(159, 255, 0, 0.4)",
        }}
      >
        H.
      </div>
    ),
    {
      ...size,
    }
  );
}
