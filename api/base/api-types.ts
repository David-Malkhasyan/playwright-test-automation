import {APIResponse} from '@playwright/test';

/**
 * API client configuration options
 */
export interface ApiClientConfig {
    baseURL: string;
    headers?: Record<string, string>;
    ignoreHTTPSErrors?: boolean;
    timeout?: number;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    timeout?: number;
    ignoreHTTPSErrors?: boolean;
    body?: any;
}

/**
 * Response wrapper with additional utilities
 */
export interface ApiResponse<T = any> {
    response: APIResponse;
    data: T;
    status: number;
    ok: boolean;
}