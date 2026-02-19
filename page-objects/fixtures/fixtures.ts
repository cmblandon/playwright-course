import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../login-page';
import { DashboardPage } from '../dashboard-page';
import { USERS } from '../../setup/auth-setup';
import * as fs from 'fs';
import * as path from 'path';

export type UserRole = keyof typeof USERS;

type RoleBasedFixtures = {
    authenticatedPage: Page;
    userRole: UserRole;
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
};

export const test = base.extend<RoleBasedFixtures>({
    userRole: ['STANDARD_USER', { option: true }],

    authenticatedPage: async ({ browser, userRole }, use) => {
        const user = USERS[userRole];
        const storageStatePath = user.storageFile;

        // 🔧 FIX 1: Asegurar que el directorio .auth existe
        const authDir = path.dirname(storageStatePath);
        if (!fs.existsSync(authDir)) {
            fs.mkdirSync(authDir, { recursive: true });
            console.log(`📁 Created directory: ${authDir}`);
        }

        // Check if storage state exists
        const storageStateExists = fs.existsSync(storageStatePath);
        let context;
        let page;

        if (storageStateExists) {
            console.log(`✅ Using existing auth state for ${userRole}`);
            // Use existing authentication
            context = await browser.newContext({ storageState: storageStatePath });
            page = await context.newPage();
        } else {
            console.log(`🔐 Performing fresh login for ${userRole}`);
            // Create new context and perform login
            context = await browser.newContext();
            page = await context.newPage();
            const loginPage = new LoginPage(page);

            // Perform login
            await loginPage.goto();
            await loginPage.login(user.username, user.password);

            // 🔧 FIX 2: Aumentar timeout y mejor manejo de errores
            try {
                await page.waitForURL('**/inventory.html', { timeout: 10000 });
                console.log(`✅ Login successful for ${userRole}`);
            } catch (error) {
                console.error(`❌ Login failed for ${userRole}:`, error);
                await page.screenshot({ path: `debug-login-failed-${userRole}.png` });
                throw error;
            }

            // 🔧 FIX 3: Verificar que estamos en la página correcta antes de guardar
            const currentUrl = page.url();
            if (!currentUrl.includes('inventory.html')) {
                throw new Error(`Login failed: expected inventory.html but got ${currentUrl}`);
            }

            // Save authentication state
            await context.storageState({ path: storageStatePath });
            console.log(`💾 Auth state saved to: ${storageStatePath}`);
        }

        // 🔧 FIX 4: Usar la página directamente sin cerrar/reabrir contexto
        await use(page);
        
        // Cleanup
        await context.close();
    },

    loginPage: async ({ authenticatedPage }, use) => {
        const loginPage = new LoginPage(authenticatedPage);
        await use(loginPage);
    },

    dashboardPage: async ({ authenticatedPage }, use) => {
        const dashboardPage = new DashboardPage(authenticatedPage);
        await use(dashboardPage);
    },
});

export { expect } from '@playwright/test';
