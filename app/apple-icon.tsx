import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0c",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 64 64">
          <polyline
            points="15,20 29,32 15,44"
            fill="none"
            stroke="#c6f43f"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="34" y="41" width="16" height="7" rx="2.5" fill="#c6f43f" />
        </svg>
      </div>
    ),
    size,
  );
}
