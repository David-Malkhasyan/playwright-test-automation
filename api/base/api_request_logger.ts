import logger from "../../utils/logger";
import {Config} from "../../config/config";


export type NetworkDirection = ">>" | "<<";

export class ApiRequestLogger {
    /**
     * API_REQUEST_LOG=true -> enables request/response logging
     */
    static isEnabled(): boolean {
        return Config.getApiRequestLog();
    }

    static logRequest(args: {
        apiName: string;
        method: string;
        url: string;
        headers?: Record<string, string>;
        body?: unknown;
    }): void {
        if (!ApiRequestLogger.isEnabled()) return;

        const safeHeaders = ApiRequestLogger.redactHeaders(args.headers);

        ApiRequestLogger.logNetwork(">>", args.apiName, args.method, args.url, {
            headers: safeHeaders,
            body: args.body,
        });
    }

    static logResponseParsed(args: {
        apiName: string;
        method: string;
        url: string;
        status: number;
        ok: boolean;
        durationMs: number;
        body?: unknown;
    }): void {
        if (!ApiRequestLogger.isEnabled()) return;

        ApiRequestLogger.logNetwork("<<", args.apiName, args.method, args.url, {
            status: args.status,
            ok: args.ok,
            durationMs: args.durationMs,
            body: args.body,
        });
    }

    private static logNetwork(
        direction: NetworkDirection,
        apiName: string,
        method: string,
        url: string,
        details: {
            headers?: Record<string, string>;
            status?: number;
            ok?: boolean;
            durationMs?: number;
            body?: unknown;
        }
    ): void {
        // IMPORTANT: your winston logger format prints only `message`,
        // so we stringify everything into a single string (no extra meta arg).
        const parts: string[] = [];
        parts.push(`[${apiName}] ${direction} ${method} ${url}`);

        if (details.status !== undefined) parts.push(`status=${details.status}`);
        if (details.ok !== undefined) parts.push(`ok=${details.ok}`);
        if (details.durationMs !== undefined) parts.push(`durationMs=${details.durationMs}`);

        if (details.headers !== undefined) parts.push(`headers=${ApiRequestLogger.truncateForLog(details.headers)}`);
        if (details.body !== undefined) parts.push(`body=${ApiRequestLogger.truncateForLog(details.body)}`);

        logger.info(parts.join(" | "));
    }

    private static redactHeaders(headers?: Record<string, string>): Record<string, string> | undefined {
        if (!headers) return headers;

        const redacted = {...headers};
        const keysToRedact = ["authorization", "cookie", "set-cookie", "x-api-key"];

        for (const k of Object.keys(redacted)) {
            if (keysToRedact.includes(k.toLowerCase())) {
                redacted[k] = "<redacted>";
            }
        }

        return redacted;
    }

    private static truncateForLog(value: unknown, maxLen = 2000): string {
        let text: string;
        try {
            text = typeof value === "string" ? value : JSON.stringify(value);
        } catch {
            text = String(value);
        }

        return text.length > maxLen ? `${text.slice(0, maxLen)}…<truncated>` : text;
    }
}
