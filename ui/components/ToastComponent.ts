import {expect, Locator, Page} from '@playwright/test';

/**
 * Toast / notification component - reusable across all pages.
 *
 * Rules:
 * - Component objects wrap a specific reusable UI part, not a full page
 * - Scoped to a root locator so it works wherever the toast appears
 * - Expose only meaningful assertions and interactions
 */
export class ToastComponent {
    private readonly root: Locator;

    constructor(page: Page) {
        this.root = page.locator('[data-testid="toast"], .toast, .notification');
    }

    async expectSuccessMessage(text: string): Promise<void> {
        await expect(this.root.filter({hasText: text})).toBeVisible();
    }

    async expectErrorMessage(text: string): Promise<void> {
        await expect(this.root.filter({hasText: text})).toBeVisible();
    }

    async expectVisible(): Promise<void> {
        await expect(this.root).toBeVisible();
    }

    async expectHidden(): Promise<void> {
        await expect(this.root).toBeHidden();
    }

    async dismiss(): Promise<void> {
        await this.root.getByRole('button', {name: /close|dismiss/i}).click();
    }
}
