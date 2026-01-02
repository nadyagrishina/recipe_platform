type Props = {
  className?: string;
};

export function TimerIcon({ className }: Props) {
  return (
    <svg
      viewBox="-20 -20 600 600"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M464 256a208 208 0 1 1 -416 0
           208 208 0 1 1 416 0z
           M0 256a256 256 0 1 0 512 0
           256 256 0 1 0 -512 0z
           M232 120l0 136c0 8 4 15.5 10.7 20l96 64
           c11 7.4 25.9 4.4 33.3-6.7
           s4.4-25.9-6.7-33.3L280 243.2
           280 120c0-13.3-10.7-24-24-24
           s-24 10.7-24 24z"
        fill="currentColor"
      />
    </svg>
  );
}
