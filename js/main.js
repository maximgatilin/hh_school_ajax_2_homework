"use strict";

const source = document.getElementById("source");
const gridZone = document.getElementById("gridZone");
const freeZone = document.getElementById("freeZone");
const gridContent = document.getElementById("gridContent");
const freeContent = document.getElementById("freeContent");
const btnClear = document.getElementById("clearAll");

const zones = [gridZone, freeZone];
let drag = null;

/**
 * Генерирует случайный цвет в формате HSL.
 * @returns {string} Случайный цвет в формате HSL.
 */
function randomColor() {
  const h = (Math.random() * 360) | 0;
  return `hsl(${h}, 60%, 55%)`;
}

/**
 * Создаёт новый блок с классом "block" и случайным цветом фона.
 * @returns {HTMLElement} Новый блок.
 */
function createBlock() {
  const el = document.createElement("div");
  el.className = "block";
  el.style.backgroundColor = randomColor();
  return el;
}

/**
 * Извлекает координаты указателя курсора или пальца из события.
 * @param {MouseEvent | TouchEvent} e Событие мыши или тача.
 * @returns {{x: number, y: number}} Координаты указателя.
 */
function getPointer(e) {
  const src = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
  return { x: src.clientX, y: src.clientY };
}

/**
 * Проверяет, находится ли точка (x, y) внутри одной из зон-приёмников.
 * Возвращает найденную зону или null.
 * @param {number} x Координата X.
 * @param {number} y Координата Y.
 * @returns {HTMLElement|null} Найденная зона или null.
 */
function findZoneAt(x, y) {
  for (const zone of zones) {
    const r = zone.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      return zone;
    }
  }
  return null;
}

/**
 * ШАГ 1: Начало перетаскивания
 * Вызывается при mousedown или touchstart
 */
function onStart(e) {
  if (drag) return;
  if (e.target.closest("button")) return;

  const { x, y } = getPointer(e);
  let block, offsetX, offsetY;

  if (e.target.closest("#source")) {
    block = createBlock();
    offsetX = 50;
    offsetY = 50;
  } else if (e.target.closest(".block")) {
    block = e.target.closest(".block");
    const rect = block.getBoundingClientRect();
    offsetX = x - rect.left;
    offsetY = y - rect.top;
  } else {
    return;
  }

  e.preventDefault();

  block.style.position = "fixed";
  block.style.left = x - offsetX + "px";
  block.style.top = y - offsetY + "px";
  block.style.zIndex = "10000";
  block.style.margin = "0";
  document.body.appendChild(block);
  block.classList.add("block--dragging");

  drag = { el: block, ox: offsetX, oy: offsetY };

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("touchend", onEnd);
  document.addEventListener("touchcancel", onCancel);
}

/**
 * ШАГ 2: Движение
 * Вызывается при каждом сдвиге мыши / пальца
 */
function onMove(e) {
  if (!drag) return;
  e.preventDefault();

  const { x, y } = getPointer(e);
  drag.el.style.left = x - drag.ox + "px";
  drag.el.style.top = y - drag.oy + "px";

  const zone = findZoneAt(x, y);
  zones.forEach((z) => z.classList.toggle("zone--active", z === zone));
}

/**
 * ШАГ 3: Отпускание
 * Вызывается при mouseup или touchend
 */
function onEnd(e) {
  if (!drag) return;

  const { x, y } = getPointer(e);
  const block = drag.el;

  block.classList.remove("block--dragging");
  zones.forEach((z) => z.classList.remove("zone--active"));

  const zone = findZoneAt(x, y);

  if (zone === gridZone) {
    resetStyles(block);
    gridContent.appendChild(block);
  } else if (zone === freeZone) {
    const zr = freeContent.getBoundingClientRect();
    let bx = x - drag.ox - zr.left;
    let by = y - drag.oy - zr.top;
    bx = Math.max(0, Math.min(bx, zr.width - 100));
    by = Math.max(0, Math.min(by, zr.height - 100));

    block.style.position = "absolute";
    block.style.left = bx + "px";
    block.style.top = by + "px";
    block.style.zIndex = "";
    block.style.margin = "";
    freeContent.appendChild(block);
  } else {
    block.remove();
  }

  teardown();
}

/**
 * Отмена тач-события.
 * Просто удаляет блок и чистит состояние.
 */
function onCancel() {
  if (!drag) return;
  const block = drag.el;
  teardown();
  block.remove();
}

/**
 * Сбрасывает inline-стили, которые мы навесили для «полёта» блока.
 */
function resetStyles(block) {
  block.style.position = "";
  block.style.left = "";
  block.style.top = "";
  block.style.zIndex = "";
  block.style.margin = "";
}

/**
 * Очистка после завершения перетаскивания:
 * 1. Обнуляет состояние drag
 * 2. Снимает все слушатели, которые повесили в onStart
 */
function teardown() {
  drag = null;
  document.removeEventListener("mousemove", onMove);
  document.removeEventListener("mouseup", onEnd);
  document.removeEventListener("touchmove", onMove);
  document.removeEventListener("touchend", onEnd);
  document.removeEventListener("touchcancel", onCancel);
}

// Находим все блоки на странице и удаляем каждый
btnClear.addEventListener("click", () => {
  document.querySelectorAll(".block").forEach((b) => b.remove());
});

// Слушатели для старта перетаскивания: мышь и тач
document.addEventListener("mousedown", onStart);
document.addEventListener("touchstart", onStart, { passive: false });
