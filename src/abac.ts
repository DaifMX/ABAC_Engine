import { PolicyContext, IPolicy } from './types'
import { policiesArray} from './data';

export class ABACEngine {
    public static async evaluatePolicy(context: PolicyContext): Promise<boolean> {
        for (const policy of policiesArray) {
            if (this.matchesPolicy(policy, context)) return policy.inverted === false;
        }

        return false;
    };

    private static matchesPolicy(policy: IPolicy, context: PolicyContext): boolean {
        const { attributes } = policy;
        return Object.entries(attributes).every(([key, expectedValue], index) => {
            const [domain, ...path] = key.split('.');
            const actualValue = this.getValueFromContext(context, domain, path.join('.'));

            console.log(
                `\n=====Policy #${index}=====`, 
                '\nDomain:', domain, 
                '\nPath:', path, 
                '\nActual Value:', actualValue, 
                '\nExpected Policy:', expectedValue
            );

            return this.compareValues(actualValue, expectedValue, context);
        });
    };

    private static getValueFromContext(context: PolicyContext, domain: string, path: string): any {
        switch (domain) {
            case 'user':
                return path.split('.').reduce((obj: any, key) => obj?.[key], context.user);
            case 'resource':
                return path.split('.').reduce((obj: any, key) => obj?.[key], context.resource);
            case 'environment':
                return path.split('.').reduce((obj: any, key) => obj?.[key], context.environment);
            default:
                throw new Error('Invalid context')
        }
    };

    private static compareValues(actual: any, expected: any, context: PolicyContext): boolean {
        if (typeof expected === 'object' && expected.operator) {
            let expectedValue = this.resolveDynamicContextValues(expected.value, context);

            switch (expected.operator) {
                case 'EQ': return actual === expectedValue;
                case 'NEQ': return actual !== expectedValue;
                case 'GT': return actual > expectedValue;
                case 'GTE': return actual >= expectedValue;
                case 'LT': return actual < expectedValue;
                case 'LTE': return actual <= expectedValue;
                case 'BETWEEN': return actual >= expectedValue.start && actual <= expectedValue.end;
                case 'IN': {
                    if (!Array.isArray(actual)) return expectedValue.includes(actual);
                    return actual.some((e) => expectedValue.includes(e));
                };
                default: throw new Error('Invalid operator');
            }
        }
        const resolvedExpected = this.resolveDynamicContextValues(expected.value, context);
        return actual === resolvedExpected;
    };

    private static resolveDynamicContextValues = (value: any, context: PolicyContext) => {
        if (typeof value === 'string') {
            const parts = value.split('.');
            if(['user', 'resource', 'environment'].includes(parts[0])){
                const [domain, ...path] = parts;
                const res = this.getValueFromContext(context, domain, path.join('.'));

                return res 
            }
            return value;
        }
        return value;
    }
}