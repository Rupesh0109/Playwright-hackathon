import { test, expect } from '@playwright/test';
import { Home } from "../pages/HomePage.page";
import inputData from '../data/input.json' assert { type: 'json' };


let page;
let HomePage;
let context;
let caremi;
let cartotalIntrest;
let homeemi;
let hometotalIntrest;

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

        expect(await page.screenshot()).toMatchSnapshot("car-emi.png")


    })
    await test.step("Extract Monthly EMI", async () => {
        caremi = await HomePage.extracttotalemi();
    });
    await test.step("Extract Total Interest", async () => {
        cartotalIntrest = await HomePage.extracttotalIntrest();
    });
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
        expect(await page.screenshot()).toMatchSnapshot("home-emi.png")
    })
    await test.step("Extract Monthly EMI", async () => {
        homeemi = await HomePage.extracttotalemi();
    });
    await test.step("Extract Total Interest", async () => {
        hometotalIntrest = await HomePage.extracttotalIntrest();
    });
    console.log(homeemi, hometotalIntrest);
});

test('personal-emi', async () => {
    await test.step("Open the browser and navigate to the home page", async () => {
        await HomePage.navigateTo();
    });
    await test.step("Select Loan Type", async () => {
        await HomePage.selectloantype("personalloan");
    });
    await test.step("Fill in the loan amount", async () => {
        await HomePage.fillloanamt("1000000");
    });
    await test.step("Fill Interest Percentage", async () => {
        await HomePage.fillinterestrate("10.5");
    });
    await test.step("Fill Loan Tenure", async () => {
        await HomePage.fillLoantenure("20");
        await page.waitForLoadState("networkidle");
    });
    await test.step("Check whether sliders are visible and values are changing", async () =>{
        expect(page.locator('//div[@id="loanamountslider"]/div')).toBeVisible();
        expect(await HomePage.returnloanamtwidth()).toBe("width: 33.3333%;");

        expect(page.locator('//div[@id="loaninterestslider"]/div')).toBeVisible();
        expect(await HomePage.returnloanintrestwidth()).toBe("width: 27.5%;");

        expect(page.locator('//div[@id="loantermslider"]/div')).toBeVisible();
        expect(await HomePage.returnloantermwidth()).toBe("width: 100%;");

        expect(await page.screenshot()).toMatchSnapshot("personal-emi.png")

    })
    await test.step("Extract Monthly EMI", async () => {
        homeemi = await HomePage.extracttotalemi();
    });
    await test.step("Extract Total Interest", async () => {
        hometotalIntrest = await HomePage.extracttotalIntrest();
    });
    console.log(homeemi, hometotalIntrest);
});

