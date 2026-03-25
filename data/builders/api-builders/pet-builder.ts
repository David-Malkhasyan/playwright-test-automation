import {faker} from "@faker-js/faker";
import {Pet, Category, Tag} from "../../../api/dto/petstore.dto";

type MaybePromise<T> = T | Promise<T>;

export async function makePetPayload(
    overrides: MaybePromise<Partial<Pet>> = {},
): Promise<Pet> {
    const base: Pet = {
        id: faker.number.int({min: 1, max: 1000000}),
        name: faker.animal.dog(),
        photoUrls: [faker.image.url()],
        status: faker.helpers.arrayElement(["available", "pending", "sold"] as const),
        category: {
            id: faker.number.int({min: 1, max: 100}),
            name: faker.commerce.department()
        },
        tags: [
            {
                id: faker.number.int({min: 1, max: 100}),
                name: faker.commerce.productAdjective()
            }
        ]
    };

    return {
        ...base,
        ...(await overrides),
    };
}
