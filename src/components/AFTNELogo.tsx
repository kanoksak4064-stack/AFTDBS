import { SVGProps } from "react";

export default function AFTNELogo(props: SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 44, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
      {...rest}
    >
      <defs>
        {/* Curving text paths */}
        <path
          id="textPathTop"
          d="M 28,100 A 72,72 0 0,1 172,100"
          fill="none"
        />
        <path
          id="textPathBottom"
          d="M 28,100 A 72,72 0 0,0 172,100"
          fill="none"
        />
        {/* Gold gradient for realistic texture */}
        <linearGradient id="goldGrad" x1="100" y1="50" x2="100" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#F5C518" />
          <stop offset="100%" stopColor="#D4A017" />
        </linearGradient>
      </defs>

      {/* 1. Outer thin border */}
      <circle cx="100" cy="100" r="98" stroke="#334155" strokeWidth="1.5" fill="#FFFFFF" />

      {/* 2. Inner border split */}
      <circle cx="100" cy="100" r="76" stroke="#F5C518" strokeWidth="2" />

      {/* 3. Text around border */}
      {/* Thai Top Text */}
      <text fill="#0F172A" fontSize="10.5" fontWeight="bold" fontFamily="'Sarabun', sans-serif">
        <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
          องค์การนักวิชาชีพในอนาคตแห่งประเทศไทย
        </textPath>
      </text>

      {/* English Bottom Text */}
      <text fill="#1E293B" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
        <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
          ASSOCIATION OF FUTURE THAI PROFESSIONAL
        </textPath>
      </text>

      {/* Decorative dots in the text ring */}
      <circle cx="21" cy="100" r="2.5" fill="#F5C518" stroke="#0F172A" strokeWidth="0.5" />
      <circle cx="179" cy="100" r="2.5" fill="#F5C518" stroke="#0F172A" strokeWidth="0.5" />

      {/* 4. Core red circle */}
      <circle cx="100" cy="100" r="70" fill="#CE1C1C" />
      <circle cx="100" cy="100" r="69" stroke="#F5C518" strokeWidth="1.5" />

      {/* 5. Centered Golden Sacred Stupa, Dharmachakra Wheel, & Kranok Wings */}
      {/* Centered Dharmachakra Wheel */}
      <circle cx="100" cy="74" r="14" stroke="url(#goldGrad)" strokeWidth="3" fill="#CE1C1C" />
      <circle cx="100" cy="74" r="5" fill="url(#goldGrad)" />
      
      {/* Wheel Spokes */}
      <line x1="100" y1="60" x2="100" y2="88" stroke="url(#goldGrad)" strokeWidth="1.5" />
      <line x1="86" y1="74" x2="114" y2="74" stroke="url(#goldGrad)" strokeWidth="1.5" />
      <line x1="90" y1="64" x2="110" y2="84" stroke="url(#goldGrad)" strokeWidth="1.5" />
      <line x1="90" y1="84" x2="110" y2="64" stroke="url(#goldGrad)" strokeWidth="1.5" />

      {/* Left and Right Flame/Kranok decorations */}
      {/* Left Wing */}
      <path
        d="M 80,116 C 75,100 68,85 75,70 C 76,68 78,72 78,74 C 74,86 81,96 85,108 C 83,110 81,113 80,116 Z"
        fill="url(#goldGrad)"
      />
      <path
        d="M 84,124 C 74,115 63,101 61,84 C 60,80 63,82 64,84 C 64,96 72,109 81,118 C 82,120 83,122 84,124 Z"
        fill="url(#goldGrad)"
      />
      
      {/* Right Wing */}
      <path
        d="M 120,116 C 125,100 132,85 125,70 C 124,68 122,72 122,74 C 126,86 119,96 115,108 C 117,110 119,113 120,116 Z"
        fill="url(#goldGrad)"
      />
      <path
        d="M 116,124 C 126,115 137,101 139,84 C 140,80 137,82 136,84 C 136,96 128,109 119,118 C 118,120 117,122 116,124 Z"
        fill="url(#goldGrad)"
      />

      {/* Stupa body / pedestal connecting the stupa to the base */}
      <path
        d="M 94,88 L 106,88 L 108,120 L 92,120 Z"
        fill="url(#goldGrad)"
        stroke="#A47B11"
        strokeWidth="0.5"
      />
      <path
        d="M 86,120 L 114,120 L 111,126 L 89,126 Z"
        fill="url(#goldGrad)"
        stroke="#A47B11"
        strokeWidth="0.5"
      />
      {/* Dome Top Point above wheel */}
      <path
        d="M 100,50 L 97,60 L 103,60 Z"
        fill="url(#goldGrad)"
      />

      {/* Inner Central Flame Pillar below Wheel */}
      <path
        d="M 100,82 L 95,98 L 100,114 L 105,98 Z"
        fill="url(#goldGrad)"
        opacity="0.85"
      />

      {/* "ท.ส.นิ.ม." label in gold */}
      <text
        x="100"
        y="138"
        fill="url(#goldGrad)"
        fontSize="6.5"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="'Sarabun', sans-serif"
      >
        ท. ส. นิ. ม.
      </text>

      {/* "อ ว ท." label in gold */}
      <text
        x="100"
        y="156"
        fill="url(#goldGrad)"
        fontSize="16"
        fontWeight="800"
        textAnchor="middle"
        fontFamily="'Sarabun', sans-serif"
      >
        อ ว ท.
      </text>
    </svg>
  );
}
