const transactions = [];

/**
 * Adds a new transaction from form data, appends it to the table, and updates total.
 * @param {Object} formData - The data from the form.
 * @param {string} formData.date - Date and time of the transaction.
 * @param {string|number} formData.amount - Amount of the transaction.
 * @param {string} formData.category - Category of the transaction.
 * @param {string} formData.description - Description of the transaction.
 */
function addTransaction(formData) {
    const transaction = {
        id: transactions.length + 1,
        date: new Date(formData.date),
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description
    };

    transactions.push(transaction);

    const tbody = document.querySelector('#transactionsTable tbody');
    const tr = document.createElement('tr');

    tr.style.color = transaction.amount >= 0 ? 'green' : 'red';

    const shortDescription = transaction.description.split(' ').slice(0, 4).join(' ');

    tr.innerHTML = `
        <td>${transaction.id}</td>
        <td>${transaction.date.toLocaleString()}</td>
        <td>${transaction.category}</td>
        <td>${shortDescription}</td>
        <td><button class="delete-btn" data-id="${transaction.id}">Удалить</button></td>
    `;
    tbody.appendChild(tr);
    calculateTotal();
}

/**
 * Calculates the total amount of all transactions and updates it on the page.
 */
function calculateTotal() {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    document.getElementById('totalAmount').textContent = total.toFixed(2);
}

/**
 * Deletes a transaction by its ID from both the transactions array and the table.
 * Also reorders the remaining transactions and updates the total.
 * @param {number} id - The ID of the transaction to delete.
 */
function deleteTransaction(id) {
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
        return;
    }

    transactions.splice(index, 1);

    const tbody = document.querySelector('#transactionsTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    for (const row of rows) {
        const btn = row.querySelector('button.delete-btn');

        if (btn && Number(btn.dataset.id) === id) {
            tbody.removeChild(row);
            break;
        }
    }

    for (let i = 0; i < transactions.length; i++) {
        transactions[i].id = i + 1;

        const row = tbody.querySelectorAll('tr')[i];

        row.querySelector('td:first-child').textContent = transactions[i].id;
        row.querySelector('button.delete-btn').dataset.id = transactions[i].id;
    }

    calculateTotal();
}

/**
 * Event handler for form submission to create a new transaction.
 * @param {Event} event - The form submit event.
 */
document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(this));

    addTransaction(formData);

    this.reset();
});

/**
 * Event handler for deleting transactions using event delegation.
 * Listens for clicks on delete buttons inside the table.
 * @param {Event} event - The click event.
 */
document.querySelector('#transactionsTable').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const id = Number(event.target.dataset.id);
        deleteTransaction(id);
    }
});


/**
 * Event handler for displaying the full description of a transaction when a table row is clicked.
 * @param {Event} event - The click event.
 */
document.querySelector('#transactionsTable tbody').addEventListener('click', function(event) {
    const tr = event.target.closest('tr');
    if (!tr) {
        return;
    }

    const btn = tr.querySelector('button.delete-btn');
    if (!btn) {
        return;
    }

    const id = Number(btn.dataset.id);
    const transaction = transactions.find(t => t.id === id);

    if (!transaction) { 
        return;
    }

    document.getElementById('fullDescription').textContent = transaction.description;
});
