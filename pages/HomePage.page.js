const ExcelJS = require('exceljs');
export class Home {
    constructor(page) {
        this.page = page;
        this.url = "https://emicalculator.net/";
        this.carLoan = page.locator("#car-loan a");
        this.personalLoan = page.locator("#personal-loan a");
        this.homeLoan = page.locator("#home-loan a");
        this.loanAmt = page.locator('#loanamount');
        this.interestRate = page.locator('#loaninterest');
        this.loanTenure = page.locator('#loanterm');
        this.totalintrest = page.locator("#emitotalinterest p span")
        this.totalemi = page.locator("#emiamount p span");
        this.loanamtslider = page.locator('//div[@id="loanamountslider"]/div');
        this.loanintrestslider=page.locator('//div[@id="loaninterestslider"]/div');
        this.loantermslider=page.locator('//div[@id="loantermslider"]/div')

    }

    async navigateTo() {
        await this.page.goto(this.url);
    }

    async selectloantype(loantype) {
        if (loantype === "homeloan") {
            await this.homeLoan.click();
        }
        else if (loantype === "carloan") {
            await this.carLoan.click();
        }
        else if (loantype === "personalloan") {
            await this.personalLoan.click();
        }
    }

    async fillloanamt(amount) {
        await this.loanAmt.fill(amount);
        await this.page.keyboard.press("Enter");
    }
    async fillinterestrate(rate) {
        await this.interestRate.fill(rate);
        await this.page.keyboard.press("Enter");

    }
    async fillLoantenure(percent) {
        await this.loanTenure.fill(percent);
        await this.page.keyboard.press("Enter");
    }
    async extracttotalIntrest() {
        // Await innerText() and then apply replaceAll
        const text = await this.totalintrest.innerText();
        return parseInt(text.replaceAll(',', ''));
    }
    async extracttotalemi() {
        // Await innerText() and then apply replaceAll
        const text = await this.totalemi.innerText();
        return parseInt(text.replaceAll(',', ''));
    }
    async returnloanamtwidth() {
        return await this.loanamtslider.getAttribute('style');
    }
    async returnloanintrestwidth() {
        return await this.loanintrestslider.getAttribute('style');
    }
    async returnloantermwidth(){
        return await this.loantermslider.getAttribute('style');
    }


    async exportEMITableToExcel(filePath) {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('EMI Payment Schedule', {
        views: [{ state: 'frozen', ySplit: 1 }] // Freeze header row
      });
    
      // Define header row with styling
      const headerRow = sheet.addRow([
        'Year/Month',
        'Principal (A)',
        'Interest (B)',
        'Total Payment (A + B)',
        'Balance',
        'Loan Paid To Date (%)'
      ]);
    
      // Header styles
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' } // Blue header background
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    
      // Set column widths
      sheet.columns = [
        { key: 'yearMonth', width: 20 },
        { key: 'principal', width: 15 },
        { key: 'interest', width: 15 },
        { key: 'totalPayment', width: 18 },
        { key: 'balance', width: 15 },
        { key: 'paidToDate', width: 20 }
      ];
    
      // Helper function to format currency cells
      const applyCurrencyFormat = cell => {
        cell.numFmt = '"₹"#,##0.00;[Red]-"₹"#,##0.00';
        cell.alignment = { horizontal: 'right' };
      };
    
      // Helper function to format percentage cells
      const applyPercentageFormat = cell => {
        cell.numFmt = '0.00%';
        cell.alignment = { horizontal: 'right' };
      };
    
      // Get all year rows
      const yearRows = await this.page.$$('#emipaymenttable .yearlypaymentdetails');
    
      for (const yearRow of yearRows) {
        // Extract yearly data
        const year = await yearRow.$eval('.paymentyear', el => el.textContent.trim());
        const principalStr = await yearRow.$eval('.col-sm-2.currency', el => el.textContent.trim());
        const interestStr = await yearRow.$eval('.col-sm-2.currency:nth-of-type(2)', el => el.textContent.trim());
        const totalStr = await yearRow.$eval('.col-sm-3.currency', el => el.textContent.trim());
        const balanceStr = await yearRow.$eval('.col-4.currency', el => el.textContent.trim());
        const paidToDateStr = await yearRow.$eval('.paidtodateyear', el => el.textContent.trim());
    
        // Parse currency and percentage strings to numbers (remove ₹, commas, %)
        const principal = parseFloat(principalStr.replace(/[^0-9.-]+/g, '')) || 0;
        const interest = parseFloat(interestStr.replace(/[^0-9.-]+/g, '')) || 0;
        const total = parseFloat(totalStr.replace(/[^0-9.-]+/g, '')) || 0;
        const balance = parseFloat(balanceStr.replace(/[^0-9.-]+/g, '')) || 0;
        const paidToDate = parseFloat(paidToDateStr.replace(/[^0-9.-]+/g, '')) / 100 || 0; // percent
    
        // Add yearly row with styling
        const yRow = sheet.addRow([year, principal, interest, total, balance, paidToDate]);
    
        // Yearly row style
        yRow.font = { bold: true };
        yRow.getCell(1).alignment = { horizontal: 'left' };
        applyCurrencyFormat(yRow.getCell(2));
        applyCurrencyFormat(yRow.getCell(3));
        applyCurrencyFormat(yRow.getCell(4));
        applyCurrencyFormat(yRow.getCell(5));
        applyPercentageFormat(yRow.getCell(6));
    
        // Monthly container selector
        const monthRowSelector = `#monthyear${year}`;
    
        // Show monthly container
        await this.page.evaluate(selector => {
          const container = document.querySelector(selector + ' .monthlypaymentcontainer');
          if (container) container.style.display = 'block';
        }, monthRowSelector);
    
        await this.page.waitForTimeout(200);
    
        const monthContainer = await this.page.$(`${monthRowSelector} .monthlypaymentcontainer`);
    
        if (!monthContainer) {
          console.warn(`⚠️ Monthly payment container NOT found for selector: ${monthRowSelector}`);
          continue;
        }
    
        const monthRows = await monthContainer.$$('tbody > .row.no-margin');
    
        for (const row of monthRows) {
          const month = await row.$eval('.paymentmonthyear', el => el.textContent.trim());
          const mPrincipalStr = await row.$eval('.col-sm-2.currency', el => el.textContent.trim());
          const mInterestStr = await row.$eval('.col-sm-2.currency:nth-of-type(2)', el => el.textContent.trim());
          const mTotalStr = await row.$eval('.col-sm-3.currency', el => el.textContent.trim());
          const mBalanceStr = await row.$eval('.col-4.currency', el => el.textContent.trim());
          const mPaidToDateStr = await row.$eval('.paidtodatemonthyear', el => el.textContent.trim());
    
          const mPrincipal = parseFloat(mPrincipalStr.replace(/[^0-9.-]+/g, '')) || 0;
          const mInterest = parseFloat(mInterestStr.replace(/[^0-9.-]+/g, '')) || 0;
          const mTotal = parseFloat(mTotalStr.replace(/[^0-9.-]+/g, '')) || 0;
          const mBalance = parseFloat(mBalanceStr.replace(/[^0-9.-]+/g, '')) || 0;
          const mPaidToDate = parseFloat(mPaidToDateStr.replace(/[^0-9.-]+/g, '')) / 100 || 0;
    
          // Add monthly row
          const mRow = sheet.addRow([`${year} - ${month}`, mPrincipal, mInterest, mTotal, mBalance, mPaidToDate]);
    
          // Monthly row style: lighter font, indent first cell
          mRow.font = { italic: true, color: { argb: 'FF555555' } };
          mRow.getCell(1).alignment = { indent: 1, horizontal: 'left' };
          applyCurrencyFormat(mRow.getCell(2));
          applyCurrencyFormat(mRow.getCell(3));
          applyCurrencyFormat(mRow.getCell(4));
          applyCurrencyFormat(mRow.getCell(5));
          applyPercentageFormat(mRow.getCell(6));
        }
      }
    
      // Add borders around all used cells for neatness
      sheet.eachRow({ includeEmpty: false }, row => {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          };
        });
      });
    
      // Save the workbook to file
      await workbook.xlsx.writeFile(filePath);
      console.log(`✅ EMI data (yearly + monthly) exported and formatted to ${filePath}`);
    }
    
    
      
      
}