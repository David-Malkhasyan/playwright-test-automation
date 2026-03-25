export const PETSTORE_ROUTES = {
    PET: "/v2/pet",
    PET_BY_ID: (petId: number) => `/v2/pet/${petId}`,
    PET_FINDBYSTATUS: "/v2/pet/findByStatus",
} as const;
