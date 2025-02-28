type PathsToStringProps<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]-?: T[K] extends any[]
        ? `${Prefix}${K & string}`
        : T[K] extends object
        ? PathsToStringProps<T[K], `${Prefix}${K & string}.`>
        : `${Prefix}${K & string}`;
    }[keyof T]
  : never;

type PolicyContextPath = PathsToStringProps<PolicyContextAttributes>;

// Operaciones CRUD posibles
type operation = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

// Objeto de contexto que se tiene que generar para comparar los diferentes tipos de datos
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
    departments: number[];
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

type PolicyContextAttributes = Omit<PolicyContext, 'operation'>;

// Interfaz de la politica 
export interface IPolicy {
  uuid: string;
  operation: operation;
  resourceType: string;
  description: string;
  attributes: {
    [K in PolicyContextPath]?: IAttributes;
  };
  inverted?: boolean;
}

interface IAttributes {
  operator: AttributeOperator;
  value: any;
}

type AttributeOperator = 'EQ' | 'NEQ' | 'GT' | 'GTE' | 'LT' | 'LTE' | 'BETWEEN' | 'IN';