import { KeyEvent } from "@opentui/core";

export function matchesAngularModifier(mod: string, key: KeyEvent): boolean {
  switch (mod) {
    case "alt":
      return key.meta;     // Alt on Linux/Win, Option on mac
    case "meta":
      return key.option;   // Command on mac (if terminal passes it)
    case "control":
      return key.ctrl;
    case "shift":
      return key.shift;
    default:
      return false;
  }
}

export function normalizeKey(key: string): string {
  if (key === "esc") return "escape";
  if (key === " ") return "space";
  if (key === ".") return "dot";
  return key;
}

export interface ParsedKeyEvent {
  domEventName: "keydown" | "keyup";
  fullKey: string;
}

export function parseAngularKeyEventName(eventName: string): ParsedKeyEvent | null {
  const parts = eventName.toLowerCase().split(".");
  const domEventName = parts.shift();

  if (!domEventName || (domEventName !== "keydown" && domEventName !== "keyup")) {
    return null;
  }

  const key = normalizeKey(parts.pop()!);
  if (!key) return null;

  let fullKey = "";
  const MODIFIERS = ["alt", "control", "meta", "shift"];

  // Handle "code" prefix
  const codeIndex = parts.indexOf("code");
  if (codeIndex > -1) {
    parts.splice(codeIndex, 1);
    fullKey = "code.";
  }

  // Add modifiers in canonical order
  for (const mod of MODIFIERS) {
    const ix = parts.indexOf(mod);
    if (ix > -1) {
      parts.splice(ix, 1);
      fullKey += mod + ".";
    }
  }

  // If anything is left, it's invalid
  if (parts.length !== 0) return null;

  fullKey += key;

  return { domEventName, fullKey };
}

export function matchOpenTuiKey(key: KeyEvent, fullKey: string): boolean {
  let keycode = key.name.toLowerCase();

  // If Angular used "code.", use event.code instead of event.key
  if (fullKey.startsWith("code.") && key.code) {
    keycode = key.code.toLowerCase();
  }

  if (!keycode) return false;
  if (keycode === " ") keycode = "space";
  if (keycode === ".") keycode = "dot";

  let composed = "";

  // Angular modifier semantics
  if (key.ctrl) composed += "control.";
  if (key.shift) composed += "shift.";
  if (key.meta) composed += "alt.";     // Angular "alt"
  if (key.option) composed += "meta.";  // Angular "meta"

  composed += keycode;

  return composed === fullKey;
}
