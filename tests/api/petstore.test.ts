import {test, expect} from "../../api/api-fixtures/petstore.fixture";
import {Pet} from "../../api/dto/petstore.dto";
import {makePetPayload} from "../../data/builders/api-builders";

test.describe("PetStore API Sample Tests", () => {
    let petId: number;
    let petPayload: Pet;

    test.beforeAll(async () => {
        petPayload = await makePetPayload();
        petId = petPayload.id!;
    });

    test("pst-001 - should add a new pet to the store", async ({petStore}) => {
        const response = await petStore.addPet(petPayload);
        expect.soft(response.status, "Response status should be 200").toBe(200);
        expect.soft(response.data?.name, "Pet name should match payload").toBe(petPayload.name);
    });

    test("pst-002 - should find pet by id", async ({petStore}) => {
        const response = await petStore.getPetById(petId);
        expect.soft(response.status, "Response status should be 200").toBe(200);
        expect.soft(response.data?.id, "Pet id should match").toBe(petId);
    });

    test("pst-003 - should update pet status", async ({petStore}) => {
        const updatedPet = {...petPayload, status: "pending" as const};
        const response = await petStore.updatePet(updatedPet);
        expect.soft(response.status, "Response status should be 200").toBe(200);
        expect.soft(response.data?.status, "Pet status should be updated to pending").toBe("pending");
    });

    test.afterAll(async ({petStore}) => {
        // Cleanup
        await petStore.deletePet(petId);
    });
});
