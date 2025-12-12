import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5v.5a4.5 4.5 0 0 0-4.5 4.5v3a4.5 4.5 0 0 0 4.5 4.5h1.5" />
      <path d="M12 2a4.5 4.5 0 0 1 4.5 4.5v.5a4.5 4.5 0 0 1 4.5 4.5v3a4.5 4.5 0 0 1-4.5 4.5h-1.5" />
      <path d="M12 14v-1.5a4.5 4.5 0 0 0-4.5-4.5 4.5 4.5 0 0 0-4.5 4.5V14" />
      <path d="M12 14v-1.5a4.5 4.5 0 0 1 4.5-4.5 4.5 4.5 0 0 1 4.5 4.5V14" />
      <path d="M12 22v-3" />
      <path d="M7 18.5v-3" />
      <path d="M17 18.5v-3" />
      <circle cx="12" cy="14" r="2.5" />
      <circle cx="7" cy="15.5" r="1.5" />
      <circle cx="17" cy="15.5" r="1.5" />
    </svg>
  );
}
