import {PETSTORE_ROUTES} from "../petstore-routes";
import {PetStoreService} from "../petstore-service";
import {InventorySchema, Order, OrderSchema} from "@dtos";

export class StoreController {
    constructor(private readonly svc: PetStoreService) {}

    async getInventory() {
        return this.svc.get(PETSTORE_ROUTES.store.inventory);
    }

    async getInventoryParsed() {
        const result = await this.getInventory();
        return this.svc.parseApiResponseData(result, InventorySchema);
    }

    async placeOrder(order: Order) {
        return this.svc.post(PETSTORE_ROUTES.store.order, order);
    }

    async placeOrderParsed(order: Order) {
        const result = await this.placeOrder(order);
        return this.svc.parseApiResponseData(result, OrderSchema);
    }

    async getOrderById(orderId: number | string) {
        return this.svc.get(PETSTORE_ROUTES.store.orderById(orderId));
    }

    async getOrderByIdParsed(orderId: number | string) {
        const result = await this.getOrderById(orderId);
        return this.svc.parseApiResponseData(result, OrderSchema);
    }

    // DELETE returns the { code, type, message } envelope; assert on status in tests.
    async deleteOrder(orderId: number | string) {
        return this.svc.delete(PETSTORE_ROUTES.store.orderById(orderId));
    }
}
