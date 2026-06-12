import {PETSTORE_ROUTES} from "../petstore-routes";
import {PetStoreService} from "../petstore-service";
import {Pet, PetArraySchema, PetSchema, PetStatus} from "@dtos";

/**
 * Pet endpoints. Every call comes in two flavours:
 *  - a raw variant returning ApiResponse<unknown>
 *  - a `...Parsed` variant that validates the body with Zod and returns ApiResponse<T>
 * Tests should prefer the Parsed variants so a contract change fails loudly.
 */
export class PetController {
    constructor(private readonly svc: PetStoreService) {}

    async create(pet: Pet) {
        return this.svc.post(PETSTORE_ROUTES.pet.base, pet);
    }

    async createParsed(pet: Pet) {
        const result = await this.create(pet);
        return this.svc.parseApiResponseData(result, PetSchema);
    }

    async getById(petId: number | string) {
        return this.svc.get(PETSTORE_ROUTES.pet.byId(petId));
    }

    async getByIdParsed(petId: number | string) {
        const result = await this.getById(petId);
        return this.svc.parseApiResponseData(result, PetSchema);
    }

    async update(pet: Pet) {
        return this.svc.put(PETSTORE_ROUTES.pet.base, pet);
    }

    async updateParsed(pet: Pet) {
        const result = await this.update(pet);
        return this.svc.parseApiResponseData(result, PetSchema);
    }

    async findByStatus(status: PetStatus) {
        return this.svc.get(PETSTORE_ROUTES.pet.findByStatus, {params: {status}});
    }

    async findByStatusParsed(status: PetStatus) {
        const result = await this.findByStatus(status);
        return this.svc.parseApiResponseData(result, PetArraySchema);
    }

    // DELETE returns the { code, type, message } envelope; assert on status in tests.
    async delete(petId: number | string) {
        return this.svc.delete(PETSTORE_ROUTES.pet.byId(petId));
    }
}
