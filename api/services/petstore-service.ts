import {ConfiguredApiClient} from "../base/api-client-factory";
import {ApiType} from "../base/api-config";
import {APIRequestContext} from "@playwright/test";
import {PetController} from "./controllers/pet-controller";
import {StoreController} from "./controllers/store-controller";
import {UserController} from "./controllers/user-controller";

/**
 * Single service for the Petstore host, composed of one controller per tag group
 * (pet / store / user). Usage reads as petStore.pet.createParsed(...),
 * petStore.store.placeOrderParsed(...), petStore.user.loginParsed(...).
 */
export class PetStoreService extends ConfiguredApiClient {
    public readonly pet: PetController;
    public readonly store: StoreController;
    public readonly user: UserController;

    constructor(context?: APIRequestContext) {
        super(ApiType.PETSTORE, "PetStore Service");
        if (context) this.setContext(context);

        this.pet = new PetController(this);
        this.store = new StoreController(this);
        this.user = new UserController(this);
    }
}
