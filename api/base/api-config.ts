import {Config} from "../../config/config";

/**
 * API type enum for different API services
 */
export enum ApiType {
    PETSTORE = 'petstore',
}

/**
 * API Configuration Manager
 * Provides environment-specific API configurations
 */
export class ApiConfig {
    /**
     * Get base URL for specified API type
     */
    static getBaseURL(apiType: ApiType): string {
        switch (apiType) {
            case ApiType.PETSTORE:
                return Config.getPetStoreApiBaseURL();
            default:
                throw new Error(`Unknown API type: ${apiType}`);
        }
    }

    /**
     * Get default headers for the specified API type
     */
    static getDefaultHeaders(apiType: ApiType): Record<string, string> {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(process.env.X_API_KEY ? {'x-api-key': process.env.X_API_KEY} : {}),
        };
    }

    /**
     * Get timeout for a specified API type
     */
    static getTimeout(): number {
        return Config.getApiTimeout();
    }

    /**
     * Get complete API configuration
     */
    static getConfig(apiType: ApiType): {
        baseURL: string;
        headers: Record<string, string>;
        timeout: number;
        env: string;
        ignoreHTTPSErrors: boolean;
    } {
        return {
            baseURL: this.getBaseURL(apiType),
            headers: this.getDefaultHeaders(apiType),
            timeout: this.getTimeout(),
            env: Config.getEnv(),
            ignoreHTTPSErrors: true,
        };
    }
}