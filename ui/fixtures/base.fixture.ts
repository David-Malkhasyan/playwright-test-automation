import {expect, Page, test as base} from '@playwright/test';
import {JetBrainsMainPage} from '../pages/JetBrainsMainPage';

export type UiFixtures = {
    jetbrainsPage: JetBrainsMainPage;
};

export const test = base.extend<UiFixtures>({
    jetbrainsPage: async ({page}, use) => {
        const jetbrainsPage = new JetBrainsMainPage(page);
        await jetbrainsPage.navigate();
        await use(jetbrainsPage);
    },
});

export {expect};
