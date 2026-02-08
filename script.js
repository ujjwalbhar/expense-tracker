// Expense Tracker Application
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingId = null;

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const expenseList = document.getElementById('expense-list');
const totalAmountEl = document.getElementById('total-amount');
const filterCategory = document.getElementById('filter-category');
const submitBtn = document.querySelector('.submit-btn');

// Set default date to today
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

// Event Listeners
expenseForm.addEventListener('submit', handleSubmit);
filterCategory.addEventListener('change', renderExpenses);

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    
    const expense = {
        id: editingId || Date.now(),
        description: descriptionInput.value.trim(),
        amount: parseFloat(amountInput.value),
        category: categoryInput.value,
        date: dateInput.value
    };
    
    if (editingId) {
        const index = expenses.findIndex(exp => exp.id === editingId);
        expenses[index] = expense;
        editingId = null;
        submitBtn.textContent = 'Add Expense';
    } else {
        expenses.push(expense);
    }
    
    saveExpenses();
    expenseForm.reset();
    dateInput.value = today;
    renderExpenses();
}

// Save to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Delete expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(exp => exp.id !== id);
        saveExpenses();
        renderExpenses();
    }
}

// Edit expense
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
        descriptionInput.value = expense.description;
        amountInput.value = expense.amount;
        categoryInput.value = expense.category;
        dateInput.value = expense.date;
        editingId = id;
        submitBtn.textContent = 'Update Expense';
        descriptionInput.focus();
    }
}

// Render expenses
function renderExpenses() {
    const filterValue = filterCategory.value;
    const filteredExpenses = filterValue === 'all' 
        ? expenses 
        : expenses.filter(exp => exp.category === filterValue);
    
    // Sort by date (newest first)
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    expenseList.innerHTML = '';
    
    if (filteredExpenses.length === 0) {
        expenseList.innerHTML = '<p class="no-expenses">No expenses found. Add your first expense!</p>';
    } else {
        filteredExpenses.forEach(expense => {
            const expenseCard = document.createElement('div');
            expenseCard.className = 'expense-card';
            expenseCard.innerHTML = `
                <div class="expense-details">
                    <div class="expense-header">
                        <h3>${expense.description}</h3>
                        <span class="category-badge ${expense.category}">${formatCategory(expense.category)}</span>
                    </div>
                    <div class="expense-info">
                        <span class="amount">₹${expense.amount.toFixed(2)}</span>
                        <span class="date">${formatDate(expense.date)}</span>
                    </div>
                </div>
                <div class="expense-actions">
                    <button class="edit-btn" onclick="editExpense(${expense.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteExpense(${expense.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            expenseList.appendChild(expenseCard);
        });
    }
    
    updateTotal(filteredExpenses);
}

// Update total amount
function updateTotal(expensesToSum = expenses) {
    const total = expensesToSum.reduce((sum, exp) => sum + exp.amount, 0);
    totalAmountEl.textContent = `₹${total.toFixed(2)}`;
}

// Format category
function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Initialize
renderExpenses();
