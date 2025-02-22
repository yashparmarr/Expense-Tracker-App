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

// Add an expense
function addExpense() {
  const category = document.getElementById('category').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;

  // Validate inputs
  if (!category || isNaN(amount) || !date) {
    alert('Please fill all fields correctly.');
    return;
  }

  // Create expense object
  const expense = { category, amount, date };

  // Add to expenses array and save to localStorage
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  // Clear input fields
  document.getElementById('category').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('date').value = '';

  // Update UI
  renderExpenses();
  renderTrends();
  checkBudgets();
  updateCharts();
  provideFinancialAdvice();
  calculateTaxes()
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
        <td class="p-3">Rs${expense.amount.toFixed(2)}</td>
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
  
    // Ensure the element exists before modifying it
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
          <span class="font-semibold">${category}:</span> Rs${total.toFixed(2)}
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
              <span class="font-semibold">${budget.category}:</span> Rs${totalSpent.toFixed(2)} / Rs${budget.limitAmount.toFixed(2)} (${status})
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
  
    // if (isNaN(annualIncome)) {
    //   alert('Please enter a valid annual income.');
    //   return;
    // }
  
    // Calculate total expenses
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  
    // Calculate taxable income (income - expenses)
    const taxableIncome = annualIncome - totalExpenses;
  
    // Simple tax calculation (for demonstration purposes)
    const taxRate = 0.1; // Assume a flat tax rate of 20%
    const estimatedTax = taxableIncome * taxRate;
  
    // Display tax results
    const taxResults = document.getElementById('tax-results');
    taxResults.innerHTML = `
      <div class="bg-green-50 p-3 rounded-lg">
        <strong>Annual Income:</strong> Rs${annualIncome.toFixed(2)}
      </div>
      <div class="bg-green-50 p-3 rounded-lg">
        <strong>Total Expenses:</strong> Rs${totalExpenses.toFixed(2)}
      </div>
      <div class="bg-green-50 p-3 rounded-lg">
        <strong>Taxable Income:</strong> Rs${taxableIncome.toFixed(2)}
      </div>
      <div class="bg-green-50 p-3 rounded-lg">
        <strong>Estimated Tax:</strong> Rs${estimatedTax.toFixed(2)}
      </div>
    `;
  
    // Display potential deductions
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
  
    // Display potential credits
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
  
    // Display tax planning tips
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

// PAYMENT INTEGRATION
  document.getElementById("pay-btn").addEventListener("click", function () {
    var options = {
        "key": "YOUR_RAZORPAY_KEY", // Replace with your API key
        "amount": 50000, // Amount in paise (₹500)
        "currency": "INR",
        "name": "Expense Tracker",
        "description": "Payment for Expense",
        "handler": function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            addTransaction(500, "Paid via Razorpay", new Date().toISOString().split("T")[0]);
        },
        "prefill": {
            "name": "User Name",
            "email": "user@example.com",
            "contact": "9999999999"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp = new Razorpay(options);
    rzp.open();
});
