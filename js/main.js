let drag = null;

document.getElementById('sourcePad').addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  e.preventDefault();

  const elem = document.createElement('div');
  elem.className = 'element dragging';
  elem.style.backgroundColor = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  document.body.appendChild(elem);

  drag = { elem, offsetX: 50, offsetY: 50 };
  positionElem(e.clientX, e.clientY);
});

document.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  if (!e.target.classList.contains('element')) return;
  if (e.target.classList.contains('dragging')) return;
  e.preventDefault();

  const elem = e.target;
  const rect = elem.getBoundingClientRect();

  elem.remove();
  elem.classList.add('dragging');
  document.body.appendChild(elem);

  drag = { elem, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
  positionElem(e.clientX, e.clientY);
});

document.addEventListener('mousemove', e => {
  if (!drag) return;
  positionElem(e.clientX, e.clientY);
  updateHighlight(e.clientX, e.clientY);
});

document.addEventListener('mouseup', e => {
  if (!drag) return;

  const { elem, offsetX, offsetY } = drag;
  drag = null;

  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  elem.classList.remove('dragging');

  if (!tryDrop(elem, e.clientX, e.clientY, offsetX, offsetY)) elem.remove();
});

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