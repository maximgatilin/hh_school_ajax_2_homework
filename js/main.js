"use strict";

const COLORS = ["grey", "red", "blue", "green", "yellow"];

let createdElementsCounter = 0;

const createElement = (initialX, initialY) => {
  createdElementsCounter++;
  const el = document.createElement("div");
  el.id = `element${createdElementsCounter}`;

  el.style.width = "100px";
  el.style.height = "100px";
  el.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  el.style.position = "absolute";
  el.style.top = initialY + "px";
  el.style.left = initialX + "px";
  el.style.pointerEvents = "none";

  document.body.appendChild(el);
  return el;
};

const takeElementArea = document.getElementById("take");
const flexArea = document.getElementById("flex");
const freeArea = document.getElementById("free");

let isDragged = false;
let draggedElement;

takeElementArea.addEventListener("pointerdown", (e) => {
  isDragged = true;
  takeElementArea.releasePointerCapture(e.pointerId);
  takeElementArea.childNodes.forEach((node) =>
    node.releasePointerCapture(e.pointerId),
  );
  draggedElement = createElement(e.clientX, e.clientY);

  document.body.style.cursor = "grabbing";
  takeElementArea.style.cursor = "grabbing";
});

document.addEventListener("pointermove", (e) => {
  if (isDragged) {
    draggedElement.style.top = e.clientY + "px";
    draggedElement.style.left = e.clientX + "px";
  }
});

flexArea.addEventListener("pointerup", (event) => {
  if (isDragged) {
    flexArea.style.border = "1px solid black";
    flexArea.style.backgroundColor = "white";

    const copy = draggedElement.cloneNode();
    flexArea.appendChild(copy);
    copy.style.position = "initial";
  }
});

flexArea.addEventListener("pointerenter", () => {
  if (isDragged) {
    flexArea.style.border = "2px solid green";
    flexArea.style.backgroundColor = "#eaffea";
  }
});

flexArea.addEventListener("pointerleave", () => {
  if (isDragged) {
    flexArea.style.border = "1px solid black";
    flexArea.style.backgroundColor = "white";
  }
});

freeArea.addEventListener("pointerup", () => {
  if (isDragged) {
    freeArea.style.border = "1px solid black";
    freeArea.style.backgroundColor = "white";

    const areaPos = freeArea.getBoundingClientRect();
    const elPos = draggedElement.getBoundingClientRect();

    if (
      elPos.top + elPos.height < areaPos.top + areaPos.height &&
      elPos.left + elPos.width < areaPos.left + areaPos.width
    ) {
      const copy = draggedElement.cloneNode();
      copy.style.top = elPos.top - areaPos.top + "px";
      copy.style.left = elPos.left - areaPos.left + "px";
      freeArea.appendChild(copy);
    }
  }
});

freeArea.addEventListener("pointerenter", () => {
  if (isDragged) {
    freeArea.style.border = "2px solid green";
    freeArea.style.backgroundColor = "#eaffea";
  }
});

freeArea.addEventListener("pointerleave", () => {
  if (isDragged) {
    freeArea.style.border = "1px solid black";
    freeArea.style.backgroundColor = "white";
  }
});

document.body.addEventListener("pointerup", () => {
  if (isDragged) {
    draggedElement.remove();
    draggedElement = null;
    isDragged = false;

    document.body.style.cursor = "default";
    takeElementArea.style.cursor = "grab";
  }
});
