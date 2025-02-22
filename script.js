// Load expenses and budgets from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budgets = JSON.parse(localStorage.getItem('budgets')) || [];

// Chart instances
let pieChart, barChart, lineChart;

// Ensure DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {
  console.log("Script loaded successfully!"); // Debugging log
  renderExpenses();
  renderTrends();
  checkBudgets();
  provideFinancialAdvice();
  updateCharts();
  calculateTaxes()
});

function loadUserData() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
  
    expenses = JSON.parse(localStorage.getItem(`expenses_${currentUser}`)) || [];
    budgets = JSON.parse(localStorage.getItem(`budgets_${currentUser}`)) || [];
  
    renderExpenses();
    checkBudgets();
    updateCharts();
    provideFinancialAdvice();
  }
  
  // Modify addExpense function
  function addExpense() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
  
    const category = document.getElementById('category').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
  
    if (!category || isNaN(amount) || !date) {
      alert('Please fill all fields correctly.');
      return;
    }
  
    const expense = { category, amount, date };
    expenses.push(expense);
    localStorage.setItem(`expenses_${currentUser}`, JSON.stringify(expenses));
  
    document.getElementById('category').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';
  
    renderExpenses();
    renderTrends();
    checkBudgets();
    updateCharts();
    provideFinancialAdvice();
  }
  
// Set a budget
function setBudget() {
    const category = document.getElementById('budget-category').value.trim();
    const limitAmount = parseFloat(document.getElementById('budget-limit').value);
  
    // Validate inputs
    if (!category || isNaN(limitAmount)) {
      alert('Please fill all fields correctly.');
      return;
    }
  
    // Check if budget already exists for category
    const existingBudget = budgets.find(b => b.category === category);
    if (existingBudget) {
      existingBudget.limitAmount = limitAmount;
    } else {
      budgets.push({ category, limitAmount });
    }
  
    // Save to localStorage
    localStorage.setItem('budgets', JSON.stringify(budgets));
  
    // Clear input fields
    document.getElementById('budget-category').value = '';
    document.getElementById('budget-limit').value = '';
  
    // Update UI
    checkBudgets();
  }
// Render expenses in the table
function renderExpenses() {
    const tbody = document.querySelector('#expense-table tbody');
    tbody.innerHTML = expenses
      .map(
        (expense, index) => `
        <tr>
          <td class="p-3">${expense.category}</td>
          <td class="p-3">₹${expense.amount.toFixed(2)}</td>
          <td class="p-3">${expense.date}</td>
          <td class="p-3">
            <button class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition" onclick="deleteExpense(${index})">
              Delete
            </button>
          </td>
        </tr>
      `
      )
      .join('');
  }

// Delete an expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
  renderTrends();
  checkBudgets();
  updateCharts();
}
// Render spending trends
function renderTrends() {
    const trendsChart = document.getElementById('trends-chart');
  
    if (!trendsChart) {
      console.error("Element with ID 'trends-chart' not found.");
      return;
    }
  
    const trends = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
  
    trendsChart.innerHTML = Object.entries(trends)
      .map(
        ([category, total]) => `
        <div class="bg-blue-50 p-3 rounded-lg">
          <span class="font-semibold">${category}:</span> ₹${total.toFixed(2)}
        </div>
      `
      )
      .join('');
  }

// Check budget status
function checkBudgets() {
    const trends = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
  
    const budgetStatus = document.getElementById('budget-status');
    budgetStatus.innerHTML = budgets
      .map((budget, index) => {
        const totalSpent = trends[budget.category] || 0;
        const status = totalSpent >= budget.limitAmount ? '❌ Exceeded' : '✅ Within Limit';
        return `
          <div class="bg-green-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <span class="font-semibold">${budget.category}:</span> ₹${totalSpent.toFixed(2)} / ₹${budget.limitAmount.toFixed(2)} (${status})
            </div>
            <button class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition" onclick="removeBudget(${index})">
              Delete
            </button>
          </div>
        `;
      })
      .join('');
  }

// Update Charts
function updateCharts() {
  const pieCanvas = document.getElementById('pieChart');
  const barCanvas = document.getElementById('barChart');
  const lineCanvas = document.getElementById('lineChart');

  if (!pieCanvas || !barCanvas || !lineCanvas) {
    console.error("Canvas elements not found.");
    return;
  }

  const pieCtx = pieCanvas.getContext('2d');
  const barCtx = barCanvas.getContext('2d');
  const lineCtx = lineCanvas.getContext('2d');

  if (!pieCtx || !barCtx || !lineCtx) {
    console.error("Failed to get canvas 2D context.");
    return;
  }

  // Destroy previous charts if they exist
  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();
  if (lineChart) lineChart.destroy();

  // Get expense data
  const trends = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categories = Object.keys(trends);
  const amounts = Object.values(trends);

  // Pie Chart (Expense Breakdown)
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      }],
    },
  });

  // Bar Chart (Expense Trends)
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Amount Spent',
        data: amounts,
        backgroundColor: '#36A2EB',
      }],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // Line Chart (Monthly Spending)
  const monthlySpending = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'long' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const months = Object.keys(monthlySpending);
  const monthlyAmounts = Object.values(monthlySpending);

  lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Monthly Spending',
        data: monthlyAmounts,
        borderColor: '#FF6384',
        fill: false,
      }],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}


// Provide AI-driven financial advice
function provideFinancialAdvice() {
    const trends = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
  
    const totalSpending = Object.values(trends).reduce((acc, amount) => acc + amount, 0);
    const averageSpending = totalSpending / Object.keys(trends).length || 0;
  
    const advice = [];
  
    // Identify overspending categories
    for (const [category, amount] of Object.entries(trends)) {
      const budget = budgets.find((b) => b.category === category);
      if (budget && amount > budget.limitAmount) {
        advice.push(`You are overspending on <strong>${category}</strong>. Consider reducing expenses in this category.`);
      }
    }
  
    // Suggest savings
    if (totalSpending > averageSpending * 1.5) {
      advice.push('Your spending is higher than average. Consider cutting back on non-essential expenses.');
    } else {
      advice.push('Your spending is within a healthy range. Keep it up!');
    }
  
    // Display advice
    const aiAdvice = document.getElementById('ai-advice');
    aiAdvice.innerHTML = advice.map((a) => `<div class="bg-yellow-50 p-3 rounded-lg">${a}</div>`).join('');
  }

 // Taxes Calculator
 function calculateTaxes() {
    const annualIncome = parseFloat(document.getElementById('annual-income').value);
  
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  
    // Calculate taxable income (income - expenses)
    const taxableIncome = annualIncome - totalExpenses;
  
    // Simple tax calculation (for demonstration purposes)
    const taxRate = 0.1; // Assume a flat tax rate of 10%
    const estimatedTax = taxableIncome * taxRate;
  
    const taxResults = document.getElementById('tax-results');
    taxResults.innerHTML = `
      <div class="bg-green-50 p-3 rounded-lg">
        <strong>Annual Income:</strong> ₹${annualIncome.toFixed(2)}
      </div>
      <div class="bg-green-50 p-3 rounded-lg">
        <strong>Total Expenses:</strong> ₹${totalExpenses.toFixed(2)}
      </div>
      <div class="bg-green-50 p-3 rounded-lg">
        <strong>Taxable Income:</strong> ₹${taxableIncome.toFixed(2)}
      </div>
      <div class="bg-green-50 p-3 rounded-lg">
        <strong>Estimated Tax:</strong> ₹${estimatedTax.toFixed(2)}
      </div>
    `;
  
    const deductionsList = document.getElementById('deductions-list');
    deductionsList.innerHTML = `
      <div class="bg-blue-50 p-3 rounded-lg">
        <strong>Potential Deductions:</strong>
        <ul class="list-disc list-inside mt-2">
          <li>Medical Expenses</li>
          <li>Education Expenses</li>
          <li>Charitable Donations</li>
          <li>Home Office Expenses</li>
        </ul>
      </div>
    `;
  
    const creditsList = document.getElementById('credits-list');
    creditsList.innerHTML = `
      <div class="bg-blue-50 p-3 rounded-lg">
        <strong>Potential Credits:</strong>
        <ul class="list-disc list-inside mt-2">
          <li>Education Credits</li>
          <li>Child Tax Credit</li>
          <li>Retirement Savings Contributions</li>
        </ul>
      </div>
    `;
  
    const taxTips = document.getElementById('tax-tips');
    taxTips.innerHTML += `
      <div class="bg-yellow-50 p-3 rounded-lg">
        <strong>Tax Planning Tips:</strong>
        <ul class="list-disc list-inside mt-2">
          <li>Maximize contributions to retirement accounts.</li>
          <li>Keep track of all deductible expenses.</li>
          <li>Consider tax-advantaged investments.</li>
        </ul>
      </div>
    `;
  }
  // Remove a budget
function removeBudget(index) {
    // Remove the budget at the specified index
    budgets.splice(index, 1);
  
    // Save the updated budgets to localStorage
    localStorage.setItem('budgets', JSON.stringify(budgets));
  
    // Update the UI
    checkBudgets();
}


// User data (for simplicity, use localStorage; in a real app, use a backend)
let users = JSON.parse(localStorage.getItem('users')) || [];

// DOM Elements
const loginPage = document.getElementById('login-page');
const signupPage = document.getElementById('signup-page');
const expenseTrackerPage = document.getElementById('expense-tracker-page');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Show Signup Page
showSignupLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginPage.classList.add('hidden');
  signupPage.classList.remove('hidden');
});

// Show Login Page
showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  signupPage.classList.add('hidden');
  loginPage.classList.remove('hidden');
});

// Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      alert('Login successful!');
      localStorage.setItem('currentUser', email); // Store logged-in user
      loginPage.classList.add('hidden');
      expenseTrackerPage.classList.remove('hidden');
      loadUserData(); // Load this user's expenses & budgets
    } else {
      alert('Invalid email or password.');
    }
  });
  

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
  
    const userExists = users.some((u) => u.email === email);
    if (userExists) {
      alert('User already exists.');
    } else {
      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem(`expenses_${email}`, JSON.stringify([])); // Store empty expenses for this user
      localStorage.setItem(`budgets_${email}`, JSON.stringify([])); // Store empty budgets
      alert('Signup successful! Please login.');
      signupPage.classList.add('hidden');
      loginPage.classList.remove('hidden');
    }
  });
  
//logout
  function logout() {
    localStorage.removeItem('currentUser'); // Clear session
    document.getElementById('expense-tracker-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    alert('Logged out successfully!');
  }
  

// Show Login Page by default
loginPage.classList.remove('hidden');
signupPage.classList.add('hidden');
expenseTrackerPage.classList.add('hidden');

