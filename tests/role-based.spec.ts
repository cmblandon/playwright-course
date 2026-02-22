import { test, expect } from '../page-objects/fixtures/fixtures';

test.describe('Role-Based Access Control Tests', () => {

    test.describe('Standard User Tests', () => {
        test.use({ userRole: 'STANDARD_USER' });

        test('Standard user sees limited dashboard features', async ({
            authenticatedPage: page, 
            dashboardPage,
        }) => {
            // Debug info
            console.log('Current URL:', page.url());
            
            await dashboardPage.goto();
            
            // For visual checks
            await expect(page).toHaveScreenshot('standard-user-dashboard.png', { fullPage: true });

            await expect(dashboardPage.productsTitle).toBeVisible({ timeout: 10000 });
            await expect(dashboardPage.inventoryItems).toHaveCount(6);

            const productCount = await dashboardPage.getProductCount();
            expect(productCount).toBeGreaterThan(0);

            await expect(dashboardPage.cartButton).toBeVisible();

            await dashboardPage.addItemToCart(0);
            const cartBadge = await dashboardPage.getCartBadgeCount();
            expect(cartBadge).toBe('1');
        });

        test('Authentication state persists across page navigations', async ({
            authenticatedPage: page,
            dashboardPage,
        }) => {
            await dashboardPage.goto();
            await expect(dashboardPage.productsTitle).toBeVisible({ timeout: 10000 });

            await page.goto('/');
            await page.goBack();

            await expect(dashboardPage.productsTitle).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Problem User Tests', () => {
        test.use({ userRole: 'PROBLEM_USER' });

        test('Problem user sees all dashboard features with potential issues', async ({
            authenticatedPage: page,
            dashboardPage,
        }) => {
            console.log('Current URL:', page.url());
            
            await dashboardPage.goto();

            await expect(dashboardPage.productsTitle).toBeVisible({ timeout: 10000 });
            await expect(dashboardPage.inventoryItems).toHaveCount(6);

            await expect(dashboardPage.sortButton).toBeVisible();
            const sortExists = await dashboardPage.isSortButtonVisible();
            expect(sortExists).toBe(true);

            await dashboardPage.addItemToCart(1);
            const cartBadge = await dashboardPage.getCartBadgeCount();
            expect(cartBadge).toBe('1');
        });
    });
});
