import {faker} from "@faker-js/faker";
import {Order} from "@dtos";

type MaybePromise<T> = T | Promise<T>;

export async function makeOrderPayload(overrides: MaybePromise<Partial<Order>> = {}): Promise<Order> {
    const base: Order = {
        // Petstore v2 reliably serves order ids in the 1..10 range.
        id: faker.number.int({min: 1, max: 10}),
        petId: faker.number.int({min: 1, max: 2_000_000_000}),
        quantity: faker.number.int({min: 1, max: 5}),
        shipDate: new Date().toISOString(),
        status: "placed",
        complete: false,
    };

    return {
        ...base,
        ...(await overrides),
    };
}
