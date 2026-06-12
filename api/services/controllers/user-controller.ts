import {PETSTORE_ROUTES} from "../petstore-routes";
import {PetStoreService} from "../petstore-service";
import {ApiResponseSchema, User, UserSchema} from "@dtos";

/**
 * Petstore v2 quirks captured here:
 *  - create / createWithList / update / login / logout return the
 *    { code, type, message } envelope (validated with ApiResponseSchema).
 *  - getByUsername returns the User object.
 */
export class UserController {
    constructor(private readonly svc: PetStoreService) {}

    async create(user: User) {
        return this.svc.post(PETSTORE_ROUTES.user.base, user);
    }

    async createParsed(user: User) {
        const result = await this.create(user);
        return this.svc.parseApiResponseData(result, ApiResponseSchema);
    }

    async createWithList(users: User[]) {
        return this.svc.post(PETSTORE_ROUTES.user.createWithList, users);
    }

    async createWithListParsed(users: User[]) {
        const result = await this.createWithList(users);
        return this.svc.parseApiResponseData(result, ApiResponseSchema);
    }

    async getByUsername(username: string) {
        return this.svc.get(PETSTORE_ROUTES.user.byUsername(username));
    }

    async getByUsernameParsed(username: string) {
        const result = await this.getByUsername(username);
        return this.svc.parseApiResponseData(result, UserSchema);
    }

    async update(username: string, user: User) {
        return this.svc.put(PETSTORE_ROUTES.user.byUsername(username), user);
    }

    async updateParsed(username: string, user: User) {
        const result = await this.update(username, user);
        return this.svc.parseApiResponseData(result, ApiResponseSchema);
    }

    async login(username: string, password: string) {
        return this.svc.get(PETSTORE_ROUTES.user.login, {params: {username, password}});
    }

    async loginParsed(username: string, password: string) {
        const result = await this.login(username, password);
        return this.svc.parseApiResponseData(result, ApiResponseSchema);
    }

    async logout() {
        return this.svc.get(PETSTORE_ROUTES.user.logout);
    }

    async logoutParsed() {
        const result = await this.logout();
        return this.svc.parseApiResponseData(result, ApiResponseSchema);
    }

    // DELETE returns the { code, type, message } envelope; assert on status in tests.
    async delete(username: string) {
        return this.svc.delete(PETSTORE_ROUTES.user.byUsername(username));
    }
}
