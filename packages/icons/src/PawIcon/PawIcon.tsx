import { ComponentProps } from "react";

export const PawIcon = (props: ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M11 20c-3 0-5.5-2.5-6-5s3-6 7-6 7 3.5 7 6-3 5-8 5z" />
    <circle cx="7" cy="8" r="2.5" />
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="17" cy="8" r="2.5" />
  </svg>
);
