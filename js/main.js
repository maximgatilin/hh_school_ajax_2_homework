'use strict';
import {
    randomRgbColor,
    getHalfCoordinates,
    findEmptyCell,
    isElementFullyInsideContainer,
} from './helperModule.js';

console.warn('Скрипт подключён и выполняется.');

// Получаем нужные для взаимодействия элементы
const droppableElement = document.querySelector('.drag-drop__element');
const initialZone = document.querySelector('.drag-drop__initial-zone');
const grid = document.querySelector('.drag-drop__grid');
const freeZone = document.querySelector('.drag-drop__free-droppable');

// Флаги для перетаскиваемых элементов
let isDragging = false;
let newElement = null;

// Обработка действий, вызванных мышью
initialZone.addEventListener('mousedown', (event) => {
    event.preventDefault();
    isDragging = true;

    newElement = droppableElement.cloneNode(true);
    newElement.style.position = 'fixed';
    newElement.style.zIndex = '2';
    newElement.style.cursor = 'grabbing';
    newElement.style.backgroundColor = randomRgbColor();
    document.body.appendChild(newElement);

    const [halfWidth, halfHeight] = getHalfCoordinates(newElement);
    newElement.style.left = `${event.clientX - halfWidth}px`;
    newElement.style.top = `${event.clientY - halfHeight}px`;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging && newElement) {
        const [halfWidth, halfHeight] = getHalfCoordinates(newElement);
        newElement.style.left = `${event.clientX - halfWidth}px`;
        newElement.style.top = `${event.clientY - halfHeight}px`;
    }
});

document.addEventListener('mouseup', () => {
    if (!isDragging || !newElement) {
        return;
    }

    isDragging = false;

    if (isElementFullyInsideContainer(newElement, grid)) {
        const emptyCell = findEmptyCell(
            grid,
            '.drag-drop__cell',
            '.drag-drop__element'
        );
        if (emptyCell) {
            newElement.style.position = 'static';
            newElement.style.cursor = 'default';
            emptyCell.appendChild(newElement);
            newElement = null;
        } else {
            newElement.remove();
            newElement = null;
        }
    } else if (isElementFullyInsideContainer(newElement, freeZone)) {
        const elementRect = newElement.getBoundingClientRect();
        const zoneRect = freeZone.getBoundingClientRect();

        const newLeft = elementRect.left - zoneRect.left;
        const newTop = elementRect.top - zoneRect.top;

        newElement.style.position = 'absolute';
        newElement.style.cursor = 'default';
        newElement.style.left = `${newLeft}px`;
        newElement.style.top = `${newTop}px`;

        freeZone.appendChild(newElement);
        newElement = null;
    } else {
        newElement.remove();
        newElement = null;
    }
});

// Возможность перемещать для мобильных устройств
initialZone.addEventListener('touchstart', (event) => {
    event.preventDefault();
    isDragging = true;
    const touch = event.touches[0];

    newElement = droppableElement.cloneNode(true);
    newElement.style.position = 'fixed';
    newElement.style.zIndex = '2';
    newElement.style.cursor = 'grabbing';
    newElement.style.backgroundColor = randomRgbColor();
    document.body.appendChild(newElement);

    const [halfWidth, halfHeight] = getHalfCoordinates(newElement);
    newElement.style.left = `${touch.clientX - halfWidth}px`;
    newElement.style.top = `${touch.clientY - halfHeight}px`;
});

document.addEventListener('touchmove', (event) => {
    if (isDragging && newElement) {
        const touch = event.touches[0];
        const [halfWidth, halfHeight] = getHalfCoordinates(newElement);
        newElement.style.left = `${touch.clientX - halfWidth}px`;
        newElement.style.top = `${touch.clientY - halfHeight}px`;
    }
});

document.addEventListener('touchend', () => {
    if (!isDragging || !newElement) {
        return;
    }

    isDragging = false;

    if (isElementFullyInsideContainer(newElement, grid)) {
        const emptyCell = findEmptyCell(
            grid,
            '.drag-drop__cell',
            '.drag-drop__element'
        );
        if (emptyCell) {
            newElement.style.position = 'static';
            emptyCell.appendChild(newElement);
            newElement = null;
        } else {
            newElement.remove();
            newElement = null;
        }
    } else if (isElementFullyInsideContainer(newElement, freeZone)) {
        const elementRect = newElement.getBoundingClientRect();
        const zoneRect = freeZone.getBoundingClientRect();

        const newLeft = elementRect.left - zoneRect.left;
        const newTop = elementRect.top - zoneRect.top;

        newElement.style.position = 'absolute';
        newElement.style.left = `${newLeft}px`;
        newElement.style.top = `${newTop}px`;

        freeZone.appendChild(newElement);
        newElement = null;
    } else {
        newElement.remove();
        newElement = null;
    }
});
