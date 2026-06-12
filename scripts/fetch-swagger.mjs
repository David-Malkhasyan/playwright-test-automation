import {writeFileSync} from "fs";
import {resolve, dirname} from "path";
import {fileURLToPath} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const specs = [
    {
        name: "petstore",
        url: "https://petstore.swagger.io/v2/swagger.json",
        output: resolve(__dirname, "../pet-store.json"),
    },
];

(async () => {
    for (const spec of specs) {
        process.stdout.write(`Fetching ${spec.name}... `);
        try {
            const res = await fetch(spec.url);
            if (!res.ok) {
                console.log(`FAILED — HTTP ${res.status}`);
                process.exitCode = 1;
                continue;
            }
            const json = await res.json();
            writeFileSync(spec.output, JSON.stringify(json, null, 2));
            console.log("OK");
        } catch (err) {
            console.log(`FAILED — ${err.message}`);
            process.exitCode = 1;
        }
    }
})();
