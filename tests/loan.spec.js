import { test, expect } from '@playwright/test';
import { Home } from "../pages/HomePage.page";
import inputData from '../data/input.json' assert { type: 'json' };
import { calculateEMI ,calculateTotalInterest} from '../utils/utils';


let page;
let HomePage;
let context;
let caremi;
let cartotalIntrest;
let homeemi;
let hometotalIntrest;
let personalemi;
let personaltotalIntrest;



test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    HomePage = new Home(page);
})

test('car-emi', async () => {
    await test.step("Open the browser and navigate to the home page", async () => {
        await HomePage.navigateTo();
    });
    await test.step("Select Loan Type", async () => {
        await HomePage.selectloantype(inputData[0].type);
    });
    await test.step("Fill in the loan amount", async () => {
        await HomePage.fillloanamt(inputData[0].amount);
    });
    await test.step("Fill Interest Percentage", async () => {
        await HomePage.fillinterestrate(inputData[0].intrest);
    });
    await test.step("Fill Loan Tenure", async () => {
        await HomePage.fillLoantenure(inputData[0].tenure);
        await page.waitForLoadState("networkidle");
    });
    await test.step("Check whether sliders are visible and values are changing", async () =>{
        expect(page.locator('//div[@id="loanamountslider"]/div')).toBeVisible(inputData[0].loanamtwidth);
        expect(await HomePage.returnloanamtwidth()).toBe(inputData[0].loanamtwidth);

        expect(page.locator('//div[@id="loaninterestslider"]/div')).toBeVisible(inputData[0].loanintrestwidth);
        expect(await HomePage.returnloanintrestwidth()).toBe(inputData[0].loanintrestwidth);

        expect(page.locator('//div[@id="loantermslider"]/div')).toBeVisible(inputData[0].loantenurewidth);
        expect(await HomePage.returnloantermwidth()).toBe(inputData[0].loantenurewidth);

        // expect(await page.screenshot()).toMatchSnapshot("car-emi.png")


    })
    await test.step("Extract and Validate Monthly EMI and Total Interest", async () => {
        // Extract from webpage
        caremi = await HomePage.extracttotalemi();
        cartotalIntrest = await HomePage.extracttotalIntrest();
      
        // Parse input data
        const principal = parseFloat(inputData[0].amount);
        const annualRate = parseFloat(inputData[0].intrest);
        const tenureYears = parseFloat(inputData[0].tenure);
        const tenureMonths = tenureYears * 12;
      

        const emicalculated = calculateEMI(principal, annualRate, tenureMonths);
        const totalInterestCalculated = calculateTotalInterest(emicalculated, tenureMonths, principal);
      
        const emiDifference = Math.abs(emicalculated - caremi);
        const interestDifference = Math.abs(totalInterestCalculated - cartotalIntrest);
      
        const tolerance = 1; 
      
        console.log(`🧮 Calculated EMI: ${emicalculated.toFixed(2)} | Extracted EMI: ${caremi}`);
        console.log(`🧮 Calculated Total Interest: ${totalInterestCalculated.toFixed(2)} | Extracted Total Interest: ${cartotalIntrest}`);
      
        expect(emiDifference).toBeLessThanOrEqual(tolerance);
        expect(interestDifference).toBeLessThanOrEqual(tolerance);
      });
      

    await HomePage.exportEMITableToExcel('data/car-emi-data.xlsx');
    console.log(caremi,cartotalIntrest)
});

test('home-emi', async () => {
    await test.step("Open the browser and navigate to the home page", async () => {
        await HomePage.navigateTo();
    });
    await test.step("Select Loan Type", async () => {
        await HomePage.selectloantype(inputData[1].type);
    });
    await test.step("Fill in the loan amount", async () => {
        await HomePage.fillloanamt(inputData[1].amount);
    });
    await test.step("Fill Interest Percentage", async () => {
        await HomePage.fillinterestrate(inputData[1].intrest);
    });
    await test.step("Fill Loan Tenure", async () => {
        await HomePage.fillLoantenure(inputData[1].tenure);
        await page.waitForLoadState("networkidle");
    });
    await test.step("Check whether sliders are visible and values are changing", async () =>{
        expect(page.locator('//div[@id="loanamountslider"]/div')).toBeVisible();
        expect(await HomePage.returnloanamtwidth()).toBe(inputData[1].loanamtwidth);

        expect(page.locator('//div[@id="loaninterestslider"]/div')).toBeVisible();
        expect(await HomePage.returnloanintrestwidth()).toBe(inputData[1].loanintrestwidth);

        expect(page.locator('//div[@id="loantermslider"]/div')).toBeVisible();
        expect(await HomePage.returnloantermwidth()).toBe(inputData[1].loantenurewidth);
        // expect(await page.screenshot()).toMatchSnapshot("home-emi.png")
    })
    await test.step("Extract and Validate Monthly EMI and Total Interest", async () => {
        // Extract from webpage
        homeemi = await HomePage.extracttotalemi();
        hometotalIntrest = await HomePage.extracttotalIntrest();
      
        // Parse input data
        const principal = parseFloat(inputData[1].amount);
        const annualRate = parseFloat(inputData[1].intrest);
        const tenureYears = parseFloat(inputData[1].tenure);
        const tenureMonths = tenureYears * 12;
      

        const emicalculated = calculateEMI(principal, annualRate, tenureMonths);
        const totalInterestCalculated = calculateTotalInterest(emicalculated, tenureMonths, principal);
      
        const emiDifference = Math.abs(emicalculated - homeemi);
        const interestDifference = Math.abs(totalInterestCalculated - hometotalIntrest);
      
        const tolerance = 1; // adjust this based on acceptable rounding difference
      
        console.log(`🧮 Calculated EMI: ${emicalculated.toFixed(2)} | Extracted EMI: ${homeemi}`);
        console.log(`🧮 Calculated Total Interest: ${totalInterestCalculated.toFixed(2)} | Extracted Total Interest: ${hometotalIntrest}`);
      
        expect(emiDifference).toBeLessThanOrEqual(tolerance);
        expect(interestDifference).toBeLessThanOrEqual(tolerance);
      });
    console.log(homeemi, hometotalIntrest);
    await HomePage.exportEMITableToExcel('data/home-emi-data.xlsx');
});

test('personal-emi', async () => {
    await test.step("Open the browser and navigate to the home page", async () => {
        await HomePage.navigateTo();
    });
    await test.step("Select Loan Type", async () => {
        await HomePage.selectloantype(inputData[2].type);
    });
    await test.step("Fill in the loan amount", async () => {
        await HomePage.fillloanamt(inputData[2].amount);
    });
    await test.step("Fill Interest Percentage", async () => {
        await HomePage.fillinterestrate(inputData[2].intrest);
    });
    await test.step("Fill Loan Tenure", async () => {
        await HomePage.fillLoantenure(inputData[2].tenure);
        await page.waitForLoadState("networkidle");
    });
    await test.step("Check whether sliders are visible and values are changing", async () =>{
        expect(page.locator('//div[@id="loanamountslider"]/div')).toBeVisible();
        expect(await HomePage.returnloanamtwidth()).toBe(inputData[2].loanamtwidth);

        expect(page.locator('//div[@id="loaninterestslider"]/div')).toBeVisible();
        expect(await HomePage.returnloanintrestwidth()).toBe(inputData[2].loanintrestwidth);

        expect(page.locator('//div[@id="loantermslider"]/div')).toBeVisible();
        expect(await HomePage.returnloantermwidth()).toBe(inputData[2].loantenurewidth);

        // expect(await page.screenshot()).toMatchSnapshot("personal-emi.png")

    })
    await test.step("Extract and Validate Monthly EMI and Total Interest", async () => {
        // Extract from webpage
        personalemi = await HomePage.extracttotalemi();
        personaltotalIntrest = await HomePage.extracttotalIntrest();
      
        // Parse input data
        const principal = parseFloat(inputData[2].amount);
        const annualRate = parseFloat(inputData[2].intrest);
        const tenureYears = parseFloat(inputData[2].tenure);
        const tenureMonths = tenureYears * 12;
      

        const emicalculated = calculateEMI(principal, annualRate, tenureMonths);
        const totalInterestCalculated = calculateTotalInterest(emicalculated, tenureMonths, principal);
      
        const emiDifference = Math.abs(emicalculated - personalemi);
        const interestDifference = Math.abs(totalInterestCalculated - personaltotalIntrest);
      
        const tolerance = 1; // adjust this based on acceptable rounding difference
      
        console.log(`🧮 Calculated EMI: ${emicalculated.toFixed(2)} | Extracted EMI: ${personalemi}`);
        console.log(`🧮 Calculated Total Interest: ${totalInterestCalculated.toFixed(2)} | Extracted Total Interest: ${personaltotalIntrest}`);
      
        expect(emiDifference).toBeLessThanOrEqual(tolerance);
        expect(interestDifference).toBeLessThanOrEqual(tolerance);
      });
    console.log(homeemi, hometotalIntrest);
    await HomePage.exportEMITableToExcel('data/personal-emi-data.xlsx');
});

