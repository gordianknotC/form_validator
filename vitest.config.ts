import { mergeConfig } from 'vite'
import { defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'


export default mergeConfig(viteConfig, defineConfig({
  test: {

    // benchmark: {},
    // Include globs for test files
    include: ["./__tests__/tests/**/*.ts", "./__tests__/tests/*.ts"],
    // Exclude globs for test files
    exclude: configDefaults.exclude,

    // Include globs for in-source test files
    // includeSource: [],
    // Handling for dependencies inlining or externalizing
    // deps: configDefaults.deps,

    // Base directory to scan for the test files
    // dir: "",

    /** By default, vitest does not provide global APIs for explicitness.
     * If you prefer to use the APIs globally like Jest, you can pass
     * the --globals option to CLI or add globals: true in the config.*/
    globals: true,

    /** The environment that will be used for testing. The default environment
     * in Vitest is a Node.js environment. If you are building a web
     * application, you can use browser-like environment through either
     * jsdom or happy-dom instead. If you are building edge functions,
     * you can use edge-runtime environment */
    environment: 'jsdom',

    /** Update snapshot files. This will update all changed snapshots
     *  and delete obsolete ones.*/
    update: false,

    /** Enable watch mode*/
    watch: true,

    /** Project root*/
    root: process.cwd(),

    /**
     * Custom reporters for output. Reporters can be a Reporter instance
     * or a string to select built in reporters:
     ------------------------------------------------
     'default' - collapse suites when they pass
     'verbose' - keep the full task tree visible
     'dot' - show each task as a single dot
     'junit' - JUnit XML reporter
     'json' - give a simple JSON summary path of a custom reporter (e.g. './path/to/reporter.ts', '@scope/reporter')
    */
    reporters: configDefaults.reporters,

    /** Truncate output diff lines up to 80 number of characters. You may
     * wish to tune this, depending on you terminal window width. */
    outputTruncateLength: 80,

    /** Limit number of output diff lines up to .... */
    outputDiffLines: 15,

    // outputFile:

    /** Enable multi-threading */
    threads: true,

    /** Minimum number of threads */
    // minThreads?: number;

    testTimeout: configDefaults.testTimeout,

    /** Default timeout of a hook in milliseconds */
    hookTimeout: configDefaults.hookTimeout,

    /** Default timeout to wait for close when Vitest
     * shuts down, in milliseconds */
    teardownTimeout: configDefaults.teardownTimeout,

    /** Silent mode, Silent console output from tests */
    silent: false,

    /** Path to setup files. They will be run before each test file. */
    setupFiles: [ "./__tests__/setup/setupFiles/index.ts"],

    /** Path to global setup files */
    globalSetup: [ "./__tests__/setup/globalSetup/index.ts"],

    watchExclude: configDefaults.watchExclude,

    /** Open Vitest UI (WIP)*/
    // open: false,

    /** Enable Vitest UI */
    // ui: true,

    /** Use in browser environment */
    // browser: false,

    /** Listen to port and serve API. When set to true, the
     * default port is 51204 */
    api: false,

  },
}))
