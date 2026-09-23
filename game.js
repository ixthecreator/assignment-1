// import rulesss
import { offset, restored, visibleOffsets } from "./rules.mjs?v=minimal-1";

// turn elements into array
const board = document.querySelector(".collage");
const artwork = document.getElementById("artwork");
const pieces = [...document.querySelectorAll(".movable")];
// data-start as the original position of each piece, convert to number and store in array; storage-key is the key for localStorage
const starts = pieces.map((piece) => Number(piece.dataset.start));
const key = document.body.dataset.storageKey;
// read the saved data from localStorage, if any; if parsing fails, raw will be null; and turn into state; if raw is null, use starts as the initial position
let raw = null;
try {
  raw = JSON.parse(localStorage.getItem(key));
} catch {
  /* when saved data fails; original */
}
let state = restored(raw, starts);
let drag = null;

// transitionend event: when the transition ends, remove the transition style; this is to avoid transition when dragging
function renderPositions() {
  const scale = board.getBoundingClientRect().width / 1536;
  visibleOffsets(state).forEach((value, i) => {
    // fragment found, save it as --dy。
    pieces[i]
      .closest(".fragment")
      .style.setProperty("--dy", `${value * scale}px`);
  });
}
// read the ratio in css
function fitArtwork() {
  const [width, height] = getComputedStyle(board)
    .getPropertyValue("--ratio")
    .trim()
    .split("/")
    .map(Number);
  // take the smaller of the two dimensions, and set it as --fit-width; this is to make sure the collage fits within the artwork container
  board.style.setProperty(
    "--fit-width",
    `${Math.min(artwork.clientWidth, (artwork.clientHeight * width) / height)}px`,
  );
  renderPositions();
}
// marks the state as inactive and finished, and saves it to localStorage; if saving fails, the current position is still retained for this session
function save() {
  state.active = false;
  state.finished = true;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* when save fails, retain the current position for this session */
  }
}
// the end of a drag operation: if there is a drag, release the pointer capture and save the state
function endDrag() {
  if (!drag) return;
  const { piece, id } = drag;
  drag = null;
  if (piece.hasPointerCapture(id)) piece.releasePointerCapture(id);
  save();
}
// button register: when clicked, reset the state to the original position and save it
pieces.forEach((piece, i) => {
  piece.disabled = false;
  piece.addEventListener("pointerdown", (event) => {
    // only handle left mouse button; ignore other pointer types and buttons
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    event.preventDefault();
    endDrag();
    // record the initial position of the piece and the pointer, and calculate the scale factor based on the board width; this is to convert screen distance to design distance
    drag = {
      piece,
      i,
      id: event.pointerId,
      y: event.clientY,
      value: state.offsets[i],
      scale: board.getBoundingClientRect().width / 1536,
    };
    // capture the pointer to receive pointer events even if the pointer moves outside the element
    piece.setPointerCapture(event.pointerId);
  });
  // when moving
  piece.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId || drag.i !== i) return;
    state.offsets[i] = offset(
      drag.value + (event.clientY - drag.y) / drag.scale,
    );
    renderPositions();
  });
  // end of drag: when the pointer is released, cancelled, or lost capture, end the drag operation
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
    piece.addEventListener(type, endDrag);
});
// whne the window loses focus or the page is hidden, end the drag operation; this is to avoid leaving a piece in a dragged state when switching tabs or minimizing the window
window.addEventListener("blur", endDrag);
window.addEventListener("pagehide", endDrag);
// relocate the pieces when the page is shown, if the page was restored from the back/forward cache; if parsing fails, retain the current state
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    try {
      state = restored(JSON.parse(localStorage.getItem(key)), starts);
    } catch {
      /* status saved when failure */
    }
  }
  fitArtwork();
});
// resize observer: when the artwork or board is resized, recalculate the size and position of the pieces; this is to make sure the collage fits within the artwork container and the pieces are positioned correctly
new ResizeObserver(fitArtwork).observe(artwork);
new ResizeObserver(renderPositions).observe(board);
fitArtwork();
