import { SVGProps } from "react";

export default function DonBoscoLogo(props: SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 44, ...rest } = props;
  const deepBlue = "#1E293B"; // Use Tailwind slate-800 for elegant, crisp rendering

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
        {/* Bending text paths for top and bottom of the outer ring */}
        <path
          id="dbTopPath"
          d="M 22,100 A 78,78 0 0,1 178,100"
          fill="none"
        />
        <path
          id="dbBottomPath"
          d="M 22,100 A 78,78 0 0,0 178,100"
          fill="none"
        />
        {/* Mottos under Don Bosco's bust inside the center ring */}
        <path
          id="dbMottoPath"
          d="M 45,100 A 55,55 0 0,0 155,100"
          fill="none"
        />
      </defs>

      {/* 1. Outer Circles */}
      <circle cx="100" cy="100" r="98" stroke={deepBlue} strokeWidth="2" fill="#FFFFFF" />
      <circle cx="100" cy="100" r="94" stroke={deepBlue} strokeWidth="0.8" />

      {/* 2. Ring with labels */}
      {/* Top Label (School Name): วิทยาลัยเทคโนโลยีดอนบอสโกสุราษฎร์ */}
      <text fill={deepBlue} fontSize="11" fontWeight="bold" fontFamily="'Sarabun', sans-serif">
        <textPath href="#dbTopPath" startOffset="50%" textAnchor="middle">
          วิทยาลัยเทคโนโลยีดอนบอสโกสุราษฎร์
        </textPath>
      </text>

      {/* Bottom Label (Location): อำเภอเมือง จังหวัดสุราษฎร์ธานี */}
      <text fill={deepBlue} fontSize="10.5" fontWeight="bold" fontFamily="'Sarabun', sans-serif">
        <textPath href="#dbBottomPath" startOffset="50%" textAnchor="middle">
          อำเภอเมือง จังหวัดสุราษฎร์ธานี
        </textPath>
      </text>

      {/* 3. Left & Right Icons in the Ring */}
      {/* Left Icon: Open Book */}
      <g transform="translate(14, 88) scale(0.65)" stroke={deepBlue} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </g>

      {/* Right Icon: Crossed Hammer & Wrench */}
      <g transform="translate(170, 88) scale(0.7)" stroke={deepBlue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Hammer */}
        <path d="M-5 13 L5 3" stroke={deepBlue} />
        <path d="M2 1 L7 6 L4 9 L-1 4 Z" fill={deepBlue} stroke={deepBlue} />
        {/* Wrench */}
        <path d="M5 13 L-5 3" stroke={deepBlue} />
        <circle cx="-5" cy="3" r="3" fill="none" stroke={deepBlue} strokeWidth="2" />
        <path d="M-8 0 L-2 6" stroke={deepBlue} />
      </g>

      {/* 4. Center Blue Boundary Ring */}
      <circle cx="100" cy="100" r="66" stroke={deepBlue} strokeWidth="2.2" />

      {/* 5. Saint John Bosco Portrait Sketch in vector */}
      <g fill={deepBlue} stroke={deepBlue} strokeWidth="0.5">
        {/* Hair block & head contours */}
        <path d="
          M 90,40 
          C 80,41 73,48 73,55 
          C 71,59 74,68 75,70 
          C 72,71 70,74 71,78 
          C 72,82 75,83 77,81 
          C 77,86 80,94 82,97 
          C 84,99 85,93 85,90 
          C 88,96 92,106 96,108 
          C 96,114 98,124 94,129 
          L 106,129 
          C 114,124 116,110 114,104 
          C 116,103 118,99 120,95 
          C 122,91 123,83 121,79 
          C 123,77 125,73 125,70 
          C 125,66 123,65 121,66 
          C 123,55 118,48 112,43 
          C 107,39 96,39 90,40 Z
        " opacity="0.15" fill="#EEF2F6" /> {/* soft background behind face */}
        
        {/* Hair curls and shadow */}
        <path d="
          M 85,42 
          C 76,43 73,50 73,56 
          C 71,60 74,65 74,67 
          C 74,67 71,70 73,73 
          C 75,76 77,74 77,72 
          C 78,74 77,79 79,80 
          C 81,81 81,77 81,74
          C 83,72 84,65 83,62
          C 83,62 85,60 88,58
          C 92,57 95,59 93,54
          C 95,55 101,52 105,53
          C 110,55 111,59 111,62
          C 114,61 118,59 120,63
          C 122,66 120,70 120,72
          C 122,72 124,75 123,78
          C 122,81 120,80 119,77
          C 118,80 116,84 116,87
          C 116,90 118,91 119,90
          C 120,85 125,76 123,65
          C 121,54 115,46 109,42
          C 103,39 91,40 85,42 Z
        " />

        {/* Eyes, Nose, Smile Lines (the authentic sketchy look of Don Bosco) */}
        {/* Left eye/eyebrow */}
        <path d="M 83,68 C 86,67 89,68 91,70 L 92,69 C 89,66 85,65 82,67 Z" />
        <path d="M 85,71 A 1.8,1.8 0 1,1 88.6,71" />
        
        {/* Right eye/eyebrow */}
        <path d="M 111,68 C 108,67 105,68 103,70 L 102,69 C 105,66 109,65 112,67 Z" />
        <path d="M 106,71 A 1.8,1.8 0 1,1 109.6,71" />

        {/* Nose profile */}
        <path d="
          M 97,69
          Q 98,78 96,82
          Q 94,84 92,82
          M 96,82
          Q 99,84 102,81
        " stroke={deepBlue} strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cheerful Smile (Don Bosco is famous for his warm smile for youth) */}
        <path d="
          M 87,88 
          Q 97,94 107,88
          Q 104,97 97,97
          Q 90,97 87,88 Z
        " />
        {/* dimples/shadow around mouth */}
        <path d="M 84,87 C 86,88 85,91 84,91" stroke={deepBlue} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 110,87 C 108,88 109,91 110,91" stroke={deepBlue} strokeWidth="1.5" strokeLinecap="round" />

        {/* Face bounds/Ears & Chin lines */}
        <path d="M 77,72 C 77,78 79,83 80,85 C 81,87 81,90 82,91" stroke={deepBlue} strokeWidth="1.5" fill="none" />
        <path d="M 116,72 C 116,78 114,83 113,85 C 112,87 112,90 111,91" stroke={deepBlue} strokeWidth="1.5" fill="none" />
        <path d="M 90,101 Q 97,105 104,101" stroke={deepBlue} strokeWidth="2" fill="none" />

        {/* Clerical collar/Soutane coat shoulders */}
        <path d="
          M 80,105
          L 76,125
          L 118,125
          L 114,105
          Q 97,112 80,105 Z
        " />
        {/* White collar segment insert */}
        <rect x="94" y="107" width="12" height="7" fill="#FFFFFF" rx="1" />
      </g>

      {/* 6. Motto arc: "วินัย  ใฝ่คุณธรรม  นำฝีมือ" (with spacing to match image) */}
      <text fill={deepBlue} fontSize="7" fontWeight="bold" fontFamily="'Sarabun', sans-serif">
        <textPath href="#dbMottoPath" startOffset="50%" textAnchor="middle">
          วินัย  ใฝ่คุณธรรม  นำฝีมือ
        </textPath>
      </text>
    </svg>
  );
}
