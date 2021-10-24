// variables
var create_button = document.querySelector(".tool-add");
var input_box = document.querySelector(".input-box");
var main_ticket_container = document.querySelector('.main-ticket-container');
var input_textarea = document.querySelector('.input-text-area');
var addTicket = false;


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
        createNewTicket();
        input_box.style.display = 'none';
        addTicket = !addTicket;
        input_textarea.value = '';
    }
})


// this function will create a new ticket
function createNewTicket() {
    let newTicket = document.createElement('div');
    newTicket.setAttribute('class', 'ticket-container')
    newTicket.innerHTML = `
    <p class="ticket-id">#adksadjskd</p>
    <div class="task-area">loewn lumsum</div>
    `;
    main_ticket_container.appendChild(newTicket);
}



