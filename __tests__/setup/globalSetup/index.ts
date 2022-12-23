import { setupComputed, setupCurrentEnv, setupReactive, setupRef, setupWatch } from "@gdknot/frontend_common";
import { computed, reactive, ref, watch } from "vue";

export const globalSetup = async (globalConfig?: any, projectConfig?: any)=> {
    setupReactive(reactive);
    setupWatch(watch);
    setupRef(ref);
    setupComputed(computed);
    setupCurrentEnv("develop");
}

export default globalSetup;