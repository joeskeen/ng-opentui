export function isFlagTrue(value: number, flag: number): boolean {
  return (value & flag) === flag;
}

export function setFlagTrue(value: number, flag: number): number {
  return value | flag;
}

export function setFlagFalse(value: number, flag: number): number {
  return value & ~flag;
}

export function setFlagTo(value: number, flag: number, enabled: boolean): number {
  return enabled ? setFlagTrue(value, flag) : setFlagFalse(value, flag);
}

export function toggleFlag(value: number, flag: number): number {
  return value ^ flag;
}
