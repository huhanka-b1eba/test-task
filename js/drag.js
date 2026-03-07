let dragged = null;
let currentDroppable = null;

let shiftX = 0;
let shiftY = 0;

const draggable = document.getElementById('drag-item');
draggable.ondragstart = () => false;

document.addEventListener('mousedown', (event) => {

    const target = event.target.closest('#drag-item');
    if (!target) return;

    dragged = target;

    const rect = dragged.getBoundingClientRect();
    shiftX = event.clientX - rect.left;
    shiftY = event.clientY - rect.top;

    dragged.style.position = 'absolute';
    dragged.style.zIndex = 1000;

    document.body.append(dragged);

    moveAt(event.pageX, event.pageY);

    document.addEventListener('mousemove', onMouseMove);
});


function moveAt(pageX, pageY) {
    dragged.style.left = pageX - shiftX + 'px';
    dragged.style.top = pageY - shiftY + 'px';
}


function onMouseMove(event) {
    if (!dragged) return;

    moveAt(event.pageX, event.pageY);

    dragged.hidden = true;
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    dragged.hidden = false;

    if (!elemBelow) return;
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


document.addEventListener('mouseup', () => {
    if (!dragged) return;
    document.removeEventListener('mousemove', onMouseMove);
    dragged = null;
});


function enterDroppable(elem) {
    elem.classList.add('active');
    elem.textContent = 'Спасибо!';
}

function leaveDroppable(elem) {
    elem.classList.remove('active');
    elem.textContent = 'Пожалуйста, верните коробку обратно на зону';
}