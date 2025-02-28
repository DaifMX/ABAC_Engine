import { PolicyContext, IPolicy } from './types'
import { policiesArray } from './data';

export class ABACEngine {
    static async evaluatePolicy(context: PolicyContext): Promise<boolean> {
        const policies = policiesArray; // Get this from DB or fs

        for (const policy of policies) {
            if (this.matchesPolicy(policy, context)) return policy.inverted === false;
        }

        // Default deny
        return false;
    };

    private static matchesPolicy(policy: IPolicy, context: PolicyContext): boolean {
        const { attributes } = policy;
        console.log('STARTING COMPARATOR....');
        return Object.entries(attributes).every(([key, expectedValue]) => {
            const [domain, ...path] = key.split('.');
            const actualValue = this.getValueFromContext(context, domain, path.join('.'));

            console.log('aV', actualValue, '\neV', expectedValue);

            return this.compareValues(actualValue, expectedValue);
        });
    };

    private static getValueFromContext(context: PolicyContext, domain: string, path: string): any {
        console.log('\ndomain:', domain, '\npath:', path);
        switch (domain) {
            case 'user':
                return path.split('.').reduce((obj: any, key) => obj?.[key], context.user);
            case 'resource':
                return path.split('.').reduce((obj: any, key) => obj?.[key], context.resource);
            case 'environment':
                return path.split('.').reduce((obj: any, key) => obj?.[key], context.environment);
            default:
                return undefined;
        }
    };

    private static compareValues(actual: any, expected: any): boolean {
        console.log('actual:', actual, 'expected:', expected.value);
        if (typeof expected === 'object' && expected.operator) {
            switch (expected.operator) {
                case 'EQ': return actual === expected.value;
                case 'NEQ': return actual !== expected.value;
                case 'GT': return actual > expected.value;
                case 'GTE': return actual >= expected.value;
                case 'LT': return actual < expected.value;
                case 'LTE': return actual <= expected.value;
                case 'BETWEEN': return actual >= expected.value.start && actual <= expected.value.end;
                case 'IN': {
                    if (!Array.isArray(actual)) return expected.value.includes(actual);
                    return actual.some((e) => expected.value.includes(e));
                };
                default: return false;
            }
        }
        return actual === expected;
    };
}