let drag = null;

function getEventCoords(e) {
  if (e.touches) {
    return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
  }
  return { clientX: e.clientX, clientY: e.clientY };
}

function getEventTarget(e) {
  if (e.touches) {
    return e.touches[0].target;
  }
  return e.target;
}

function getLastCoords(e) {
  if (e.changedTouches) {
    return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
  }
  return { clientX: e.clientX, clientY: e.clientY };
}

function createDraggableElement() {
  const elem = document.createElement('div');
  elem.className = 'element dragging';
  elem.style.backgroundColor = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  return elem;
}

function startDrag(elem, clientX, clientY, offsetX, offsetY) {
  drag = { elem, offsetX, offsetY };
  positionElem(clientX, clientY);
}

function handleDragStart(e, isNewElement = false, offsetX = 50, offsetY = 50) {
  e.preventDefault();
  const coords = getEventCoords(e);

  let elem;
  if (isNewElement) {
    elem = createDraggableElement();
    document.body.appendChild(elem);
    startDrag(elem, coords.clientX, coords.clientY, offsetX, offsetY);
  } else {
    const target = getEventTarget(e);
    if (!target.classList.contains('element') || target.classList.contains('dragging')) return;
    const rect = target.getBoundingClientRect();
    elem = target;
    elem.remove();
    elem.classList.add('dragging');
    document.body.appendChild(elem);
    startDrag(elem, coords.clientX, coords.clientY, coords.clientX - rect.left, coords.clientY - rect.top);
  }
}

function handleDragMove(e) {
  if (!drag) return;
  e.preventDefault();
  const coords = getEventCoords(e);
  positionElem(coords.clientX, coords.clientY);
  updateHighlight(coords.clientX, coords.clientY);
}

function handleDragEnd(e) {
  if (!drag) return;
  const { elem, offsetX, offsetY } = drag;
  drag = null;
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  elem.classList.remove('dragging');
  const coords = getLastCoords(e);
  if (!tryDrop(elem, coords.clientX, coords.clientY, offsetX, offsetY)) elem.remove();
}

document.getElementById('sourcePad').addEventListener('mousedown', e => handleDragStart(e, true));
document.getElementById('sourcePad').addEventListener('touchstart', e => handleDragStart(e, true));

document.addEventListener('mousedown', e => handleDragStart(e, false));
document.addEventListener('touchstart', e => handleDragStart(e, false));

document.addEventListener('mousemove', handleDragMove);
document.addEventListener('touchmove', handleDragMove);

document.addEventListener('mouseup', handleDragEnd);
document.addEventListener('touchend', handleDragEnd);

function positionElem(mouseX, mouseY) {
  drag.elem.style.left = mouseX - drag.offsetX + 'px';
  drag.elem.style.top  = mouseY - drag.offsetY + 'px';
}

function tryDrop(elem, mouseX, mouseY, offsetX, offsetY) {
  const gridZone = document.getElementById('zoneGrid');
  const freeZone = document.getElementById('zoneFree');

  const gridRect = gridZone.getBoundingClientRect();
  const freeRect = freeZone.getBoundingClientRect();

  if (mouseX >= gridRect.left && mouseX <= gridRect.right &&
    mouseY >= gridRect.top  && mouseY <= gridRect.bottom) {
    placeOnGrid(elem, mouseX, mouseY, offsetX, offsetY);
    return true;
  }

  if (mouseX >= freeRect.left && mouseX <= freeRect.right &&
    mouseY >= freeRect.top  && mouseY <= freeRect.bottom) {
    placeFree(elem, mouseX, mouseY, offsetX, offsetY);
    return true;
  }

  return false;
}

function placeOnGrid(elem, mouseX, mouseY, offsetX, offsetY) {
  const area = document.getElementById('gridArea');
  const rect = area.getBoundingClientRect();

  const col = Math.floor((mouseX - offsetX + 50 - rect.left) / 100);
  const row = Math.floor((mouseY - offsetY + 50 - rect.top)  / 100);

  elem.style.left = Math.max(0, Math.min(col * 100, rect.width  - 100)) + 'px';
  elem.style.top  = Math.max(0, Math.min(row * 100, rect.height - 100)) + 'px';
  area.appendChild(elem);
}

function placeFree(elem, mouseX, mouseY, offsetX, offsetY) {
  const area = document.getElementById('freeArea');
  const rect = area.getBoundingClientRect();

  elem.style.left = Math.max(0, Math.min(mouseX - offsetX - rect.left, rect.width  - 100)) + 'px';
  elem.style.top  = Math.max(0, Math.min(mouseY - offsetY - rect.top,  rect.height - 100)) + 'px';
  area.appendChild(elem);
}

function updateHighlight(mouseX, mouseY) {
  ['zoneGrid', 'zoneFree'].forEach(id => {
    const zone = document.getElementById(id);
    const rect = zone.getBoundingClientRect();
    zone.classList.toggle('drag-over',
      mouseX >= rect.left && mouseX <= rect.right &&
      mouseY >= rect.top  && mouseY <= rect.bottom
    );
  });
}