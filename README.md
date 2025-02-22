# Expense Tracker

A modern and user-friendly **Expense Tracker** application built with **HTML**, **CSS**, **JavaScript**, and **Chart.js**. This application helps users track their expenses, set budgets, visualize spending patterns, and calculate taxes.

---

## Features

- **Add Expenses**: Track your daily expenses with category, amount, and date.
- **Set Budgets**: Define budget limits for different categories.
- **Expense Visualization**: View expense breakdown using **Pie Charts**, **Bar Charts**, and **Line Charts**.
- **Tax Calculator**: Estimate annual taxes based on income.
- **AI Financial Advisor**: Get personalized financial advice.
- **Budget Status**: Monitor your spending against set budgets.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

---

## Screenshots

### Login Page
![Login Page](./screenshots/login.png)
*Login to access the Expense Tracker.*

---

### Signup Page
![Signup Page](./screenshots/signup.png)
*Create a new account to start tracking expenses.*

---

### Expense Tracker Dashboard
![Dashboard](./screenshots/dashboard.png)
*Add expenses, set budgets, and view spending trends.*

---

### Expense Visualization
![Visualization](./screenshots/visualization.png)
*Interactive charts for expense breakdown and trends.*

---

### Tax Calculator
![Tax Calculator](./screenshots/tax-calculator.png)
*Calculate your annual taxes and view tax-saving tips.*

---

### Budget Status
![Budget Status](./screenshots/budget-status.png)
*Track your spending against budget limits.*

---

## Difficulties Faced

1. **Currency Formatting**:
   - Displaying all amounts in **Indian Rupees (₹)** required custom JavaScript functions to format numbers using `Intl.NumberFormat`.

2. **Chart Integration**:
   - Integrating **Chart.js** for dynamic data visualization was challenging, especially updating charts in real-time when new expenses were added.

3. **Responsive Design**:
   - Ensuring the application looked good on both desktop and mobile devices required careful use of **Tailwind CSS** and custom media queries.

4. **State Management**:
   - Managing the state of expenses, budgets, and tax calculations without a backend or framework like React was tricky. Local storage was used to persist data temporarily.

5. **Animations**:
   - Adding smooth animations and transitions using CSS keyframes and Tailwind classes required fine-tuning to avoid performance issues.

---

## Technologies Used

- **Frontend**:
  - HTML, CSS, JavaScript
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [Chart.js](https://www.chartjs.org/) for data visualization

- **Tools**:
  - GitHub for version control
  - Visual Studio Code as the code editor

---

## How to Run the Project

1. **Clone the Repository**:
   ```bash
   https://yashparmarr.github.io/Expense-Tracker-App/
   cd expense-tracker
   ```

2. **Open the Project**:
   - Open the `index.html` file in your browser.

3. **Use the Application**:
   - Start adding expenses, setting budgets, and exploring the features.

---

## Future Improvements

- Add user authentication and backend integration to store data securely.
- Implement expense categorization and filtering.
- Add export functionality to download expense reports as CSV or PDF.
- Integrate with financial APIs for real-time tax calculations.

---


## Contributing

Contributions are welcome! If you find any issues or have suggestions, please open an issue or submit a pull request.
