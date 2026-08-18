import { statusOf } from "../lib/status.js";
import { FILL, TONE } from "./tone.js";

export default function StatusPill({ value }) {
  const { label, tone } = statusOf(value);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] leading-none font-bold whitespace-nowrap ${TONE[tone]}`}
    >
      <span className={`inline-block size-1.5 rounded-full ${FILL[tone]}`} aria-hidden="true" />
      {label}
    </span>
  );
}
