import { ABACEngine } from "./abac";
import { policyContext } from "./data";

const abacInstance = ABACEngine;

(async () => {
    console.log('\n=====Entry Point====');
    const result = await abacInstance.evaluatePolicy(policyContext);
    console.log(result);
})();