// api/base/configured-api-client.ts
import {BaseApiClient} from "./base-api-client";
import {ApiConfig, ApiType} from "./api-config";
import type {ApiClientConfig} from "./api-types";

export abstract class ConfiguredApiClient extends BaseApiClient {
    protected constructor(apiType: ApiType, apiName: string, overrides: Partial<ApiClientConfig> = {}) {
        const apiConfig = ApiConfig.getConfig(apiType);

        const config: ApiClientConfig = {
            baseURL: overrides.baseURL ?? apiConfig.baseURL,
            headers: {
                ...apiConfig.headers,
                ...overrides.headers,
            },
            timeout: overrides.timeout ?? apiConfig.timeout,
            ignoreHTTPSErrors: overrides.ignoreHTTPSErrors,
        };

        super(config, `${apiName} [${apiConfig.env}]`);
    }
}