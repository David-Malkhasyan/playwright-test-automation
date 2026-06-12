/**
 * Cached getters over process.env, populated by the `setup` project.
 *
 * Demonstrates the setup-syncs-to-process.env pattern: the setup project seeds a
 * known pet and stashes its id here. Note process.env is per-worker, so the seed
 * is a best-effort convenience — tests do not hard-depend on it (each test creates
 * the data it needs).
 */
let cachedSeedPetId: number | null = null;

export function getSeedPetId(): number {
    if (cachedSeedPetId !== null) {
        return cachedSeedPetId;
    }
    if (!process.env.SEED_PET_ID) {
        throw new Error("SEED_PET_ID not found in process.env. Ensure the setup project ran (tests/setup).");
    }
    cachedSeedPetId = Number(process.env.SEED_PET_ID);
    return cachedSeedPetId;
}

export function getSeedPetName(): string {
    if (!process.env.SEED_PET_NAME) {
        throw new Error("SEED_PET_NAME not found in process.env. Ensure the setup project ran (tests/setup).");
    }
    return process.env.SEED_PET_NAME;
}
