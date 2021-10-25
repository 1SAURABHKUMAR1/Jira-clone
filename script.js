// variables
var createButton = document.querySelector(".tool-add");
var deleteButton = document.querySelector('.tool-delete');
var input_box = document.querySelector(".input-box");
var mainTicketContainer = document.querySelector('.main-ticket-container');
var inputTextarea = document.querySelector('.input-text-area');
var allPriorityColorInput = document.querySelectorAll('.single-priority-color');

var ticketColors = ["blue", "green", "yellow", "red"];
var defaultTicketColors = ticketColors[ticketColors.length - 1];
var addTicket = false;
var removeTicket = false;


// a event listner for each loop for selecting colors
allPriorityColorInput.forEach((color, index) => {
    color.addEventListener('click', () => {
        // remove priority color
        allPriorityColorInput.forEach((colorEach) => {
            colorEach.classList.remove('active-priority-color');
        })
        // add priority color
        color.classList.add('active-priority-color');

        // chnage color
        defaultTicketColors = color.classList[1];
    })
})


// a event listner to display create ticket input box 
createButton.addEventListener('click', () => {
    // addTicket == false -> hide input box
    // addTicket == true -> display input box
    addTicket = !addTicket;

    if (addTicket) {
        input_box.style.display = 'flex';
    } else {
        input_box.style.display = 'none';
        inputTextarea.value = '';
    }
})

// a event lisetener to add new ticket
input_box.addEventListener('keydown', (e) => {
    let keyPressed = e.key;
    if (keyPressed === "Shift" || keyPressed === "shift" || keyPressed === 16 || keyPressed === "AltGraph" || keyPressed === 18 || keyPressed === '$' || keyPressed === 52) {
        createNewTicket(defaultTicketColors, generateUnique(), inputTextarea.value);
        input_box.style.display = 'none';
        addTicket = !addTicket;
        inputTextarea.value = '';

    }
})

// a event listener on delet button
deleteButton.addEventListener('click', () => {
    removeTicket = !removeTicket;
})

// this function will create a new ticket
function createNewTicket(ticketColor, ticketID, ticketTask) {
    let newTicket = document.createElement('div');
    newTicket.setAttribute('class', 'ticket-container')
    newTicket.style.backgroundColor = `var(--priority-${ticketColor})`;
    newTicket.innerHTML = `
    <div class="ticket-id-lock">
    <p class="ticket-id">#${ticketID}</p>
    <i class="fas fa-copy"></i>
    <i class="fas fa-lock ticket-lock"></i>
    </div>
    <div class="task-area" contenteditable="false" spellcheck="false">${ticketTask}</div>
    `;
    mainTicketContainer.appendChild(newTicket);

    handleDeleteTicket(newTicket);
    handleLock(newTicket);
    copyTicketTaskClipboard(newTicket);
}

// generate new unique id 
function generateUnique() {
    return Math.random().toString(36).slice(3).replace(/\d+/g, '');
}

// a function to handle deletion of ticket
function handleDeleteTicket(ticket) {
    if (removeTicket) {
        ticket.remove();
    }
}

// function to handle lock and unlock of lock-icon
function handleLock(ticket) {
    let ticketLock = ticket.querySelector('.ticket-lock');
    let ticketTask = ticket.querySelector('.task-area');
    ticketLock.addEventListener('click', () => {
        if (ticketLock.classList.contains('fa-lock')) {
            ticketLock.classList.remove('fa-lock');
            ticketLock.classList.add('fa-lock-open');
            ticketTask.setAttribute('contenteditable', 'true');
        } else {
            ticketLock.classList.remove('fa-lock-open');
            ticketLock.classList.add('fa-lock');
            ticketTask.setAttribute('contenteditable', 'false');
        }
    })
}
// function to copy text area
function copyTicketTaskClipboard(ticket) {
    var copyButton = ticket.querySelector('.fa-copy');
    var textArea = ticket.querySelector('.task-area');
    copyButton.addEventListener('click', () => {
        var range = document.createRange();
        range.selectNode(textArea);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
    })
}
