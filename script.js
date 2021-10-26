// variables
var createButton = document.querySelector(".tool-add");
var deleteButton = document.querySelector('.tool-delete');
var clearButton = document.querySelector('.tool-clear');
var input_box = document.querySelector(".input-box");
var mainTicketContainer = document.querySelector('.main-ticket-container');
var inputTextarea = document.querySelector('.input-text-area');
var allPriorityColorInput = document.querySelectorAll('.single-priority-color');
var filterColors = document.querySelectorAll('.priority-color-single');
var allFilter = document.querySelector('.quick-filters');

var ticketColors = ["red", "yellow", "green", "blue"];
var defaultTicketColors = ticketColors[0];
var addTicket = false;
var removeTicket = false;

var ticketsArray = [];


// reflect tickets if avilable on local storage
if (localStorage.getItem('tickets')) {
    ticketsArray = JSON.parse(localStorage.getItem('tickets'));
    ticketsArray.forEach(element => {
        createNewTicket(element.ticketColor, element.ticketID, element.ticketTask, false);
    })
}

// a event listner for each loop for selecting colors
allPriorityColorInput.forEach((color) => {
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
        inputTextarea.focus();
    } else {
        input_box.style.display = 'none';
        inputTextarea.value = '';
    }
})

// an event listener to clear all tickets
clearButton.addEventListener('click', () => {
    var listTickets = document.querySelectorAll('.ticket-container');
    // remove all tickets
    listTickets.forEach(element => element.remove());
    // reset array
    ticketsArray = [];
    // reset local Storage
    localStorage.clear();
})

// a event lisetener to add new ticket
input_box.addEventListener('keydown', (e) => {
    let keyPressed = e.key;
    if (keyPressed === "Shift" || keyPressed === "shift" || keyPressed === 16 || keyPressed === "AltGraph" || keyPressed === 18 || keyPressed === '$' || keyPressed === 52) {

        if (inputTextarea.value != '') {
            createNewTicket(defaultTicketColors, generateUnique(), inputTextarea.value, true);
            addTicket = !addTicket;
            resetInputBox();
        }

    }
})

// a event listener on delete button
deleteButton.addEventListener('click', () => {
    removeTicket = !removeTicket;
})

// an event listener to filter according to colors
for (let index = 0; index < filterColors.length; index++) {
    filterColors[index].addEventListener('click', () => {
        let currentFilterColors = filterColors[index].classList[1]; // current clicked color
        const filteredTickets = ticketsArray.filter(element => element.ticketColor === currentFilterColors); // array of objects to of clicked color

        // remove all tickets
        let ticketsAll = document.querySelectorAll('.ticket-container');
        ticketsAll.forEach(element => element.remove());

        // reflect new tickets
        filteredTickets.forEach(element => {
            createNewTicket(element.ticketColor, element.ticketID, element.ticketTask, false);
        })

    })
}

// a function to show all tickets
allFilter.addEventListener('click', () => {

    // remove all tickets
    let ticketsAll = document.querySelectorAll('.ticket-container');
    ticketsAll.forEach(element => element.remove())

    // reflect all tickets
    ticketsArray.forEach(element => {
        createNewTicket(element.ticketColor, element.ticketID, element.ticketTask, false);
    })

})

// this function will create a new ticket
function createNewTicket(ticketColor, ticketID, ticketTask, createNew) {

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

    // creaete ticket and push to array
    if (createNew) {
        ticketsArray.push(
            {
                ticketColor,
                ticketTask,
                ticketID
            }
        );
        manageLocalStorage();
    }

    handleDeleteTicket(newTicket, ticketID);
    handleLock(newTicket, ticketID);
    copyTicketTaskClipboard(newTicket);
    handleColorTicket(newTicket, ticketID);
}

// generate new unique id 
function generateUnique() {
    return Math.random().toString(36).slice(3).replace(/\d+/g, '');
}

// a function to handle deletion of ticket
function handleDeleteTicket(ticket, id) {
    ticket.addEventListener('click', () => {
        if (!removeTicket) {
            return;
        }
        // remove from page
        ticket.remove();

        // manage ticket array and local storage remove ticket
        let ticketIndex = getTicketIndex(id);
        ticketsArray.splice(ticketIndex, 1);
        manageLocalStorage();
    })
}

// function to handle lock and unlock of lock-icon
function handleLock(ticket, id) {
    let ticketLock = ticket.querySelector('.ticket-lock');
    let ticketTaskArea = ticket.querySelector('.task-area');

    ticketLock.addEventListener('click', () => {

        if (ticketLock.classList.contains('fa-lock')) {
            ticketLock.classList.remove('fa-lock');
            ticketLock.classList.add('fa-lock-open');
            ticketTaskArea.setAttribute('contenteditable', 'true');

        } else {
            ticketLock.classList.remove('fa-lock-open');
            ticketLock.classList.add('fa-lock');
            ticketTaskArea.setAttribute('contenteditable', 'false');
        }

        // on modify data update local storage
        let ticketIndex = getTicketIndex(id)
        ticketsArray[ticketIndex].ticketTask = ticketTaskArea.innerText;
        manageLocalStorage();
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

// // a function to handle color
function handleColorTicket(ticket, ID) {
    let colorArea = ticket.querySelector('.ticket-id-lock');

    colorArea.addEventListener('click', () => {

        // take ticket color
        let ticketColorCurrent = ticket.style.backgroundColor;

        // slice color from it
        ticketColorCurrent = ticketColorCurrent.replace(/[^a-zA-Z ]/g, "").slice(11);
        // find color from array

        let indexCurrentColor = ticketColors.findIndex((element) => element === ticketColorCurrent);
        indexCurrentColor++; // increment the color

        // capture new color if out of bount modulo
        let newTicketColor = ticketColors[indexCurrentColor % ticketColors.length];

        // apply color to it     
        ticket.style.backgroundColor = `var(--priority-${newTicketColor})`;


        // find index of ticket from array and modify it
        let ticketIndex = getTicketIndex(ID);
        ticketsArray[ticketIndex].ticketColor = newTicketColor;

        // refresh local storgae
        manageLocalStorage();
    })
    ticket.querySelector('.fa-copy').addEventListener('click', (event) => {
        event.stopPropagation();
    })
    ticket.querySelector('.fa-lock').addEventListener('click', (event) => {
        event.stopPropagation();
    })


}

// function to reset color on input box
function resetInputBox() {
    allPriorityColorInput.forEach(element => {
        // remove border
        element.classList.remove('active-priority-color');
    })

    // add border to red
    allPriorityColorInput[0].classList.add('active-priority-color');

    // remove display
    input_box.style.display = 'none';

    // reset value of input box
    inputTextarea.value = '';

    // reset default color
    defaultTicketColors = ticketColors[0];
}

// a function to set localStorage
function manageLocalStorage() {
    localStorage.setItem('tickets', JSON.stringify(ticketsArray));
}

// a function to find ticket index via ticketId
function getTicketIndex(Id) {
    return ticketsArray.findIndex(element => element.ticketID === Id);
}