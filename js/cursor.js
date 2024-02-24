const cursor = document.createElement('div'); // Create a div for the cursor
cursor.classList.add('cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.top = e.clientY + 'px';
    cursor.style.left = e.clientX + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.classList.add('click-animation');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('click-animation');
});

const buttons = document.querySelectorAll('button');
buttons.forEach(button => button.style.cursor = 'none'); 

function updateCursorPosition(e) {
    cursor.style.top = e.clientY + 'px';
    cursor.style.left = e.clientX + 'px';
}

const clickableElements = document.querySelectorAll('button, a, .clickable');

clickableElements.forEach(element => {
    element.addEventListener('mouseover', () => {
        cursor.classList.add('halo');
    });
    element.addEventListener('mouseout', () => {
        cursor.classList.remove('halo');
    });
});
