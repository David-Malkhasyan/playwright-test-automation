import {test} from "../../ui/fixtures/base.fixture";

test.describe("JetBrains UI Sample Tests", () => {
    test("jb-001 - should open JetBrains main page and verify title", async ({jetbrainsPage}) => {
        await jetbrainsPage.verifyPageTitle();
    });

    test("jb-002 - should verify logo is visible on main page", async ({jetbrainsPage}) => {
        await jetbrainsPage.verifyLogoVisible();
    });
});
