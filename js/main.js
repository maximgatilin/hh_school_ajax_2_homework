class DragAndDrop {
    constructor() {
        this.sourceArea = document.getElementById('sourceArea');
        this.gridArea = document.getElementById('grid');
        this.freeArea = document.getElementById('free');
        this.grid = document.getElementById('grid');
        this.free = document.getElementById('free');
        this.isDragging = false;
        this.currentElement = null;
        this.initialLeft = 0;
        this.initialTop = 0;
        this.init();
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    createElement(x, y) {
        const div = document.createElement('div');
        div.className = 'draggable';
        div.style.backgroundColor = this.getRandomColor();
        div.style.position = 'absolute';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        return div;
    }

    isFullyInsideZone(element, zoneElement) {
        const elementRect = element.getBoundingClientRect();
        const zoneRect = zoneElement.getBoundingClientRect();
        const topLeft = elementRect.left >= zoneRect.left && elementRect.top >= zoneRect.top;
        const topRight = elementRect.right <= zoneRect.right && elementRect.top >= zoneRect.top;
        const bottomLeft = elementRect.left >= zoneRect.left && elementRect.bottom <= zoneRect.bottom;
        const bottomRight = elementRect.right <= zoneRect.right && elementRect.bottom <= zoneRect.bottom;
        return topLeft && topRight && bottomLeft && bottomRight;
    }

    getFullyInsideZone(element) {
        if (this.isFullyInsideZone(element, this.gridArea)) return 'grid';
        if (this.isFullyInsideZone(element, this.freeArea)) return 'free';
        return null;
    }

    addToGrid(element) {
        element.style.position = '';
        element.style.left = '';
        element.style.top = '';
        this.grid.appendChild(element);
    }

    addToFree(element, x, y) {
        const freeRect = this.free.getBoundingClientRect();
        let left = x - freeRect.left;
        let top = y - freeRect.top;
        left = Math.max(0, Math.min(left, freeRect.width - 100));
        top = Math.max(0, Math.min(top, freeRect.height - 100));
        element.style.position = 'absolute';
        element.style.left = left + 'px';
        element.style.top = top + 'px';
        this.free.appendChild(element);
    }

    removeElement(element) {
        if (element && element.parentNode) element.remove();
    }

    highlightZone(zone) {
        const gridContainer = document.querySelector('.grid-area');
        const freeContainer = document.querySelector('.free-area');
        gridContainer.classList.remove('zone-highlight');
        freeContainer.classList.remove('zone-highlight');
        if (zone === 'grid') gridContainer.classList.add('zone-highlight');
        if (zone === 'free') freeContainer.classList.add('zone-highlight');
    }

    clearHighlight() {
        const gridContainer = document.querySelector('.grid-area');
        const freeContainer = document.querySelector('.free-area');
        gridContainer.classList.remove('zone-highlight');
        freeContainer.classList.remove('zone-highlight');
    }

    onMouseDown(event) {
        if (!this.sourceArea.contains(event.target)) return;
        event.preventDefault();
        const cursorX = event.clientX;
        const cursorY = event.clientY;
        this.currentElement = this.createElement(cursorX, cursorY);
        document.body.appendChild(this.currentElement);
        const rect = this.currentElement.getBoundingClientRect();
        this.initialLeft = cursorX - rect.left;
        this.initialTop = cursorY - rect.top;
        this.isDragging = true;
        this.currentElement.classList.add('dragging');
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onTouchStart(event) {
        if (!this.sourceArea.contains(event.target)) return;
        event.preventDefault();
        const touch = event.touches[0];
        const cursorX = touch.clientX;
        const cursorY = touch.clientY;
        this.currentElement = this.createElement(cursorX, cursorY);
        document.body.appendChild(this.currentElement);
        const rect = this.currentElement.getBoundingClientRect();
        this.initialLeft = cursorX - rect.left;
        this.initialTop = cursorY - rect.top;
        this.isDragging = true;
        this.currentElement.classList.add('dragging');
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onTouchEnd);
    }

    onMouseMove = (event) => {
        if (!this.isDragging || !this.currentElement) return;
        event.preventDefault();
        const cursorX = event.clientX;
        const cursorY = event.clientY;
        this.currentElement.style.left = (cursorX - this.initialLeft) + 'px';
        this.currentElement.style.top = (cursorY - this.initialTop) + 'px';
        this.highlightZone(this.getFullyInsideZone(this.currentElement));
    }

    onTouchMove = (event) => {
        if (!this.isDragging || !this.currentElement) return;
        event.preventDefault();
        const touch = event.touches[0];
        const cursorX = touch.clientX;
        const cursorY = touch.clientY;
        this.currentElement.style.left = (cursorX - this.initialLeft) + 'px';
        this.currentElement.style.top = (cursorY - this.initialTop) + 'px';
        this.highlightZone(this.getFullyInsideZone(this.currentElement));
    }

    onMouseUp = (event) => {
        if (!this.isDragging || !this.currentElement) return;
        const zone = this.getFullyInsideZone(this.currentElement);
        this.currentElement.classList.remove('dragging');
        if (zone === 'grid') {
            this.addToGrid(this.currentElement);
        } else if (zone === 'free') {
            const rect = this.currentElement.getBoundingClientRect();
            this.addToFree(this.currentElement, rect.left, rect.top);
        } else {
            this.removeElement(this.currentElement);
        }
        this.isDragging = false;
        this.currentElement = null;
        this.clearHighlight();
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    onTouchEnd = (event) => {
        if (!this.isDragging || !this.currentElement) return;
        event.preventDefault();
        const zone = this.getFullyInsideZone(this.currentElement);
        this.currentElement.classList.remove('dragging');
        if (zone === 'grid') {
            this.addToGrid(this.currentElement);
        } else if (zone === 'free') {
            const rect = this.currentElement.getBoundingClientRect();
            this.addToFree(this.currentElement, rect.left, rect.top);
        } else {
            this.removeElement(this.currentElement);
        }
        this.isDragging = false;
        this.currentElement = null;
        this.clearHighlight();
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
    }

    init() {
        this.sourceArea.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.sourceArea.addEventListener('touchstart', this.onTouchStart.bind(this));
        document.addEventListener('dragstart', (event) => event.preventDefault());
    }
    
}
document.addEventListener('DOMContentLoaded', () => {
    new DragAndDrop();
});