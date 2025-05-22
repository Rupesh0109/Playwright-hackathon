import { test, expect } from '@playwright/test';
import { Home } from "../pages/HomePage.page"

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
        await HomePage.selectloantype("carloan");
    });
    await test.step("Fill in the loan amount", async () => {
        await HomePage.fillloanamt("1500000");
    });
    await test.step("Fill Interest Percentage", async () => {
        await HomePage.fillinterestrate("9.5");
    });
    await test.step("Fill Loan Tenure", async () => {
        await HomePage.fillLoantenure("1");
        await page.waitForLoadState("networkidle");
    });
    await test.step("Check slider is visible", async () => {
        expect(page.locator('//div[@id="loanamountslider"]/div')).toBeVisible()
    });
    await test.step("Check slider is moving", async () => {
        const width = await HomePage.returnstyle();
        expect(width).toBe("width: 75%;");
    });
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
        await HomePage.selectloantype("homeloan");
    });
    await test.step("Fill in the loan amount", async () => {
        await HomePage.fillloanamt("10000000");
    });
    await test.step("Fill Interest Percentage", async () => {
        await HomePage.fillinterestrate("10.5");
    });
    await test.step("Fill Loan Tenure", async () => {
        await HomePage.fillLoantenure("20");
        await page.waitForLoadState("networkidle");
    });
    await test.step("Check slider is visible", async () => {
        expect(page.locator('//div[@id="loanamountslider"]/div')).toBeVisible()
    })
    await test.step("Check slider is moving", async () => {
        const width = await HomePage.returnstyle();
        expect(width).toBe("width: 50%;");
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
        await HomePage.fillloanamt("10000000");
    });
    await test.step("Fill Interest Percentage", async () => {
        await HomePage.fillinterestrate("10.5");
    });
    await test.step("Fill Loan Tenure", async () => {
        await HomePage.fillLoantenure("20");
        await page.waitForLoadState("networkidle");
    });
    await test.step("Check slider is visible", async () => {
        expect(page.locator('//div[@id="loanamountslider"]/div')).toBeVisible()
    })
    await test.step("Check slider is moving", async () => {
        const width = await HomePage.returnstyle();
        expect(width).toBe("width: 50%;");
    })
    await test.step("Extract Monthly EMI", async () => {
        homeemi = await HomePage.extracttotalemi();
    });
    await test.step("Extract Total Interest", async () => {
        hometotalIntrest = await HomePage.extracttotalIntrest();
    });
    console.log(homeemi, hometotalIntrest);
});

