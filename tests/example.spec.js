import { test, expect } from '@playwright/test';
 
test('car-emi', async ({ page }) => {
  
  await page.waitForTimeout(3000);
  await page.locator('').fill("15,00,000");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3000);
  await page.locator('#loaninterest').fill("9.5");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3000);  
  await page.locator('#loanterm').fill('1');
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3000);
  const totalIntrest=parseInt((await page.locator("#emitotalinterest p span").innerText()).replaceAll(',',''));
  const emi =parseInt((await page.locator("#emiamount p span").innerText()).replaceAll(',',''));
  console.log("TOTAL EMI FOR 1 MONTH:",emi);
  console.log("TOTAL INTEREST:",totalIntrest);
  await page.locator('.menu-item.menu-item-type-post_type.menu-item-object-page.menu-item-3293').click();
  await page.locator('#homeprice');
  //tr[contains(@class,"yearlypaymentdetails")]
  await page.locator('#downpayment');
  await page.locator('#homeloaninsuranceamount');
  await page.locator('#homeloanamount');
  await page.locator('#homeloaninterest');
  await page.locator('#homeloanterm');
  await page.locator('#loanfees');
  await page.locator('#startmonthyear');
  await page.locator('#onetimeexpenses');
  await page.locator('#propertytaxes');
  await page.locator('#homeinsurance');
  await page.locator('#maintenanceexpenses');
  await page.locator('#menu-item-3009');
  await page.locator()
});
 