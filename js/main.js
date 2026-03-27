const SIZE = 100;
const DRAG_THRESHOLD = 5;

const source = document.getElementById("source");
const grid = document.getElementById("grid");
const free = document.getElementById("free");

let drag = null;

function randomColor() {
  return `hsl(${Math.random() * 360}, 50%, 50%)`;
}

function createSquare() {
  const square = document.createElement("div");
  square.className = "square";
  square.style.background = randomColor();
  square.dataset.zone = "";
  square.addEventListener("pointerdown", startDragExisting);
  return square;
}

function getRect(element) {
  return element.getBoundingClientRect();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isInsideZone(square, zone) {
  const s = getRect(square);
  const z = getRect(zone);

  const overlapWidth = Math.max(
    0,
    Math.min(s.right, z.right) - Math.max(s.left, z.left)
  );

  const overlapHeight = Math.max(
    0,
    Math.min(s.bottom, z.bottom) - Math.max(s.top, z.top)
  );

  const overlapArea = overlapWidth * overlapHeight;
  const squareArea = s.width * s.height;

  return overlapArea / squareArea >= 1;
}

function clearZoneHighlight() {
  grid.classList.remove("active");
  free.classList.remove("active");
}

function updateZoneHighlight() {
  clearZoneHighlight();

  if (!drag || !drag.started || !drag.el) return;

  if (isInsideZone(drag.el, grid)) {
    grid.classList.add("active");
    return;
  }

  if (isInsideZone(drag.el, free)) {
    free.classList.add("active");
  }
}

function moveDraggedSquare(clientX, clientY) {
  if (!drag || !drag.started || !drag.el) return;

  drag.el.style.left = `${clientX - drag.offsetX}px`;
  drag.el.style.top = `${clientY - drag.offsetY}px`;
}

function removeWithAnimation(el) {
  el.classList.add("fade-out");

  setTimeout(() => {
    el.remove();
  }, 200);
}

function layoutGrid() {
  const squares = Array.from(grid.querySelectorAll(".square"));
  const cols = Math.floor(grid.clientWidth / SIZE);

  squares.forEach((square, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    square.style.left = `${col * SIZE}px`;
    square.style.top = `${row * SIZE}px`;
    square.dataset.zone = "grid";
  });
}

function cleanupDrag() {
  if (!drag) return;

  if (drag.el) {
    drag.el.classList.remove("dragging");
  }

  clearZoneHighlight();
  drag = null;
}

function beginDragFromSource() {
  if (!drag || drag.started || drag.kind !== "source") return;

  const square = createSquare();
  document.body.appendChild(square);

  drag.el = square;
  drag.offsetX = SIZE / 2;
  drag.offsetY = SIZE / 2;
  drag.started = true;

  square.classList.add("dragging");
  moveDraggedSquare(drag.startXCurrent, drag.startYCurrent);
}

function beginDragExisting() {
  if (!drag || drag.started || drag.kind !== "existing") return;

  const rect = getRect(drag.el);

  document.body.appendChild(drag.el);
  drag.el.style.left = `${rect.left}px`;
  drag.el.style.top = `${rect.top}px`;
  drag.el.classList.add("dragging");
  drag.started = true;

  if (drag.fromZone === "grid") {
    layoutGrid();
  }
}

source.addEventListener("pointerdown", (event) => {
  event.preventDefault();

  drag = {
    kind: "source",
    el: null,
    pointerId: event.pointerId,
    offsetX: 0,
    offsetY: 0,
    fromZone: "source",
    startX: event.clientX,
    startY: event.clientY,
    startXCurrent: event.clientX,
    startYCurrent: event.clientY,
    started: false
  };
});

function startDragExisting(event) {
  event.preventDefault();

  const square = event.currentTarget;
  const rect = getRect(square);

  drag = {
    kind: "existing",
    el: square,
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    fromZone: square.dataset.zone || "",
    startX: event.clientX,
    startY: event.clientY,
    startXCurrent: event.clientX,
    startYCurrent: event.clientY,
    started: false
  };
}

window.addEventListener("pointermove", (event) => {
  if (!drag || drag.pointerId !== event.pointerId) return;

  drag.startXCurrent = event.clientX;
  drag.startYCurrent = event.clientY;

  const dx = Math.abs(event.clientX - drag.startX);
  const dy = Math.abs(event.clientY - drag.startY);

  if (!drag.started && (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD)) {
    if (drag.kind === "source") {
      beginDragFromSource();
    } else {
      beginDragExisting();
    }
  }

  if (!drag.started) return;

  moveDraggedSquare(event.clientX, event.clientY);
  updateZoneHighlight();
});

window.addEventListener("pointerup", (event) => {
  if (!drag || drag.pointerId !== event.pointerId) return;

  if (!drag.started) {
    cleanupDrag();
    return;
  }

  const el = drag.el;

  if (isInsideZone(el, grid)) {
    grid.appendChild(el);
    layoutGrid();
    cleanupDrag();
    return;
  }

  if (isInsideZone(el, free)) {
    const squareRect = getRect(el);
    const freeRect = getRect(free);

    let left = squareRect.left - freeRect.left;
    let top = squareRect.top - freeRect.top;

    left = clamp(left, 0, free.clientWidth - SIZE);
    top = clamp(top, 0, free.clientHeight - SIZE);

    free.appendChild(el);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.dataset.zone = "free";

    cleanupDrag();
    return;
  }

  if (drag.fromZone === "grid") {
    layoutGrid();
  }

  removeWithAnimation(el);
  cleanupDrag();
});

window.addEventListener("pointercancel", () => {
  if (!drag) return;

  if (drag.started && drag.el) {
    if (drag.fromZone === "grid") {
      layoutGrid();
    }

    removeWithAnimation(drag.el);
  }

  cleanupDrag();
});