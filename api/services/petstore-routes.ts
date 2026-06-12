const PET = "/v2/pet";
const STORE = "/v2/store";
const USER = "/v2/user";

export const PETSTORE_ROUTES = {
    pet: {
        base: PET,
        byId: (petId: number | string) => `${PET}/${petId}`,
        findByStatus: `${PET}/findByStatus`,
    },
    store: {
        inventory: `${STORE}/inventory`,
        order: `${STORE}/order`,
        orderById: (orderId: number | string) => `${STORE}/order/${orderId}`,
    },
    user: {
        base: USER,
        createWithList: `${USER}/createWithList`,
        login: `${USER}/login`,
        logout: `${USER}/logout`,
        byUsername: (username: string) => `${USER}/${username}`,
    },
} as const;
