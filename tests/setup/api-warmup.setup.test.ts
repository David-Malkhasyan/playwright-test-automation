import {test, expect} from "@api-fixtures";
import {makePetPayload} from "@builders";

/**
 * The setup project runs first (single worker) and the `api` project depends on it.
 *
 * setup-001 gates the run on the sandbox being reachable.
 * setup-002 seeds a known pet and stashes its id in process.env (see utils/global-state.ts).
 * Seeding is best-effort: a write outage here must not block the suite, because every
 * test creates the data it needs.
 */

test("setup-001 - API is reachable (store inventory responds)", async ({petStore}) => {
    await expect(async () => {
        const res = await petStore.store.getInventory();
        expect(res.status, "Petstore sandbox must be reachable").toBe(200);
    }).toPass({timeout: 30_000, intervals: [1000, 2000, 5000]});
});

test("setup-002 - best-effort seed of a known pet", async ({petStore}) => {
    const pet = await makePetPayload({name: "seed-pet", status: "available"});

    try {
        const res = await petStore.pet.createParsed(pet);
        if (res.status === 200) {
            process.env.SEED_PET_ID = String(res.data.id);
            process.env.SEED_PET_NAME = res.data.name ?? "seed-pet";
            console.info(`[setup] seeded pet id=${res.data.id}`);
        } else {
            console.warn(`[setup] could not seed pet (status ${res.status}); tests will self-seed.`);
        }
    } catch (err) {
        console.warn(`[setup] seeding skipped (${(err as Error).message}); tests will self-seed.`);
    }
});
