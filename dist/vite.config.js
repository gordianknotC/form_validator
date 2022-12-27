"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vite_1 = require("vite");
const vite_plugin_html_1 = require("vite-plugin-html");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const plugin_vue_1 = tslib_1.__importDefault(require("@vitejs/plugin-vue"));
const plugin_vue_jsx_1 = tslib_1.__importDefault(require("@vitejs/plugin-vue-jsx"));
const vite_plugin_require_context_1 = tslib_1.__importDefault(require("@originjs/vite-plugin-require-context"));
const vite_plugin_env_compatible_1 = tslib_1.__importDefault(require("vite-plugin-env-compatible"));
const vite_plugin_commonjs_1 = require("@originjs/vite-plugin-commonjs");
const options = { pretty: true }; // FIXME: pug pretty is deprecated!
const locals = { name: "My Pug" };
exports.default = ({ command, mode }) => {
    try {
        const root = process.cwd();
        const env = (0, vite_1.loadEnv)(mode, root);
        const stringifiedEnv = {};
        const isBuild = command === "build";
        Object.keys(env).forEach(key => {
            stringifiedEnv[key] = JSON.stringify(env[key]);
        });
        // https://github.com/vitejs/vite/issues/8909
        //stringifiedEnv["global"] = JSON.stringify(JSON.stringify({}));
        // Load app-level env vars to node-level env vars.
        console.log("env:", stringifiedEnv);
        return (0, vite_1.defineConfig)({
            root,
            // https://github.com/vitejs/vite/issues/5270#issuecomment-1065221182
            optimizeDeps: {
                esbuildOptions: {
                    target: 'es2020',
                },
            },
            define: {
                ...stringifiedEnv,
            },
            esbuild: {
                target: "es2020"
            },
            resolve: {
                alias: {
                    "@": node_path_1.default.resolve(root, "src/"),
                    "~": node_path_1.default.resolve(root, "src/")
                },
                extensions: [".mjs", ".js", ".ts", ".tsx", ".json", ".vue"]
            },
            server: {},
            css: {
                preprocessorOptions: {
                    //@ts-ignore
                    resolver(id, basedir, importOptions) {
                        console.log("id, basedir, importopt", id, basedir, importOptions);
                    },
                    scss: {
                    // additionalData: `
                    //   @import '@/presentation/assets/styles/predefined/mixin';
                    //   @import '@/presentation/assets/styles/predefined/variables';
                    // `
                    }
                }
            },
            plugins: [
                (0, plugin_vue_1.default)(),
                (0, plugin_vue_jsx_1.default)(),
                (0, vite_plugin_require_context_1.default)(),
                (0, vite_plugin_commonjs_1.viteCommonjs)(),
                // 讓 import.meta.env 可以被存取
                (0, vite_plugin_env_compatible_1.default)(),
                //pugPlugin(options, locals),
                // createSvgIconsPlugin({
                //   // Specify the icon folder to be cached
                //   iconDirs: [path.resolve(process.cwd(), "src/presentation/assets/icons")],
                //   // Specify symbolId format
                //   symbolId: "icon-[dir]-[name]",
                //   inject: 'body-last',
                //   customDomId: '__svg__icons__dom__',
                // }),
                (0, vite_plugin_html_1.createHtmlPlugin)({
                    inject: {
                        data: { ...env, MODE: mode }
                    }
                })
            ]
        });
    }
    catch (e) {
        console.error(e);
        throw e;
    }
};
//# sourceMappingURL=vite.config.js.map