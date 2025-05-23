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
}