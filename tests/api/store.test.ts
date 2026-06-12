import {test, expect} from "@api-fixtures";
import {makeOrderPayload} from "@builders";
import {OrderStatus} from "@dtos";

const orderScenarios: {id: string; name: string; status: OrderStatus}[] = [
    {id: "sto-001", name: "place an order then read it back", status: "placed"},
    {id: "sto-002", name: "place an approved order then read it back", status: "approved"},
    {id: "sto-003", name: "place an order then delete it", status: "placed"},
];

test.describe("PetStore API - Store order lifecycle", () => {
    orderScenarios.forEach((scenario) => {
        test(`${scenario.id} - ${scenario.name}`, async ({petStore}) => {
            const order = await makeOrderPayload({status: scenario.status});
            let orderId: number;

            await test.step("place order", async () => {
                const res = await petStore.store.placeOrderParsed(order);
                expect.soft(res.status, "place order status should be 200").toBe(200);
                expect.soft(res.data.status, "order status should be echoed").toBe(scenario.status);
                expect.soft(res.data.complete, "complete flag should be echoed").toBe(order.complete);
                orderId = res.data.id ?? order.id!;
            });

            await test.step("read order back", async () => {
                await expect(async () => {
                    const res = await petStore.store.getOrderByIdParsed(orderId);
                    expect(res.status, "get order status should be 200").toBe(200);
                    expect(res.data.id, "returned id should match placed order id").toBe(orderId);
                }).toPass({timeout: 10_000, intervals: [500, 1000, 2000]});
            });

            if (scenario.id === "sto-003") {
                await test.step("delete order", async () => {
                    const res = await petStore.store.deleteOrder(orderId);
                    expect.soft(res.status, "delete order status should be 200").toBe(200);
                });

                await test.step("confirm order is gone", async () => {
                    const res = await petStore.store.getOrderById(orderId);
                    expect.soft(res.status, "deleted order should return 404").toBe(404);
                });
            }
        });
    });
});

test.describe("PetStore API - Store inventory", () => {
    test("sto-004 - inventory returns a status to count map", async ({petStore}) => {
        await test.step("get inventory", async () => {
            const res = await petStore.store.getInventoryParsed();
            expect.soft(res.status, "inventory status should be 200").toBe(200);
            expect.soft(Object.keys(res.data).length, "inventory should contain at least one bucket").toBeGreaterThan(0);

            for (const [bucket, count] of Object.entries(res.data)) {
                expect.soft(Number.isInteger(count), `count for "${bucket}" should be an integer`).toBe(true);
            }
        });
    });
});
