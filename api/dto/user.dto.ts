import {z} from "zod";

export const UserSchema = z.object({
    id: z.number().int().optional(),
    username: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    phone: z.string().optional(),
    userStatus: z.number().int().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const UserArraySchema = z.array(UserSchema);
