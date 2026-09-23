export const LIMIT = 96;
export function offset(value) {
  return Number.isFinite(value) ? Math.max(-LIMIT, Math.min(LIMIT, value)) : 0;
}
export function restored(raw, starts) {
  const fallback = { offsets: [...starts], active: false, finished: false };
  if (
    !raw ||
    !Array.isArray(raw.offsets) ||
    raw.offsets.length !== starts.length ||
    raw.offsets.some((v) => !Number.isFinite(v) || Math.abs(v) > LIMIT) ||
    typeof raw.active !== "boolean"
  )
    return fallback;
  // Existing saves remain valid; the retired solved field is deliberately ignored.
  return {
    offsets: [...raw.offsets],
    active: raw.active,
    finished: raw.finished === true,
  };
}
export function finishAdjustment(state) {
  return {
    ...state,
    offsets: [...state.offsets],
    active: false,
    finished: true,
  };
}
export function visibleOffsets(state) {
  return [...state.offsets];
}
