// TypeScript attribute transformer --->
export type PathsToStringProps<T, Prefix extends string = ''> = T extends object
  ? {
    [K in keyof T]-?: T[K] extends any[]
    ? `${Prefix}${K & string}`
    : T[K] extends object
    ? PathsToStringProps<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
  }[keyof T]
  : never;

// ==== PolicyContext ==== \\
// Main
export type PolicyContext = {
  user: {
    uuid: string;
    role: string;
    departments: number[];
  };
  operation: operation;
  resource: {
    type: string;
    authorUuid: string;
    roles?: string[];
    departments?: number[];
    whitelist?: string[];
  };
  environment: {
    os: string;
    ipAddress: string;
    browser: string;
    platform: string;
    time: number;
  };
};

// Helpers
type operation = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'; // CRUD ops.

type PolicyContextAttributes = Omit<PolicyContext, 'operation'>;
type PolicyContextPath = PathsToStringProps<PolicyContextAttributes>;

// ===== DB/FS Related ==== \\
// PolicyModel Interface
export interface IPolicy {
  uuid: string;
  operation: operation;
  resourceType: string;
  description: string;
  attributes: {
    [K in PolicyContextPath]?: IAttributes;
  };
  inverted?: boolean;
};

// Policy Attribute Structure
interface IAttributes {
  operator: AttributeOperator;
  value: any;
};

// Posible operations
type AttributeOperator = 'EQ' | 'NEQ' | 'GT' | 'GTE' | 'LT' | 'LTE' | 'BETWEEN' | 'IN';