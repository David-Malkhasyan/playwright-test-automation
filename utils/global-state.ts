class CurrencyRateDto {
}

let cachedCurrencyRates: CurrencyRateDto[] | null = null;

class GeneralConfigurationsDto {
}

let cachedGeneralConfigurations: GeneralConfigurationsDto | null = null;

export function getCurrencyRates(): CurrencyRateDto[] {
    if (cachedCurrencyRates) {
        return cachedCurrencyRates;
    }

    if (!process.env.CURRENCY_RATES) {
        throw new Error("CURRENCY_RATES not found in process.env. Ensure global-setup.ts is running correctly.");
    }

    cachedCurrencyRates = JSON.parse(process.env.CURRENCY_RATES);
    return cachedCurrencyRates!;
}

export function getGeneralConfigurations(): GeneralConfigurationsDto {
    if (cachedGeneralConfigurations) {
        return cachedGeneralConfigurations;
    }

    if (!process.env.GENERAL_CONFIGURATIONS) {
        throw new Error("GENERAL_CONFIGURATIONS not found in process.env. Ensure global-setup.ts is running correctly.");
    }

    cachedGeneralConfigurations = JSON.parse(process.env.GENERAL_CONFIGURATIONS);
    return cachedGeneralConfigurations!;
}
