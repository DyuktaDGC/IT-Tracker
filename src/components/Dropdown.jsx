import { useCallback, useEffect, useId, useRef, useState } from "react";

const Chevron = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    className={`text-muted pointer-events-none size-3.5 flex-none transition-transform ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 8l4 4 4-4" />
  </svg>
);

const Check = () => (
  <svg
    viewBox="0 0 20 20"
    className="size-3.5 flex-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
  </svg>
);

export default function Dropdown({ label, icon, value, options, onChange, disabled = false }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const list = useRef(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex];

  const close = useCallback((focusButton = true) => {
    setOpen(false);
    if (focusButton) root.current?.querySelector("button")?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openAt = (index) => {
    setActive(index);
    setOpen(true);
  };

  const commit = (index) => {
    onChange(options[index].value);
    close();
  };

  const onKeyDown = (event) => {
    const { key } = event;
    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
        event.preventDefault();
        openAt(selectedIndex);
      }
      return;
    }
    if (key === "Escape") {
      event.preventDefault();
      close();
    } else if (key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(options.length - 1, current + 1));
    } else if (key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(0, current - 1));
    } else if (key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (key === "End") {
      event.preventDefault();
      setActive(options.length - 1);
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      commit(active);
    } else if (key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={root} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button"
        id={`${id}-button`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => (open ? close(false) : openAt(selectedIndex))}
        className={`border-line bg-surface text-ink flex w-full items-center gap-2 rounded-xl border py-2 pr-2.5 pl-3 text-[12.5px] font-bold tracking-wide uppercase disabled:opacity-50 ${
          open ? "border-accent" : "hover:border-accent"
        }`}
      >
        {icon && <span className="text-muted">{icon}</span>}
        <span className="mr-auto truncate">{selected?.label ?? ""}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <ul
          ref={list}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-button`}
          aria-activedescendant={`${id}-option-${active}`}
          className="border-line bg-surface absolute top-full left-0 z-30 mt-1.5 max-h-72 min-w-full overflow-auto rounded-xl border p-1 shadow-xl shadow-black/20"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  data-active={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => commit(index)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-semibold tracking-wide whitespace-nowrap uppercase ${
                    index === active ? "bg-accent-bg text-accent-ink" : "text-ink-2"
                  }`}
                >
                  <span className={isSelected ? "text-accent-ink" : "text-transparent"}>
                    <Check />
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
