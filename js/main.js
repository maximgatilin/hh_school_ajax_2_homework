'use strict';

const block = document.querySelector(".main-block")
const leftBlock = document.querySelector(".left-block")
const rightBlock = document.querySelector(".right-block")

let activeBlock = null

let isDragging = false
let cursor_x = 0
let cursor_y = 0

function setRandomBackground(element) {
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  element.style.backgroundColor = randomColor;
}

function createBlock(x, y) {
    const newBlock = document.createElement('div');
    newBlock.className = 'new-block';
    newBlock.style.position = 'absolute';

    setRandomBackground(newBlock)
    placeBlock(newBlock, x, y);
    document.body.appendChild(newBlock);

    return newBlock;
}

function isInside(target, zone) {
    const targetRect = target.getBoundingClientRect();
    const zoneRect = zone.getBoundingClientRect();

    return (
        targetRect.left >= zoneRect.left &&
        targetRect.right <= zoneRect.right &&
        targetRect.top >= zoneRect.top &&
        targetRect.bottom <= zoneRect.bottom
    );
}

function getDropZone(element) {
    if (isInside(element, leftBlock)) return leftBlock;
    if (isInside(element, rightBlock)) return rightBlock;

    return null;
}

function placeBlock(element, left, top) {
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
}

function startDragging(element, event) {
    const rect = element.getBoundingClientRect();

    activeBlock = element;
    isDragging = true;

    cursor_x = event.pageX - (rect.left + window.scrollX);
    cursor_y = event.pageY - (rect.top + window.scrollY);
}

function stopDragging() {
    if (!activeBlock) return;

    const droppedBlock = activeBlock;

    isDragging = false;
    activeBlock = null;
    cursor_x = 0;
    cursor_y = 0;

    droppedBlock.style.cursor = 'grab';

    handleDropResult(droppedBlock);
}

function handleDropResult(element) {
    const zone = getDropZone(element);

    if (!zone) {
        element.remove();
        return;
    }

    if (zone === leftBlock) {
        placeIntoGrid(element)
    } else if (zone === rightBlock) {
        placeIntoFreeZone(element)
    }
}

function placeIntoGrid(element) {
    const maxItems = 9;

    if (leftBlock.querySelectorAll('.new-block').length >= maxItems) {
        element.remove();
        return;
    }

    leftBlock.appendChild(element)
    element.style.position = 'static';
    element.style.left = '';
    element.style.top = '';
}

function placeIntoFreeZone(element) {
    const elementRect = element.getBoundingClientRect();
    const zoneRect = rightBlock.getBoundingClientRect();

    const left = elementRect.left - zoneRect.left;
    const top = elementRect.top - zoneRect.top;

    rightBlock.appendChild(element);

    element.style.position = 'absolute';
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
}

block.addEventListener("pointerdown", (event) => {
    event.preventDefault()

    const rect = block.getBoundingClientRect();
    const left = rect.left + window.scrollX;
    const top = rect.top + window.scrollY;

    const newBlock = createBlock(left, top);
    startDragging(newBlock, event);
})

document.addEventListener("pointermove", (event) => {
    if (!isDragging || !activeBlock) return;

    const left = event.pageX - cursor_x;
    const top = event.pageY - cursor_y;

    placeBlock(activeBlock, left, top);
})

document.addEventListener("pointerup", () => {
    if (activeBlock === null) return;
    stopDragging();
});

document.addEventListener("pointercancel", () => {
    if (activeBlock === null) return
    stopDragging();
})
