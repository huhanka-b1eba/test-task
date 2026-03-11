let dragged = null;
let currentDroppable = null;

let shiftX = 0;
let shiftY = 0;

const draggable = document.getElementById('drag-item');
const dropZone = document.getElementById('drop-zone');
const defaultZoneText = 'Положите коробку на эту зону';

draggable.ondragstart = () => false;

function getCoords(event) {
    if (event.touches && event.touches.length) {
        return {
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
            pageX: event.touches[0].pageX,
            pageY: event.touches[0].pageY
        };
    }

    if (event.changedTouches && event.changedTouches.length) {
        return {
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY,
            pageX: event.changedTouches[0].pageX,
            pageY: event.changedTouches[0].pageY
        };
    }

    return {
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY
    };
}

function startDrag(event) {
    if (event.cancelable) {
        event.preventDefault();
    }

    const target = event.target.closest('#drag-item');
    if (!target || dragged) {
        return;
    }

    dragged = target;

    const coords = getCoords(event);
    const rect = dragged.getBoundingClientRect();

    shiftX = coords.clientX - rect.left;
    shiftY = coords.clientY - rect.top;

    dragged.style.position = 'absolute';
    dragged.style.zIndex = 1000;

    document.body.append(dragged);

    moveAt(coords.pageX, coords.pageY);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove, { passive: false });
}

function moveAt(pageX, pageY) {
    dragged.style.left = `${pageX - shiftX}px`;
    dragged.style.top = `${pageY - shiftY}px`;
}

function onMouseMove(event) {
    if (!dragged) {
        return;
    }

    if (event.cancelable) {
        event.preventDefault();
    }

    const coords = getCoords(event);

    moveAt(coords.pageX, coords.pageY);

    dragged.hidden = true;
    const elemBelow = document.elementFromPoint(coords.clientX, coords.clientY);
    dragged.hidden = false;

    if (!elemBelow) {
        return;
    }

    const droppableBelow = elemBelow.closest('.zone');

    if (currentDroppable !== droppableBelow) {
        if (currentDroppable) {
            leaveDroppable(currentDroppable);
        }

        currentDroppable = droppableBelow;

        if (currentDroppable) {
            enterDroppable(currentDroppable);
        }
    }
}

function stopDrag(event) {
    if (!dragged) {
        return;
    }

    const coords = getCoords(event);

    dragged.hidden = true;
    const elemBelow = document.elementFromPoint(coords.clientX, coords.clientY);
    dragged.hidden = false;

    const droppableBelow = elemBelow?.closest('.zone') || null;

    if (droppableBelow) {
        enterDroppable(droppableBelow);
    } else if (currentDroppable) {
        leaveDroppable(currentDroppable);
    } else {
        resetDroppable();
    }

    currentDroppable = null;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchmove', onMouseMove);

    dragged = null;
}

function enterDroppable(elem) {
    elem.classList.add('active');
    elem.textContent = 'Спасибо!';
}

function leaveDroppable(elem) {
    elem.classList.remove('active');
    elem.textContent = 'Пожалуйста, верните коробку обратно на зону';
}

function resetDroppable() {
    dropZone.classList.remove('active');
    dropZone.textContent = defaultZoneText;
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, { passive: false });

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);
document.addEventListener('touchcancel', stopDrag);
