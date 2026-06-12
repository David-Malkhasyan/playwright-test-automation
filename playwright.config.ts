import {defineConfig} from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({path: '.env'});
dotenv.config({path: '.env.override', override: true});

export default defineConfig({
    testDir: './tests',
    outputDir: 'report/test-results',
    timeout: parseInt(process.env.TIMEOUT_MS || '30000', 10),
    fullyParallel: false,
    workers: parseInt(process.env.WORKERS || '4', 10),
    // The public Petstore sandbox occasionally returns transient 5xx; retries absorb that noise.
    retries: parseInt(process.env.RETRIES || '2', 10),
    reporter: [
        ['html', {open: 'never', outputFolder: 'report/playwright-report'}],
        ['junit', {outputFile: 'report/playwright-report/results.xml'}],
    ],
    use: {
        trace: (process.env.TRACE as any) || 'on-first-retry',
        headless: process.env.HEADLESS === 'true',
        ignoreHTTPSErrors: true,
    },
    projects: [
        {
            name: 'setup',
            testMatch: /[\\/]tests[\\/]setup[\\/].*\.test\.ts$/,
            workers: 1,
        },
        {
            name: 'api',
            testMatch: /[\\/]tests[\\/]api[\\/].*\.test\.ts$/,
            dependencies: ['setup'],
        },
        {
            name: 'ui',
            testMatch: /[\\/]tests[\\/]ui[\\/].*\.test\.ts$/,
            use: {
                headless: process.env.HEADLESS === 'true',
                screenshot: 'only-on-failure',
                video: 'retain-on-failure',
                viewport: {width: 1920, height: 1080},
            },
        },
    ],
});
