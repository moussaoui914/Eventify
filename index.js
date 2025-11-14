// DATA MANAGEMENT
// ============================================

// Your app's data structure
let events = [];
let archive = [];

// Save/load from localStorage
function loadData() {
    const savedEvents = localStorage.getItem('events');
    const savedArchive = localStorage.getItem('archive');
    events = savedEvents ? JSON.parse(savedEvents) : [];
    archive = savedArchive ? JSON.parse(savedArchive) : [];
    // TODO: Load events and archive from localStorage
    // JSON.parse(localStorage.getItem('events'))
}

function saveData() {
    // TODO: Save events and archive to localStorage
    // localStorage.setItem('events', JSON.stringify(events))
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('archive', JSON.stringify(archive));
}

// ============================================
// SCREEN SWITCHING
// ============================================

function switchScreen(screenId) {
    // TODO:
    // 1. Remove .is-active from all .sidebar__btn
    // 2. Add .is-active to [data-screen="${screenId}"]
    // 3. Remove .is-visible from all .screen
    // 4. Add .is-visible to [data-screen="${screenId}"]
    // 5. Update #page-title and #page-subtitle based on screenId
    let sidebar__btn = document.querySelectorAll(".sidebar__btn");
    let screen = document.querySelectorAll(".screen");
    for (el of screen) {
        if (el.dataset.screen === screenId) {
            el.classList.add("is-visible");
        } else {
            el.classList.remove("is-visible");
        }
    }
    for (ele of sidebar__btn) {
        if (ele.dataset.screen === screenId) {
            ele.classList.add("is-active");
        } else {
            ele.classList.remove("is-active");
        }
    }


    const title = document.getElementById('page-title');
    const subtitle = document.getElementById('page-subtitle');
    switch (screenId) {
        case 'stats':
            title.innerHTML = 'Statistics';
            subtitle.innerHTML = 'Overview of your events';
            renderStats();
            break;
        case 'add':
            title.innerHTML = 'Add Event';
            subtitle.innerHTML = 'Create a new event';
            break;
        case 'list':
            title.innerHTML = 'Events';
            subtitle.innerHTML = 'Manage your events';
            break;
        case 'archive':
            title.innerHTML = 'Archive';
            subtitle.innerHTML = 'Archived events';
            break;
    }

}

// let screen = document.querySelectorAll(".screen");
// for(section of screen){
//     section.classList.remove("is-visible");
// }




// Listen to sidebar button clicks
document.querySelectorAll('.sidebar__btn').forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen))
})

// ============================================
// STATISTICS SCREEN
// ============================================

function renderStats() {
    // TODO:
    // Calculate from events array:
    const totalEvents = events.length;
    const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);

    // Update DOM:
    document.getElementById('stat-total-events').textContent = totalEvents;
    document.getElementById('stat-total-seats').textContent = totalSeats;
    document.getElementById('stat-total-price').textContent = '$' + totalPrice.toFixed(2);
}

// ============================================
// ADD EVENT FORM
// ============================================
//     const form = document.getElementById("event-form");

// form.addEventListener("submit", (e) =>{
//     handleFormSubmit(e);
// });
let j = 1;
function handleFormSubmit(e) {
    e.preventDefault();

    const errorBox = document.getElementById("form-errors");
    errorBox.innerHTML = "";
    errorBox.classList.add("is-hidden");

    // 🔹 Récupération des champs
    const title = document.getElementById("event-title").value.trim();
    const desc = document.getElementById("event-description").value.trim();
    const image = document.getElementById("event-image").value.trim();
    const seats = document.getElementById("event-seats").value.trim();
    const price = document.getElementById("event-price").value.trim();

    // 🔹 Regex de validation
    const regexTitle = /^[A-Za-z0-9 ]{3,}$/;
    const regexURL = /^https?:\/\/.+/;
    const regexNumber = /^[0-9]+(\.[0-9]+)?$/;

    let errors = [];

    // 🔹 Validation des champs
    if (!regexTitle.test(title)) {
        errors.push("Le titre doit contenir au moins 3 caractères valides.");
    }

    if (image && !regexURL.test(image)) {
        errors.push("L'URL de l'image doit commencer par http ou https.");
    }

    if (!regexNumber.test(seats) || parseInt(seats) < 1) {
        errors.push("Le nombre de places doit être un nombre positif.");
    }

    if (!regexNumber.test(price) || parseFloat(price) < 0) {
        errors.push("Le prix doit être un nombre valide supérieur ou égal à 0.");
    }

    // 🔹 Affichage des erreurs si nécessaire
    if (errors.length > 0) {
        errorBox.innerHTML = errors.join("<br>");
        errorBox.classList.remove("is-hidden");
        return;
    }

    // =====================================
    // 🔹 Construction du tableau de variants
    // =====================================
    const variantRows = document.querySelectorAll('.variant-row');
    const newVariants = [];

    variantRows.forEach(row => {
        const name = row.querySelector('.variant-row__name').value.trim();
        const qty = parseInt(row.querySelector('.variant-row__qty').value);
        const value = parseFloat(row.querySelector('.variant-row__value').value);
        const type = row.querySelector('.variant-row__type').value;

        if (name && !isNaN(qty) && !isNaN(value)) {
            newVariants.push({
                name,
                qty,
                value,
                type
            });
        }
    });
    // =====================================
    // 🔹 Création du nouvel événement
    // =====================================
    const newEvent = {
        id: j,
        title: title,
        image: image,
        description: desc,
        seats: parseInt(seats),
        price: parseFloat(price),
        variants: newVariants
    };

    // =====================================
    // 🔹 Sauvegarde & mise à jour de l’UI
    // =====================================
    events.push(newEvent);
    j = Number(j + 1);
    saveData();
    renderStats();
    renderEventsTable(events);

    alert("✅ Événement ajouté avec succès !");
    e.target.reset();
}


// 3. If valid: create new event object, add to events array, save data, reset form
// 4. If invalid: show errors in #form-errors

let form = document.getElementById('event-form');
form.addEventListener('submit', handleFormSubmit)

function addVariantRow() {
    // TODO:
    // 1. Clone .variant-row template
    // 2. Append to #variants-list
    // 3. Add remove listener to new row's remove button
    const list = document.getElementById('variants-list');
    const row = document.createElement('div');
    row.classList.add('variant-row');
    row.innerHTML = `
        <input type="text" class="input variant-row__name" placeholder="Variant name" />
        <input type="number" class="input variant-row__qty" placeholder="Qty" min="1" />
        <input type="number" class="input variant-row__value" placeholder="Value" step="0.01" />
        <select class="select variant-row__type">
            <option value="fixed">Fixed Price</option>
            <option value="percentage">Percentage Off</option>
        </select>
        <button type="button" class="btn btn--danger btn--small variant-row__remove">Remove</button>   
    `;
    list.appendChild(row);
    row.querySelector('.variant-row__remove').addEventListener('click', () => row.remove());
}
document.getElementById('btn-add-variant').addEventListener('click', addVariantRow);

// document.getElementById('btn-add-variant').addEventListener('click', addVariantRow)

function removeVariantRow(button) {
    // TODO:
    // Find closest .variant-row and remove it
}


// ============================================
// EVENTS LIST SCREEN
// ============================================

function renderEventsTable(eventList, page = 1, perPage = 10) {
    // TODO:
    // 1. Paginate eventList by page and perPage
    // 2. Generate table rows for each event
    // 3. Add data-event-id to each row
    // 4. Inject into #events-table tbody
    // 5. Call renderPagination()
    // const DataList = localStorage.getItem('events');
    // DataList.map((list)=>{
    //     list 
    // })
    const mainTable = document.querySelector('.table__body');
    mainTable.innerHTML = "";  

    for (const listEvent of eventList) {
        const tr = document.createElement('tr');
        tr.classList.add('table_row');
        tr.dataset.eventId = listEvent.id;

        tr.innerHTML = `
            <td>${listEvent.id}</td>
            <td>${listEvent.title}</td>
            <td>${listEvent.seats}</td>
            <td>$${listEvent.price}</td>
            <td><span class="badge">${listEvent.variants?.length || 0}</span></td>
            <td>
                <button class="btn btn--small" data-action="details" data-event-id="${listEvent.id}">Details</button>
                <button class="btn btn--small" data-action="edit" data-event-id="${listEvent.id}">Edit</button>
                <button class="delete_btn btn btn--danger btn--small" data-action="archive" data-event-id="${listEvent.id}">Delete</button>
            </td>
        `;

        mainTable.appendChild(tr);
    }
}


function renderPagination(totalItems, currentPage, perPage) {
    // TODO:
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / perPage);
    // Generate pagination buttons
    const pagination = document.getElementById('events-pagination');
    for (let i = 1; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn--small');
        if (i == currentPage) {
            btn.classList.add('is-active');
        }
        btn.textContent = i;
        pagination.appendChild(btn);
    }

    // Add .is-active to current page
    // Add .is-disabled to prev/next if at boundary
    // Inject into #events-pagination
}

function handleTableActionClick(e) {
    // TODO:
    // 1. Check if e.target is [data-action]
    const action = e.target.dataset.action;
    const id = e.target.dataset.eventId;
    switch (action) {
        case 'details':
            showEventDetails(id);
            break;
        case 'edit':
            editEvent(id);
            break;
        case 'archive':
            archiveEvent(id);
            break;
    }
    // 2. Get action and eventId from attributes
    // 3. Call appropriate function (showDetails, editEvent, archiveEvent)
    // Use event delegation on #events-table
}

document.getElementById('events-table').addEventListener('click', handleTableActionClick)

function showEventDetails(eventId) {
    // TODO:
    // 1. Find event by id in events array
    const event = events.find(e => e.id == eventId);
    // 2. Populate #modal-body with event details
    // 3. Remove .is-hidden from #event-modal
    const content = `
        <img src="${event.image}" class="modal__img">
        <p><strong>Description:</strong> ${event.description}</p>
        <p><strong>Seats:</strong> ${event.seats}</p>
        <p><strong>Price:</strong> $${event.price.toFixed(2)}</p>
    `;
    openModal(event.title, content);
}

function editEvent(eventId) {
    // TODO:
    // 1. Find event by id
    const ev = events.find(e => e.id == eventId);
    // 2. Populate form fields with event data
    document.getElementById("event-title").value = ev.title;
    document.getElementById("event-image").value = ev.image;
    document.getElementById("event-description").value = ev.description;
    document.getElementById("event-seats").value = ev.seats;
    document.getElementById("event-price").value = ev.price;
    // 3. Switch to 'add' screen
    switchScreen('add');
    // 4. On submit, update existing event instead of creating new
    form.onsubmit = function (e) {
        e.preventDefault();
        ev.title = document.getElementById("event-title").value.trim();
        ev.image = document.getElementById("event-image").value.trim();
        ev.description = document.getElementById("event-description").value.trim();
        ev.seats = parseInt(document.getElementById("event-seats").value);
        ev.price = parseFloat(document.getElementById("event-price").value);
        saveData();
        alert("Event updated!");
        renderEventsTable(events);
        renderStats();
        
        form.reset();
        form.onsubmit = handleFormSubmit;
        switchScreen('list');
    }
}

function archiveEvent(eventId) {
    // TODO:
    // 1. Find event by id in events
    const index = events.findIndex(e => e.id == eventId);
    // 2. Move to archive array
    const [removed] = events.splice(index, 1);
    archive.push(removed);
    // 3. Remove from events array

    // 4. Save data
    saveData();
    // 5. Re-render table
    renderEventsTable(events);
    renderArchiveTable(archive);
}

// ============================================
// ARCHIVE SCREEN
// ============================================

function renderArchiveTable(archivedList) {
    // TODO:
    // Similar to renderEventsTable but read-only
    const tbody = document.querySelector('#archive-table tbody');
    tbody.innerHTML = "";
    // Show "Restore" button instead of "Edit"/"Delete"
    for (element of archivedList) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${element.id}</td>
            <td>${element.title}</td>
            <td>${element.seats}</td>
            <td>$${element.price}</td>
            <td><button class="btn btn--small" data-action="restore" data-event-id="${element.id}">Restore</button></td>
        `;
        tbody.appendChild(tr);
    }
}
document.getElementById('archive-table').addEventListener('click', (e) => {
    if (e.target.dataset.action === 'restore') restoreEvent(e.target.dataset.eventId);
});

function restoreEvent(eventId) {
    // TODO:
    // 1. Find event by id in archive
    const index = archive.findIndex(e => e.id==eventId);
    // 2. Move back to events array
    const [restoreEvent] = archive.splice(index,1);
    events.push(restoreEvent);
    saveData();
    renderArchiveTable(archive);
    renderEventsTable(events);
    // 3. Remove from archive
    // 4. Save data
    // 5. Re-render both tables
}

// ============================================
// MODAL
// ============================================

function openModal(title, content) {
    // TODO:
    const modal = document.getElementById('event-modal');

    // 1. Set #modal-title
    // 2. Set #modal-body content
    // 3. Remove .is-hidden from #event-modal
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    modal.classList.remove('is-hidden');
}

function closeModal() {
    // TODO:
    // Add .is-hidden to #event-modal
    document.getElementById('event-modal').classList.add('is-hidden');
}

// Listen to close button and overlay click
document.getElementById('event-modal').addEventListener('click', (e) => {
    if (e.target.dataset.action === 'close-modal' || e.target.classList.contains('modal__overlay')) {
        closeModal()
    }
})

// ============================================
// SEARCH & SORT
// ============================================

function searchEvents(query) {
    // TODO:
    // Filter events by title (case-insensitive)
    // Return filtered array
}

function sortEvents(eventList, sortType) {
    // TODO:
    // Sort by: title-asc, title-desc, price-asc, price-desc, seats-asc
    // Return sorted array
}

// Listen to search and sort changes
// document.getElementById('search-events').addEventListener('input', (e) => {
//     const filtered = searchEvents(e.target.value)
//     renderEventsTable(filtered)
// })

// document.getElementById('sort-events').addEventListener('change', (e) => {
//     const sorted = sortEvents(events, e.target.value)
//     renderEventsTable(sorted)
// })

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // TODO:
    // 1. Load data from localStorage
    loadData();
    renderStats();
    renderEventsTable(events);
    renderArchiveTable(archive);
    // 2. Render initial screen (statistics)
    // 3. Set up all event listeners
    // 4. Call renderStats(), renderEventsTable(), renderArchiveTable()
}

// Call on page load
document.addEventListener('DOMContentLoaded', init);