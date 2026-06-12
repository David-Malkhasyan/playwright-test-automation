import {faker} from "@faker-js/faker";
import {Pet} from "@dtos";

type MaybePromise<T> = T | Promise<T>;

export async function makePetPayload(overrides: MaybePromise<Partial<Pet>> = {}): Promise<Pet> {
    const base: Pet = {
        // Wide-but-safe integer range: low collision risk on the shared store, and
        // stays within Number.MAX_SAFE_INTEGER so it round-trips through validation.
        id: faker.number.int({min: 1, max: 2_000_000_000}),
        name: faker.animal.dog(),
        photoUrls: [faker.image.url()],
        status: "available",
        category: {
            id: faker.number.int({min: 1, max: 100}),
            name: faker.commerce.department(),
        },
        tags: [
            {
                id: faker.number.int({min: 1, max: 100}),
                name: faker.commerce.productAdjective(),
            },
        ],
    };

    return {
        ...base,
        ...(await overrides),
    };
}
