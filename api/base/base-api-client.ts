import {APIRequestContext, APIResponse} from "@playwright/test";
import {z} from "zod";
import {ApiClientConfig, ApiResponse as ApiResponseWrapper, RequestOptions} from "./api-types";
import {ApiRequestLogger} from "./api_request_logger";

/**
 * Base API Client
 * Provides common HTTP methods and connection management for all API clients
 */
export abstract class BaseApiClient {
    protected context: APIRequestContext | null = null;
    protected config: ApiClientConfig;
    protected apiName: string;

    protected constructor(config: ApiClientConfig, apiName: string) {
        this.config = config;
        this.apiName = apiName;
    }

    /**
     * Inject an existing APIRequestContext (fixture-owned).
     */
    setContext(context: APIRequestContext): void {
        this.context = context;
    }

    /**
     * Get current configuration (Readonly)
     */
    getConfig(): Readonly<ApiClientConfig> {
        return Object.freeze({...this.config});
    }

    /**
     * HTTP GET request
     */
    async get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<ApiResponseWrapper<T>> {
        return this.request<T>("GET", endpoint, undefined, options);
    }

    /**
     * HTTP POST request
     */
    async post<T = unknown>(
        endpoint: string,
        data?: unknown,
        options?: RequestOptions
    ): Promise<ApiResponseWrapper<T>> {
        return this.request<T>("POST", endpoint, data, options);
    }

    /**
     * HTTP PUT request
     */
    async put<T = unknown>(
        endpoint: string,
        data?: unknown,
        options?: RequestOptions
    ): Promise<ApiResponseWrapper<T>> {
        return this.request<T>("PUT", endpoint, data, options);
    }

    /**
     * HTTP DELETE request
     */
    async delete<T = unknown>(endpoint: string, options?: RequestOptions): Promise<ApiResponseWrapper<T>> {
        return this.request<T>("DELETE", endpoint, undefined, options);
    }

    /**
     * HTTP PATCH request
     */
    async patch<T = unknown>(
        endpoint: string,
        data?: unknown,
        options?: RequestOptions
    ): Promise<ApiResponseWrapper<T>> {
        return this.request<T>("PATCH", endpoint, data, options);
    }

    /**
     * Internal helper to execute a request with logging, timing, and response parsing.
     */
    protected async request<T = unknown>(
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        endpoint: string,
        data?: unknown,
        options?: RequestOptions
    ): Promise<ApiResponseWrapper<T>> {
        const mergedOptions = this.mergeOptions(options);
        const urlForLog = this.formatUrlForLog(endpoint, mergedOptions?.params);

        const startedAt = Date.now();
        ApiRequestLogger.logRequest({
            apiName: this.apiName,
            method,
            url: urlForLog,
            headers: mergedOptions?.headers,
            body: data,
        });

        const context = this.getContext();
        const response = await (method === "GET" || method === "DELETE"
            ? context[method.toLowerCase() as "get" | "delete"](endpoint, mergedOptions)
            : context[method.toLowerCase() as "post" | "put" | "patch"](endpoint, {
                data,
                ...mergedOptions,
            }));

        const parsedResponse = await this.parseResponse<T>(response);
        ApiRequestLogger.logResponseParsed({
            apiName: this.apiName,
            method,
            url: urlForLog,
            status: parsedResponse.status,
            ok: parsedResponse.ok,
            durationMs: Date.now() - startedAt,
            body: parsedResponse.data,
        });

        return parsedResponse;
    }

    /**
     * Merge request options with defaults
     */
    protected mergeOptions(options?: RequestOptions): RequestOptions {
        const mergedOptions: RequestOptions = {
            ...options,
            headers: {
                ...this.config.headers,
                ...options?.headers,
            },
            timeout: options?.timeout ?? this.config.timeout,
        };

        // Ensure params is explicitly handled if not present in options
        if (options?.params) {
            mergedOptions.params = options.params;
        }

        return mergedOptions;
    }

    /**
     * Get API context (throws if not connected)
     */
    protected getContext(): APIRequestContext {
        if (!this.context) {
            throw new Error(
                `${this.apiName} context not initialized. Call setContext() (or create/connect a context) first.`
            );
        }
        return this.context;
    }

    /**
     * Parse response and create ApiResponse wrapper
     */
    protected async parseResponse<T = unknown>(response: APIResponse): Promise<ApiResponseWrapper<T>> {
        const headers = response.headers();
        const contentType = headers["content-type"] || "";

        let data: unknown = undefined;

        // Handle empty bodies safely (common for 204/DELETE).
        if (response.status() !== 204) {
            if (contentType.includes("application/json")) {
                try {
                    data = await response.json();
                } catch {
                    // Fall back to text if server lied about JSON or returned invalid JSON.
                    data = await response.text();
                }
            } else {
                data = await response.text();
            }
        }

        return {
            response,
            data: data as T,
            status: response.status(),
            ok: response.ok(),
        };
    }

    /**
     * Convenience helper: take an ApiResponse and parse/validate its `data` with a Zod schema.
     * Preserves status/ok/response and returns strongly typed `data`.
     */
    public parseApiResponseData<T>(
        responseWrapper: ApiResponseWrapper<unknown>,
        schema: z.ZodType<T>
    ): ApiResponseWrapper<T> {
        return {
            ...responseWrapper,
            data: schema.parse(responseWrapper.data),
        };
    }

    private formatUrlForLog(endpoint: string, params?: Record<string, unknown>): string {
        if (!params || Object.keys(params).length === 0) return endpoint;

        const qs = Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join("&");

        return `${endpoint}${endpoint.includes("?") ? "&" : "?"}${qs}`;
    }
}