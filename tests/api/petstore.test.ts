import {test, expect} from "@api-fixtures";
import {makePetPayload} from "@builders";
import {PetStatus} from "@dtos";

const crudScenarios: {id: string; name: string; status: PetStatus}[] = [
    {id: "pst-001", name: "create an available pet then read it back", status: "available"},
    {id: "pst-002", name: "create a pending pet then read it back", status: "pending"},
    {id: "pst-003", name: "update a created pet's name and status", status: "available"},
    {id: "pst-004", name: "delete a created pet then confirm it is gone", status: "sold"},
];

test.describe("PetStore API - Pet CRUD", () => {
    crudScenarios.forEach((scenario) => {
        test(`${scenario.id} - ${scenario.name}`, async ({petStore}) => {
            const payload = await makePetPayload({status: scenario.status});
            let createdId: number;

            await test.step("create pet", async () => {
                const res = await petStore.pet.createParsed(payload);
                expect.soft(res.status, "create status should be 200").toBe(200);
                expect.soft(res.data.name, "created name should be echoed").toBe(payload.name);
                expect.soft(res.data.status, "created status should be echoed").toBe(scenario.status);
                createdId = res.data.id ?? payload.id!;
            });

            await test.step("read pet back", async () => {
                await expect(async () => {
                    const res = await petStore.pet.getByIdParsed(createdId);
                    expect(res.status, "get status should be 200").toBe(200);
                    expect(res.data.id, "returned id should match created id").toBe(createdId);
                    expect(res.data.name, "returned name should match").toBe(payload.name);
                }).toPass({timeout: 10_000, intervals: [500, 1000, 2000]});
            });

            if (scenario.id === "pst-003") {
                const newName = `${payload.name}-renamed`;

                await test.step("update pet", async () => {
                    const res = await petStore.pet.updateParsed({
                        ...payload,
                        id: createdId,
                        name: newName,
                        status: "sold",
                    });
                    expect.soft(res.status, "update status should be 200").toBe(200);
                    expect.soft(res.data.name, "updated name should be echoed").toBe(newName);
                    expect.soft(res.data.status, "updated status should be echoed").toBe("sold");
                });

                await test.step("read updated pet back", async () => {
                    await expect(async () => {
                        const res = await petStore.pet.getByIdParsed(createdId);
                        expect(res.status).toBe(200);
                        expect(res.data.name, "name should reflect the update").toBe(newName);
                    }).toPass({timeout: 10_000, intervals: [500, 1000, 2000]});
                });
            }

            if (scenario.id === "pst-004") {
                await test.step("delete pet", async () => {
                    const res = await petStore.pet.delete(createdId);
                    expect.soft(res.status, "delete status should be 200").toBe(200);
                });

                await test.step("confirm pet is gone", async () => {
                    const res = await petStore.pet.getById(createdId);
                    expect.soft(res.status, "deleted pet should return 404").toBe(404);
                });
            }
        });
    });
});

test.describe("PetStore API - Pet findByStatus", () => {
    const statuses: PetStatus[] = ["available", "pending", "sold"];

    statuses.forEach((status) => {
        test(`pst-005-${status} - findByStatus returns only ${status} pets`, async ({petStore}) => {
            await test.step("seed a pet with the target status", async () => {
                const res = await petStore.pet.createParsed(await makePetPayload({status}));
                expect.soft(res.status, "seed pet create status should be 200").toBe(200);
            });

            await test.step(`query findByStatus=${status}`, async () => {
                // Raw call: the shared store holds third-party junk pets, so we assert
                // structure and filter purity rather than Zod-parsing the whole list.
                const res = await petStore.pet.findByStatus(status);
                expect.soft(res.status, "findByStatus status should be 200").toBe(200);
                expect.soft(Array.isArray(res.data), "response should be an array").toBe(true);

                const pets = res.data as {status?: string}[];
                const mismatches = pets.filter((p) => p.status && p.status !== status);
                expect.soft(mismatches.length, `every returned pet should have status "${status}"`).toBe(0);
            });
        });
    });
});
