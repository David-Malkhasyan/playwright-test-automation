import {z} from "zod";

/**
 * Pet domain schemas.
 *
 * Fields the Petstore does not always echo back are marked optional: the public
 * sandbox holds a lot of third-party junk data, so schemas validate shape without
 * being brittle about which fields are present.
 */
export const CategorySchema = z.object({
    id: z.number().int().optional(),
    name: z.string().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

export const TagSchema = z.object({
    id: z.number().int().optional(),
    name: z.string().optional(),
});
export type Tag = z.infer<typeof TagSchema>;

export const PetStatusSchema = z.enum(["available", "pending", "sold"]);
export type PetStatus = z.infer<typeof PetStatusSchema>;

export const PetSchema = z.object({
    id: z.number().int().optional(),
    category: CategorySchema.optional(),
    name: z.string().optional(),
    photoUrls: z.array(z.string()).optional(),
    tags: z.array(TagSchema).optional(),
    status: PetStatusSchema.optional(),
});
export type Pet = z.infer<typeof PetSchema>;

export const PetArraySchema = z.array(PetSchema);

/**
 * The generic envelope Petstore v2 returns from several write/auth endpoints,
 * e.g. POST /user and GET /user/login -> { code, type, message }.
 */
export const ApiResponseSchema = z.object({
    code: z.number().int(),
    type: z.string(),
    message: z.string(),
});
export type ApiResponseData = z.infer<typeof ApiResponseSchema>;
