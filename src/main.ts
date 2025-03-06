import { ABACEngine } from "./abac";
import { policyContext } from "./data";

const abacInstance = ABACEngine;

(async () => {
    console.log('\n****STARTING ABAC ENGINE****\n');
    const result = await abacInstance.evaluatePolicy(policyContext);
    console.log('\nIs context valid --->', result);
})();