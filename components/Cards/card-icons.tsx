import React from "react"

/*eslint-disable*/

interface CardIconProps {
  className?: string
}

// Individual icon components
export const IconWashing: React.FC<CardIconProps> = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="97"
    height="102"
    viewBox="0 0 97 102"
    fill="none"
  >
    <path
      d="M87 0H10C4.47715 0 0 4.47715 0 10V92C0 97.5229 4.47715 102 10 102H87C92.5229 102 97 97.5229 97 92V10C97 4.47715 92.5229 0 87 0Z"
      fill="white"
      fillOpacity="0.5"
    />
    <path
      d="M48.5 30C52.366 30 55.5 26.866 55.5 23C55.5 19.134 52.366 16 48.5 16C44.634 16 41.5 19.134 41.5 23C41.5 26.866 44.634 30 48.5 30Z"
      fill="white"
    />
    <path
      d="M71 23C71 25.7614 68.7614 28 66 28C63.2386 28 61 25.7614 61 23C61 20.2386 63.2386 18 66 18C68.7614 18 71 20.2386 71 23Z"
      fill="white"
    />
    <path
      d="M36 23C36 25.7614 33.7614 28 31 28C28.2386 28 26 25.7614 26 23C26 20.2386 28.2386 18 31 18C33.7614 18 36 20.2386 36 23Z"
      fill="white"
    />
    <path
      d="M48.5 86C62.5833 86 74 74.5833 74 60.5C74 46.4167 62.5833 35 48.5 35C34.4167 35 23 46.4167 23 60.5C23 74.5833 34.4167 86 48.5 86Z"
      fill="white"
    />
    <path
      d="M48.5 78C58.165 78 66 70.165 66 60.5C66 50.835 58.165 43 48.5 43C38.835 43 31 50.835 31 60.5C31 70.165 38.835 78 48.5 78Z"
      fill="#505ba3"
      fillOpacity="0.75"
    />
  </svg>
)

export const IconSuit: React.FC<CardIconProps> = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
    <path d="M50 10L20 22V86C20 89 22 92 25 92H75C78 92 80 89 80 86V22L50 10Z" fill="#494B8B" />
    <path d="M50 10L20 22V52L38 36L50 45V10Z" fill="#3A3D6E" />
    <path d="M50 10L80 22V52L62 36L50 45V10Z" fill="#3A3D6E" />
    <path d="M50 10L38 36L50 45L62 36L50 10Z" fill="white" />
    <path d="M50 45L45 50V72L50 78L55 72V50L50 45Z" fill="#2E3159" />
    <circle cx="36" cy="56" r="2.5" fill="white" />
    <circle cx="36" cy="68" r="2.5" fill="white" />
    <circle cx="36" cy="80" r="2.5" fill="white" />
    <rect x="57" y="40" width="12" height="8" rx="1" fill="white" opacity="0.8" />
  </svg>
)

export const IconIron: React.FC<CardIconProps> = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="111" height="64" viewBox="0 0 111 64" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 42H110C111.1 42 111.5 41.5 111.5 40.5V1C111.5 0 111 -0.5 110 -0.5C52 0.5 28 10 4 42Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 47H109C110.66 47 111.5 48.34 111.5 50V59C111.5 60.66 110.66 62 109 62H2C0.34 62 -0.5 60.34 0.5 59L3.5 48.5C3.83 47.5 4.83 47 5.83 47H4Z"
      fill="white"
      fillOpacity="0.5"
    />
  </svg>
)

export const IconWasher: React.FC<CardIconProps> = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
  >
    <path
      d="M97 10H20C14.4772 10 10 14.4772 10 20V100C10 105.523 14.4772 110 20 110H97C102.523 110 107 105.523 107 100V20C107 14.4772 102.523 10 97 10Z"
      fill="white"
      fillOpacity="0.3"
    />
    <path
      d="M58.5 38C62.366 38 65.5 34.866 65.5 31C65.5 27.134 62.366 24 58.5 24C54.634 24 51.5 27.134 51.5 31C51.5 34.866 54.634 38 58.5 38Z"
      fill="white"
    />
    <path
      d="M81 31C81 33.7614 78.7614 36 76 36C73.2386 36 71 33.7614 71 31C71 28.2386 73.2386 26 76 26C78.7614 26 81 28.2386 81 31Z"
      fill="white"
    />
    <path
      d="M46 31C46 33.7614 43.7614 36 41 36C38.2386 36 36 33.7614 36 31C36 28.2386 38.2386 26 41 26C43.7614 26 46 28.2386 46 31Z"
      fill="white"
    />
    <path
      d="M58.5 94C72.5833 94 84 82.5833 84 68.5C84 54.4167 72.5833 43 58.5 43C44.4167 43 33 54.4167 33 68.5C33 82.5833 44.4167 94 58.5 94Z"
      fill="white"
    />
    <path
      d="M58.5 86C68.165 86 76 78.165 76 68.5C76 58.835 68.165 51 58.5 51C48.835 51 41 58.835 41 68.5C41 78.165 48.835 86 58.5 86Z"
      fill="#E3B23C"
      fillOpacity="0.6"
    />
    <g transform="translate(112, 70) scale(-2.2, 2.2)">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#3A3D6E"
        strokeWidth={1.5}
        fill="#3A3D6E"
        d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
      />
    </g>
  </svg>
)

export const IconBedding: React.FC<CardIconProps> = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90" fill="none">
    <ellipse cx="45" cy="22" rx="27" ry="14" fill="white" />
    <ellipse cx="45" cy="22" rx="22" ry="11" fill="white" opacity="0.7" />

    <path
      d="M14 36 L14 50 Q14 54 18 54 L72 54 Q76 54 76 50 L76 36 Q76 32 72 32 L18 32 Q14 32 14 36 Z"
      fill="#EA5548"
    />
    <rect x="18" y="36" width="54" height="5" fill="#d94a3d" />

    <path
      d="M11 57 L11 72 Q11 76 15 76 L75 76 Q79 76 79 72 L79 57 Q79 54 75 54 L15 54 Q11 54 11 57 Z"
      fill="#494B8B"
    />
    <rect x="15" y="57" width="60" height="5" fill="#3a3c6e" />

    <rect x="7" y="76" width="76" height="7" rx="2" fill="white" opacity="0.9" />
    <rect x="4" y="83" width="82" height="3" rx="1.5" fill="white" opacity="0.7" />
  </svg>
)

export const IconTest: React.FC<CardIconProps> = ({ className = "" }) => (
<svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="97"
    height="102"
    viewBox="0 0 97 102"
    fill="none"
  >
    <path
      d="M87 0H10C4.47715 0 0 4.47715 0 10V92C0 97.5229 4.47715 102 10 102H87C92.5229 102 97 97.5229 97 92V10C97 4.47715 92.5229 0 87 0Z"
      fill="white"
      fillOpacity="0.5"
    />
  </svg>
)

// Map icon keys to components
const iconMap: Record<string, React.FC<CardIconProps>> = {
  icon_1: IconWashing,
  icon_2: IconSuit,
  icon_3: IconIron,
  icon_4: IconWasher,
  icon_5: IconBedding,
  icon_6: IconTest,
}

/**
 * Get card icon SVG by key and size
 * @param iconKey - Icon key (e.g., "icon_1") or null for default
 * @param isLarge - Whether to use large size (120x120) or small (64x74)
 */
export function getCardIcon(iconKey: string | null | undefined, isLarge: boolean) {
  const key = iconKey || "icon_1"
  const IconComponent = iconMap[key] || IconWashing

  const className = isLarge ? "mx-auto" : "mx-auto"
  return <IconComponent className={className} />
}

/**
 * Get list of available icons for admin selector
 */
export const AVAILABLE_ICONS = [
  { key: "icon_1", label: "Skalbimas" },
  { key: "icon_2", label: "Kostiumų valymas" },
  { key: "icon_3", label: "Lyginimas" },
  { key: "icon_4", label: "Skalbimo mašinų tvarkymas" },
  { key: "icon_5", label: "Patalinės valymas" },
  { key: "icon_6", label: "Test" },
]