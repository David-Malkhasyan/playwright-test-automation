import {ConfiguredApiClient} from "../base/api-client-factory";
import {ApiType} from "../base/api-config";
import {Pet, ApiResponseData} from "../dto/petstore.dto";
import {ApiResponse} from "../base/api-types";
import {APIRequestContext} from "@playwright/test";
import {PETSTORE_ROUTES} from "./petstore-routes";

export class PetStoreService extends ConfiguredApiClient {
    constructor(context?: APIRequestContext) {
        super(ApiType.PETSTORE, "PetStore Service");
        if (context) this.setContext(context);
    }

    async addPet(pet: Pet): Promise<ApiResponse<Pet>> {
        return this.post(PETSTORE_ROUTES.PET, pet);
    }

    async getPetById(petId: number): Promise<ApiResponse<Pet>> {
        return this.get(PETSTORE_ROUTES.PET_BY_ID(petId));
    }

    async updatePet(pet: Pet): Promise<ApiResponse<Pet>> {
        return this.put(PETSTORE_ROUTES.PET, pet);
    }

    async deletePet(petId: number): Promise<ApiResponse<ApiResponseData>> {
        return this.delete(PETSTORE_ROUTES.PET_BY_ID(petId));
    }

    async findPetsByStatus(status: 'available' | 'pending' | 'sold'): Promise<ApiResponse<Pet[]>> {
        return this.get(PETSTORE_ROUTES.PET_FINDBYSTATUS, {params: {status}});
    }
}
