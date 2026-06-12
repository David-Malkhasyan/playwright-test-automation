import {z} from "zod";

export const OrderStatusSchema = z.enum(["placed", "approved", "delivered"]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderSchema = z.object({
    id: z.number().int().optional(),
    petId: z.number().int().optional(),
    quantity: z.number().int().optional(),
    shipDate: z.string().optional(),
    status: OrderStatusSchema.optional(),
    complete: z.boolean().optional(),
});
export type Order = z.infer<typeof OrderSchema>;

/**
 * GET /store/inventory returns an open map of status -> count.
 */
export const InventorySchema = z.record(z.string(), z.number().int());
export type Inventory = z.infer<typeof InventorySchema>;
