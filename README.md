
# 💸 EMI Calculator Automation Suite

![Playwright](https://img.shields.io/badge/Tested%20With-Playwright-green?logo=playwright)
![Node.js](https://img.shields.io/badge/Built%20With-Node.js-blue?logo=node.js)
![Excel](https://img.shields.io/badge/Exports%20To-Excel-green?logo=microsoft-excel)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

## 📘 Project Overview

This project automates and validates the EMI calculations on [emicalculator.net](https://emicalculator.net/) using [Playwright](https://playwright.dev/).  
It extracts EMI, total interest, and loan breakdown details from the webpage and compares them against backend-calculated values using precise financial formulas — exporting the results to Excel for analysis. ✅📊

---

## 🚀 Features

- 🔎 **Automated EMI validation** with tolerance handling
- 📊 **Loan breakdown extraction** with dynamic data scraping
- 📁 **Excel export support** via custom `ExcelUtility`
- 🔄 **Slider width verification** for UI consistency
- 🧪 **Reusable helper functions** for EMI, interest, and validation
- 💡 **Clear console logs** with emoji markers for better debugging

---

## 🧰 Tech Stack

- 🧪 [Playwright](https://playwright.dev/) – End-to-end browser automation
- 📗 Node.js + ES Modules
- 📤 `exceljs` – Excel data output
- 💻 JSON-driven input structure

---

## 📂 Project Structure

```
📦 emi-calculator-automation
│
├── 📁 tests
│   └── loan.spec.js        # Main Playwright test script
│
├── 📁 utils
│   ├── utils.js              # EMI and interest formulas
│
├── 📁 pages
│   └── HomePage.page.js       # Page object for EMI Calculator site
│
├── 📁 data
│   └── input.json                   # Loan input data (principal, interest, tenure)
│
└── README.md
```

---

## 🧠 Core Logic Explained

### 💰 EMI Formula Used

```
EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
```

Where:
- `P` = Principal Loan Amount
- `R` = Monthly Interest Rate (Annual Rate / 12 / 100)
- `N` = Loan Tenure in Months

### 📈 Total Interest

```
Total Interest = (EMI × N) - Principal
```

---

## 🧪 Running the Test

### 1. 🔧 Install Dependencies

```bash
npm install
```

### 2. 🧬 Run the Test

```bash
npx playwright test
```

Or run a specific test:

```bash
npx playwright test tests/loan.spec.js
```

---

## 📊 Sample Output (Console)

```
🧮 Calculated EMI: ₹15,432.12 | Extracted EMI: ₹15,433
🧮 Calculated Total Interest: ₹1,25,682.34 | Extracted Total Interest: ₹1,25,681
📁 Exporting data to LoanResults.xlsx...
✅ EMI and Interest validated within tolerance of ₹1
```

---

