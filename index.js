// clase para crear los objetos de ticket
class Ticket {
    constructor(sector, cantidad) {
        this.sector = sector;
        this.cantidad = cantidad;
    }
}

// precios fijos
const general = 90000;
const vip = 140000;
const servicio = 9000;

// array para almacenar temporalmente tickets
const tickets = [];

// mostrar el mensaje en el DOM
const mostrarMensaje = (mensaje) => {
    const mensajeParrafo = document.getElementById('msj');
    mensajeParrafo.textContent = mensaje;
};

// mostrar los tickets en el DOM
const mostrarTickets = () => {
    const ticketsList = document.getElementById('ticketsList');
    ticketsList.innerHTML = ''; // limpiamos el contenedor

    // iteramos sobre el array 'tickets' para crear elementos: por cada ticket habra un div(para trabajar en linea) con un parrafo y un boton
    for (const [index, ticket] of tickets.entries()) {
        // crear el div
        const ticketItem = document.createElement('div');

        // crear el párrafo con el texto del ticket
        const ticketTexto = document.createElement('p');
        ticketTexto.textContent = `${ticket.cantidad} ticket/s en el sector ${ticket.sector}`;

        // crear el botón de eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarTicket(index);

        // agregar el párrafo y el botón al div
        ticketItem.appendChild(ticketTexto);
        ticketItem.appendChild(eliminarBtn);

        // agregar el div al contenedor
        ticketsList.appendChild(ticketItem);
    }
};

// cargar tickets guardados desde localStorage
const cargarTickets = () => {
    const ticketsGuardados = localStorage.getItem('tickets');
    if (ticketsGuardados) {
        const ticketsArray = JSON.parse(ticketsGuardados);
        for (const ticket of ticketsArray) {
            tickets.push(new Ticket(ticket.sector, ticket.cantidad));
        }
    }
    mostrarTickets(); // mostrar tickets guardados
};

// eliminar un ticket
const eliminarTicket = (index) => {
    tickets.splice(index, 1); // eliminar el ticket del array
    localStorage.setItem('tickets', JSON.stringify(tickets)); // actualizar localStorage
    mostrarTickets(); // actualizar la visualización
    mostrarMensaje("ticket eliminado.");
};

// capturamos el formulario y los botones
const formulario = document.querySelector('form');
const botonAgregarTicket = document.getElementById('agregarTicket');
const botonComprarTickets = document.getElementById('comprarTickets');

// funcion para manejar el evento "agregar ticket"
botonAgregarTicket.addEventListener('click', () => {
    mostrarMensaje(` `); // borrar msj del precio total
    const sector = document.getElementById('sector').value;
    const cantidad = parseInt(document.querySelector('input[name="cantidad"]').value);

    // validacion de los campos antes de agregar el ticket - isNaN comprueba que no este vacia la cantidad de tickets
    if (!sector || isNaN(cantidad) || cantidad < 1) {
        mostrarMensaje("por favor, selecciona un sector y una cantidad valida.");
        return;
    }

    // añadimos el ticket al array
    tickets.push(new Ticket(sector, cantidad));
    localStorage.setItem('tickets', JSON.stringify(tickets)); // actualizar localStorage
    mostrarTickets(); // mostrar tickets actuales

    // limpiamos el formulario para agregar mas tickets
    formulario.reset();
});

// funcion para manejar el evento "comprar tickets"
botonComprarTickets.addEventListener('click', (e) => {
    e.preventDefault(); // prevenimos el comportamiento por defecto del formulario (que no mande formulario)

    // validamos si hay tickets para comprar
    if (tickets.length === 0) {
        mostrarMensaje("no agregaste ningun ticket.");
        return;
    }

    // calculamos el costo total
    let costoTotal = 0;

    for (const ticket of tickets) {
        let precioSector = ticket.sector === 'general' ? general : vip;
        costoTotal += (precioSector * ticket.cantidad) + (servicio * ticket.cantidad); // se cobra servicio por cada ticket
    }

    // mostramos el resultado en el DOM
    mostrarMensaje(`el costo total es: $${costoTotal}`);

    // borramos los tickets del localStorage
    localStorage.removeItem('tickets');
    tickets.length = 0; // limpiamos el array de tickets
    mostrarTickets(); // actualizamos la visualización

    // limpiar el formulario
    formulario.reset();
});

// cargamos los tickets guardados cuando la pagina se carga
cargarTickets();
