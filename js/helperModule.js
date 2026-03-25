/**
 * Возвращает случайную строку в rgb-формате
 *
 * @returns {string} строка в rgb-формате
 */

function randomRgbColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * Вычисляет серединные координаты (ширина, высота)
 *
 * @param {HTMLElement} element - элемент, для которого вычисляются серединные координаты
 * @returns {[number, number]} список [halfWidth, halfHeight]
 */

function getHalfCoordinates(element) {
    const rect = element.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    return [halfWidth, halfHeight];
}

/**
 * Пытается найти свободную ячейку внутри контейнера
 *
 * @param {HTMLElement} container
 * @param {HTMLElement} cellSelector
 * @param {HTMLElement} contentSelector
 * @returns {HTMLElement|null} первая пустая ячейка или null
 */

function findEmptyCell(container, cellSelector, contentSelector) {
    if (!container) {
        return null;
    }
    const cells = container.querySelectorAll(cellSelector);
    for (const cell of cells) {
        if (!cell.querySelector(contentSelector)) {
            return cell;
        }
    }
    return null;
}

/**
 * Проверяет, входит ли полностью элемент в контейнер
 *
 * @param {HTMLElement} element - проверяемый элемент на вхождение в контейнер
 * @param {HTMLElement} container - контейнер
 * @returns {boolean} входит ли элемент в контейнер
 */

function isElementFullyInsideContainer(element, container) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return (
        containerRect.top <= elementRect.top &&
        containerRect.left <= elementRect.left &&
        containerRect.right >= elementRect.right &&
        containerRect.bottom >= elementRect.bottom
    );
}

export {
    randomRgbColor,
    getHalfCoordinates,
    findEmptyCell,
    isElementFullyInsideContainer,
};
