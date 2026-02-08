// Expense Tracker Application
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingId = null;

// DOM Elements
const expenseForm = document.getElementById('form');
const descriptionInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const expenseList = document.getElementById('list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const typeSelect = document.getElementById('type');
const clearAllBtn = document.getElementById('clearAll');

// Event Listeners
expenseForm.addEventListener('submit', handleSubmit);
clearAllBtn.addEventListener('click', clearAll);

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    
    const transaction = {
        id: Date.now(),
        description: descriptionInput.value.trim(),
        amount: parseFloat(amountInput.value),
        type: typeSelect.value,
        category: categoryInput.value
    };
    
    expenses.push(transaction);
    saveExpenses();
    expenseForm.reset();
    renderExpenses();
    updateTotals();
}

// Save to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Delete expense
function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    saveExpenses();
    renderExpenses();
    updateTotals();
}

// Clear all transactions
function clearAll() {
    if (confirm('Are you sure you want to clear all transactions?')) {
        expenses = [];
        saveExpenses();
        renderExpenses();
        updateTotals();
    }
}

// Render expenses
function renderExpenses() {
    expenseList.innerHTML = '';
    
    if (expenses.length === 0) {
        expenseList.innerHTML = '<li class="empty">No transactions yet. Add your first transaction!</li>';
        return;
    }

    expenses.forEach(transaction => {
        const li = document.createElement('li');
        li.className = transaction.type;
        
        li.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-category">${transaction.category}</span>
                <span class="transaction-desc">${transaction.description}</span>
            </div>
            <div class="transaction-amount">
                <span class="amount ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}₹${Math.abs(transaction.amount).toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteExpense(${transaction.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        expenseList.appendChild(li);
    });
}

// Update totals
function updateTotals() {
    const incomeTotal = expenses
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenseTotal = expenses
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = incomeTotal - expenseTotal;
    
    balanceEl.textContent = `₹${balance.toFixed(2)}`;
    incomeEl.textContent = `₹${incomeTotal.toFixed(2)}`;
    expenseEl.textContent = `₹${expenseTotal.toFixed(2)}`;
}

// Initialize
renderExpenses();
updateTotals();
