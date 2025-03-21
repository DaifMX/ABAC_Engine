import ABACEngine from "./abac";
import { policyContext } from "./data";

const result = ABACEngine.evaluatePolicy(policyContext);
console.log('\nIs context valid --->', result);
console.log('\nDone!');