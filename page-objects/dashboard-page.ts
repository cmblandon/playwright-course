import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly productsTitle: Locator;
    readonly inventoryItems: Locator;
    readonly cartButton: Locator;
    readonly sortButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsTitle = page.locator('[data-test="title"]');
        this.inventoryItems = page.locator('.inventory_item');
        this.cartButton = page.locator('[data-test="shopping-cart-link"]');
        this.sortButton = page.locator('[data-test="product-sort-container"]');
    }

    async goto() {
        await this.page.goto('/inventory.html');
    }

    async isProductsVisible() {
        return this.productsTitle.isVisible();
    }

    async getProductCount() {
        return await this.inventoryItems.count();
    }

    async addItemToCart(index: number) {
        await this.inventoryItems.nth(index).locator('button').click();
    }

    async getCartBadgeCount() {
        const badge = this.page.locator('.shopping_cart_badge');
        return await badge.textContent();
    }

    async isCartVisible() {
        return await this.cartButton.isVisible();
    }

    async isSortButtonVisible() {
        return await this.sortButton.isVisible();
    }

    async logout() {
        await this.page.locator('#react-burger-menu-btn').click();
        await this.page.locator('#logout_sidebar_link').click();
    }
}
