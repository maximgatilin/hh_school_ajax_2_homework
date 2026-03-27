"use strict";

const source = document.querySelector(".source");
const gridZone = document.querySelector(".target-grid");
const freeZone = document.querySelector(".target-free");

let currentDrag = null;

function createElement() {
  const el = document.createElement("div");

  el.className = "drag-element dragging";
  el.style.backgroundColor = getRandomColor();

  document.body.append(el);

  return el;
}

function moveElement(el, point) {
  const width = el.offsetWidth;
  const height = el.offsetHeight;

  el.style.left = point.x - width / 2 + "px";
  el.style.top = point.y - height / 2 + "px";
}

function clearHighlight() {
  gridZone.classList.remove("zone-active");
  freeZone.classList.remove("zone-active");
}

function updateHighlight(point) {
  clearHighlight();

  if (isInside(point, gridZone)) {
    gridZone.classList.add("zone-active");
  } else if (isInside(point, freeZone)) {
    freeZone.classList.add("zone-active");
  }
}

function updateTitles() {
  const gridTitle = gridZone.querySelector(".zone-title");
  const freeTitle = freeZone.querySelector(".zone-title");

  const gridHasElement = gridZone.querySelector(".drag-element");
  const freeHasElement = freeZone.querySelector(".drag-element");

  gridTitle.classList.toggle("hidden", Boolean(gridHasElement));
  freeTitle.classList.toggle("hidden", Boolean(freeHasElement));
}

function placeInGrid(el) {
  el.classList.remove("dragging");
  el.style.position = "static";
  el.style.left = "";
  el.style.top = "";

  gridZone.append(el);
}

function placeInFree(el, point) {
  const rect = freeZone.getBoundingClientRect();
  const width = el.offsetWidth;
  const height = el.offsetHeight;

  let left = point.x - rect.left - width / 2;
  let top = point.y - rect.top - height / 2;

  const maxLeft = rect.width - width;
  const maxTop = rect.height - height;

  left = clamp(left, 0, maxLeft);
  top = clamp(top, 0, maxTop);

  el.classList.remove("dragging");
  el.style.position = "absolute";
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;

  freeZone.append(el);
}

function startDrag(event) {
  const point = getPoint(event);

  currentDrag = createElement();

  moveElement(currentDrag, point);
  updateHighlight(point);

  document.addEventListener("mousemove", moveDrag);
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchmove", moveDrag, { passive: false });
  document.addEventListener("touchend", endDrag);
}

function moveDrag(event) {
  if (!currentDrag) return;

  const point = getPoint(event);

  moveElement(currentDrag, point);
  updateHighlight(point);
}

function endDrag(event) {
  if (!currentDrag) return;

  const point = getPoint(event);

  if (isInside(point, gridZone)) {
    placeInGrid(currentDrag);
  } else if (isInside(point, freeZone)) {
    placeInFree(currentDrag, point);
  } else {
    currentDrag.remove();
  }

  currentDrag = null;

  clearHighlight();
  updateTitles();

  document.removeEventListener("mousemove", moveDrag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchmove", moveDrag);
  document.removeEventListener("touchend", endDrag);
}

source.addEventListener("mousedown", startDrag);
source.addEventListener("touchstart", startDrag, { passive: false });

updateTitles();
