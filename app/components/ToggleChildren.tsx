'use client';

import { useSyncExternalStore } from "react";
import type { default as React, ReactNode } from "react";

const toggles: Record<string, boolean> = {};
const listeners = new Set<() => void>();

let cachedSnapshot: Record<string, boolean> = {};
let hasUpdate = false;

function setToggle(id: string) {
  hasUpdate = true;

  toggles[id] = !toggles[id];
  listeners.forEach(fn => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): Record<string, boolean> {
  if (hasUpdate) {
    hasUpdate = false;
    // Return a shallow copy to trigger updates
    cachedSnapshot = { ...toggles };
  }

  return cachedSnapshot;
}

function getServerSnapshot(): Record<string, boolean> {
  return cachedSnapshot;
}

// Hook to use toggle state for a given id
function useToggle(id: string) {
  const allToggles = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return allToggles[id] ?? false;
}

// ToggleMaster: shows children if toggle is true
export const ToggleChildren: React.FC<{ id: string; children: ReactNode }> = ({ id, children }) => {
  const isOn = useToggle(id);
  return isOn ? <>{children}</> : null;
};

type ToggleButtonProps = {
  id: string;
  children?: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>; // <-- add standard button props

export const ToggleButton: React.FC<ToggleButtonProps> = ({ id, children, ...rest }) => {
  const isOn = useToggle(id);

  return (
    <button onClick={() => setToggle(id)} {...rest}>
      {children ?? (isOn ? "Hide" : "Show")}
    </button>
  );
};
