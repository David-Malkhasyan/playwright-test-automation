import {faker} from "@faker-js/faker";
import {User} from "@dtos";

type MaybePromise<T> = T | Promise<T>;

export async function makeUserPayload(overrides: MaybePromise<Partial<User>> = {}): Promise<User> {
    const base: User = {
        id: faker.number.int({min: 1, max: 2_000_000_000}),
        // Unique-ish username to avoid collisions across parallel workers.
        username:
            faker.internet.username().toLowerCase().replace(/[^a-z0-9]/g, "") +
            faker.number.int({min: 100, max: 999}),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        userStatus: 1,
    };

    return {
        ...base,
        ...(await overrides),
    };
}
