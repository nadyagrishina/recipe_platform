// HeartIcon.tsx
type Props = {
  filled?: boolean;
  className?: string;
};

export function HeartIcon({ filled = false, className }: Props) {
  return (
    <svg
      viewBox="-20 -20 552 552"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32
           452.4 32 512 91.6 512 165.1l0 2.6
           c0 112.2-139.9 242.5-212.9 298.2
           -12.4 9.4-27.6 14.1-43.1 14.1
           s-30.8-4.6-43.1-14.1
           C139.9 410.2 0 279.9 0 167.7l0-2.6
           C0 91.6 59.6 32 133.1 32
           175.8 32 216 52.5 241 87.1z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="32"
      />
    </svg>
  );
}
