import { IPolicy, PolicyContext } from './types'
import { getTimezoneOffsetParsed } from './util';

const dateParser = new Date();

// DB MOCK =>
export const policiesArray: Array<IPolicy> = [
    {
        uuid: 'this-is-the-policy-uuid',
        operation: 'CREATE',
        resourceType: 'Document',
        description: 'This is the description of the policy CREATE-Document',
        attributes: {
            'user.role': { operator: 'IN', value: ['MANAGER'] },
            'user.departments': { operator: 'IN', value: [2] },
            'resource.authorUuid': {operator: 'EQ', value: 'user.uuid'},
            'environment.time': {
                operator: 'BETWEEN',
                value: {
                    start: (new Date(dateParser).setHours(9, 30, 0, 0,) - getTimezoneOffsetParsed()),
                    end: (new Date(dateParser).setHours(16, 30, 0, 0,) - getTimezoneOffsetParsed()),
                },
            }
        },
        inverted: false
    }
];

// CONSTRUCTUED WITH DB DATA, REQUESTS HEADERS, AND DATA PASSED TO A MIDDLEWARE =>
export const policyContext: PolicyContext = {
    user: {
        uuid: 'this-is-the-user-uuid', // --> Token / Header
        departments: [2], // --> Token  / Header
        role: 'MANAGER', // --> Token / Header
    },
    operation: 'CREATE', // --> Router Middleware
    resource: {
        authorUuid: 'this-is-the-user-uuid',  // ini -->'this-is-the-resource-author-uuid'     // --> DB (Resource table)
        departments: [1], // --> Router Middleware
        roles: ['MANAGER'], // --> Router Middleware
        type: 'Document', // --> Router Middleware
    },
    environment: {
        browser: 'Mozilla Firefox', // --> Request Header
        ipAddress: '192.168.0.1', // --> Request Header   
        os: 'Windows 11', // --> Request Header
        platform: 'Microsoft Windows', // --> Request Header
        time: (new Date().getTime() - getTimezoneOffsetParsed()) // --> Date op.
    },
};