import {test, expect} from "@api-fixtures";
import {makeUserPayload} from "@builders";

const crudScenarios = [
    {id: "usr-001", name: "create a user then read it back", action: "read" as const},
    {id: "usr-002", name: "update a created user then read it back", action: "update" as const},
    {id: "usr-003", name: "delete a created user then confirm it is gone", action: "delete" as const},
];

test.describe("PetStore API - User CRUD", () => {
    crudScenarios.forEach((scenario) => {
        test(`${scenario.id} - ${scenario.name}`, async ({petStore}) => {
            const user = await makeUserPayload();

            await test.step("create user", async () => {
                const res = await petStore.user.createParsed(user);
                expect.soft(res.status, "create status should be 200").toBe(200);
                expect.soft(res.data.code, "envelope code should be 200").toBe(200);
            });

            await test.step("read user back", async () => {
                await expect(async () => {
                    const res = await petStore.user.getByUsernameParsed(user.username);
                    expect(res.status, "get status should be 200").toBe(200);
                    expect(res.data.username, "returned username should match").toBe(user.username);
                }).toPass({timeout: 10_000, intervals: [500, 1000, 2000]});
            });

            if (scenario.action === "update") {
                const newEmail = `updated_${user.email}`;

                await test.step("update user", async () => {
                    const res = await petStore.user.updateParsed(user.username, {...user, email: newEmail});
                    expect.soft(res.status, "update status should be 200").toBe(200);
                });

                await test.step("read updated user back", async () => {
                    await expect(async () => {
                        const res = await petStore.user.getByUsernameParsed(user.username);
                        expect(res.status).toBe(200);
                        expect(res.data.email, "email should reflect the update").toBe(newEmail);
                    }).toPass({timeout: 10_000, intervals: [500, 1000, 2000]});
                });
            }

            if (scenario.action === "delete") {
                await test.step("delete user", async () => {
                    const res = await petStore.user.delete(user.username);
                    expect.soft(res.status, "delete status should be 200").toBe(200);
                });

                await test.step("confirm user is gone", async () => {
                    const res = await petStore.user.getByUsername(user.username);
                    expect.soft(res.status, "deleted user should return 404").toBe(404);
                });
            }
        });
    });
});

test.describe("PetStore API - User login", () => {
    test("usr-004 - create a user then log in and out", async ({petStore}) => {
        const user = await makeUserPayload();

        await test.step("create user", async () => {
            const res = await petStore.user.createParsed(user);
            expect.soft(res.status, "create status should be 200").toBe(200);
        });

        await test.step("login", async () => {
            await expect(async () => {
                const res = await petStore.user.loginParsed(user.username, user.password!);
                expect(res.status, "login status should be 200").toBe(200);
                expect.soft(res.data.message, "login message should confirm a session").toMatch(/logged in/i);
            }).toPass({timeout: 10_000, intervals: [500, 1000, 2000]});
        });

        await test.step("logout", async () => {
            const res = await petStore.user.logoutParsed();
            expect.soft(res.status, "logout status should be 200").toBe(200);
        });
    });
});
