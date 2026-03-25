import {expect, request as playwrightRequest, test as base} from "@playwright/test";
import {PetStoreService} from "../services/petstore-service";

type Fixtures = {
    petStore: PetStoreService;
};

export const test = base.extend<Fixtures>({
    petStore: async ({}, use) => {
        const svc = new PetStoreService();
        const cfg = svc.getConfig();

        const context = await playwrightRequest.newContext({
            baseURL: cfg.baseURL,
            extraHTTPHeaders: cfg.headers,
            timeout: cfg.timeout,
            ignoreHTTPSErrors: true,
        });

        svc.setContext(context);

        try {
            await use(svc);
        } finally {
            await context.dispose();
        }
    },
});

export {expect};
