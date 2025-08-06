// macOS Tahoe Cursor Set - Using actual macOS Tahoe cursors
export const cursors = {
  // Default cursor (arrow) - using without shadow version
  default: new URL("./Tail/Without Shadow/arrowNS.cur", import.meta.url).href,

  // Text cursor (beam) - using without shadow version
  text: new URL("./Tail/Without Shadow/beamNS.cur", import.meta.url).href,

  // Pointer cursor (link) - using without shadow version
  pointer: new URL("./Tail/Without Shadow/linkNS.cur", import.meta.url).href,

  // Move cursor - using without shadow version
  move: new URL("./Tail/Without Shadow/moveNS.cur", import.meta.url).href,

  // Resize cursors - using without shadow versions
  "resize-ns": new URL("./Tail/Without Shadow/VsizeNS.cur", import.meta.url)
    .href,
  "resize-ew": new URL("./Tail/Without Shadow/HsizeNS.cur", import.meta.url)
    .href,
  "resize-nwse": new URL("./Tail/Without Shadow/D1sizeNS.cur", import.meta.url)
    .href,
  "resize-nesw": new URL("./Tail/Without Shadow/D2sizeNS.cur", import.meta.url)
    .href,

  // Crosshair cursor - using without shadow version
  crosshair: new URL("./Tail/Without Shadow/crossNS.cur", import.meta.url).href,

  // Wait cursor - using without shadow version
  wait: new URL("./Tail/Without Shadow/BusyNS.ani", import.meta.url).href,

  // Not allowed cursor - using without shadow version
  "not-allowed": new URL("./Tail/Without Shadow/noNS.cur", import.meta.url)
    .href,

  // Grab cursors (using move for now) - using without shadow version
  grab: new URL("./Tail/Without Shadow/moveNS.cur", import.meta.url).href,
  grabbing: new URL("./Tail/Without Shadow/moveNS.cur", import.meta.url).href,

  // Help cursor - using without shadow version
  help: new URL("./Tail/Without Shadow/helpNS.cur", import.meta.url).href,

  // Copy cursor (using link for now) - using without shadow version
  copy: new URL("./Tail/Without Shadow/linkNS.cur", import.meta.url).href,

  // Alias cursor (using link for now) - using without shadow version
  alias: new URL("./Tail/Without Shadow/linkNS.cur", import.meta.url).href,

  // Context menu cursor (using link for now) - using without shadow version
  "context-menu": new URL("./Tail/Without Shadow/linkNS.cur", import.meta.url)
    .href,

  // Cell cursor (using cross for now) - using without shadow version
  cell: new URL("./Tail/Without Shadow/crossNS.cur", import.meta.url).href,

  // Vertical text cursor (using beam for now) - using without shadow version
  "vertical-text": new URL("./Tail/Without Shadow/beamNS.cur", import.meta.url)
    .href,

  // All scroll cursor (using move for now) - using without shadow version
  "all-scroll": new URL("./Tail/Without Shadow/moveNS.cur", import.meta.url)
    .href,

  // Progress cursor (using busy for now) - using without shadow version
  progress: new URL("./Tail/Without Shadow/BusyNS.ani", import.meta.url).href,

  // No drop cursor (using no for now) - using without shadow version
  "no-drop": new URL("./Tail/Without Shadow/noNS.cur", import.meta.url).href,

  // Row resize cursor (using Vsize for now) - using without shadow version
  "row-resize": new URL("./Tail/Without Shadow/VsizeNS.cur", import.meta.url)
    .href,

  // Column resize cursor (using Hsize for now) - using without shadow version
  "col-resize": new URL("./Tail/Without Shadow/HsizeNS.cur", import.meta.url)
    .href,

  // Zoom cursors (using link for now) - using without shadow version
  "zoom-in": new URL("./Tail/Without Shadow/linkNS.cur", import.meta.url).href,
  "zoom-out": new URL("./Tail/Without Shadow/linkNS.cur", import.meta.url).href,
};
