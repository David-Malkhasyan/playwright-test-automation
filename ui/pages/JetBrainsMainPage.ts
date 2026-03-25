import {Page, expect} from "@playwright/test";
import {Config} from "../../config/config";

export class JetBrainsMainPage {
    constructor(private page: Page) {}

    async navigate() {
        await this.page.goto(Config.getJetBrainsBaseURL());
    }

    async verifyPageTitle() {
        await expect(this.page).toHaveTitle(/JetBrains: Essential tools for software developers and teams/);
    }

    async verifyLogoVisible() {
        await expect(this.page.locator('a[aria-label="Navigate to main page"]')).toBeVisible();
    }
}
