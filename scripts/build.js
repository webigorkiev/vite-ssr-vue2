const path = require("path");
const fs = require("fs-extra");
const { gzipSync } = require('zlib');
const margv = require("margv");
const rollup = require("rollup");
const {default:esbuild}  = require("rollup-plugin-esbuild");
const {default:dts} = require("rollup-plugin-dts");
const aliasPlugin = require("@rollup/plugin-alias");
const chalk = require("chalk");
const pkg = require("../package.json");
const args = margv();

const root = args.dev
    ? path.resolve("./node_modules/vite-ssr-vue2")
    : path.resolve("./build");

// eslint-disable-next-line no-console
const log = console.log;
const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    ...["path", "fs"]
];
// console.log(root);

(async() => {
    log(chalk.green.bold("Start build bundle"));
    await fs.remove(root);
    log("Remove dist dir");
    await fs.mkdirp(root);
    await fs.copy("./LICENSE", path.resolve(root, "./LICENSE"));
    await fs.copy("./package.json", path.resolve(root, "./package.json"));
    await fs.copy("./README.md", path.resolve(root, "./README.md"));
    const pkg = await fs.readJson(path.resolve(root, "./package.json"));
    pkg.private = false;
    await fs.writeJson(path.resolve(root, "./package.json"), pkg, {
        spaces: 2
    });
    log("Copy files to dist dir");
    await buildPlugin(root);
    log("Build plugin");
    await buildWrappers("./src/index.ts", path.resolve(root, "./index.mjs"));
    await buildWrappers("./src/vue/client.ts", path.resolve(root, "./client.mjs"));
    await buildWrappers("./src/vue/server.ts", path.resolve(root, "./server.mjs"));
    log("Build wrappers");
    await buildTypes(root);
    log("Build types");
    log(chalk.green.bold("Build success"));
    await checkFileSize("./dist/client.js");
})();

// Build bundle by rollup
const buildPlugin = async(root) => {
    const bundle = await rollup.rollup({
        input: ["./src/plugin.ts", "./src/plugin-id.ts"],
        external,
        plugins: [
            aliasPlugin({
                entries: [
                    { find:/^@\/(.*)/, replacement: './src/$1.ts' }
                ]
            }),
            esbuild({
                tsconfig: "./tsconfig.json"
            })
        ]
    });
    await bundle.write({
        dir: root,
        format: "cjs",
        exports: "auto"
    });
    await bundle.close();
};

// Build esm modules wrappers for client and server bundle
const buildWrappers = async(input, output) => {
    const bundle = await rollup.rollup({
        input: input, // ["./src/vue/client.ts", "./src/vue/server.ts"],
        external,
        plugins: [
            aliasPlugin({
                entries: [
                    { find:/^@\/(.*)/, replacement: './src/$1.ts' }
                ]
            }),
            esbuild({
                tsconfig: "./tsconfig.json"
            })
        ],
    });
    await bundle.write({
        //dir: root,
        format: "esm",
        file: output,
    });
    await bundle.close();
};

// Build types
const buildTypes = async(root) => {
    const bundle = await rollup.rollup({
        input: ["./src/index.ts", "./src/plugin.ts", "./src/plugin-id.ts", "./src/vue/client.ts", "./src/vue/server.ts"],
        external,
        plugins: [
            aliasPlugin({
                entries: [
                    { find:/^@\/(.*)/, replacement: './src/$1.ts' }
                ]
            }),
            dts()
        ]
    });
    await bundle.write({
        dir: root,
        format: "esm"
    });
    await bundle.close();
};

// Check size of file
const checkFileSize = async(filePath) => {

    if(!fs.existsSync(filePath)) {
        return;
    }
    const file = await fs.readFile(filePath);
    const minSize = (file.length / 1024).toFixed(2) + 'kb';
    const gzipped = gzipSync(file);
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb';

    log(
        `${chalk.gray(
            chalk.bold(path.basename(filePath))
        )} min:${minSize} / gzip:${gzippedSize}`
    );
};