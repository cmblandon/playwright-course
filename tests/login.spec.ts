import {test, expect} from '@playwright/test';

test('user can login and see dashboard', async ({page}) => {
  await page.goto('https://www.saucedemo.com');

  // Fill in the username and password fields
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');

  // Click the login button
  await page.click('#login-button');

  // Expect to be redirected to the dashboard
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  // Expect a welcome message to be visible
  await expect(page.getByText('Products')).toBeVisible();
});