// variables
var create_button = document.querySelector(".tool-add");
var input_box = document.querySelector(".input-box");
var main_ticket_container = document.querySelector('.main-ticket-container');
var input_textarea = document.querySelector('.input-text-area');
var allPriorityColorInput = document.querySelectorAll('.single-priority-color');

var ticketColors = ["blue", "green", "yellow", "red"];
var defaultTicketColors = ticketColors[ticketColors.length - 1];
var addTicket = false;



// a event listner for each loop for selecting colors
allPriorityColorInput.forEach((color, index) => {
    color.addEventListener('click', (element) => {
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
create_button.addEventListener('click', () => {
    // addTicket == false -> hide input box
    // addTicket == true -> display input box
    addTicket = !addTicket;

    if (addTicket) {
        input_box.style.display = 'flex';
    } else {
        input_box.style.display = 'none';
    }


})

// a event lisetener to add new ticket
input_box.addEventListener('keydown', (e) => {
    let keyPressed = e.key;
    if (keyPressed === "Shift" || keyPressed === "shift" || keyPressed === 16 || keyPressed === "AltGraph" || keyPressed === 18) {
        createNewTicket(defaultTicketColors, generateUnique(), input_textarea.value);
        input_box.style.display = 'none';
        addTicket = !addTicket;
        input_textarea.value = '';

    }
})


// this function will create a new ticket
function createNewTicket(ticketColor, ticketID, ticketTask) {
    let newTicket = document.createElement('div');
    newTicket.setAttribute('class', 'ticket-container')
    newTicket.style.backgroundColor = `var(--priority-${ticketColor})`;
    newTicket.innerHTML = `
    <div class="ticket-id-lock">
                    <p class="ticket-id">#${ticketID}</p>
                    <i class="fas fa-lock ticket-lock"></i>
                </div>
    <div class="task-area">${ticketTask}</div>
    `;
    main_ticket_container.appendChild(newTicket);
}

// generate new unique id 
function generateUnique() {
    return Math.random().toString(36).slice(3).replace(/\d+/g, '');
}