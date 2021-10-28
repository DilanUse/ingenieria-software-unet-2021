const AppFilterType = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  CATEGORIES: 'categories',
  ENUM: 'enum',
  TAGS: 'tags',
};

const AppFilterOperation = {
  CONTAINS: 'contains',
  NOT_CONTAINS: 'notContains',
  EQUALS: 'equals',
  NOT_EQUAL: 'notEqual',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  LESS_THAN: 'lessThan',
  LESS_THAN_OR_EQUAL: 'lessThanOrEqual',
  GREATER_THAN: 'greaterThan',
  GREATER_THAN_OR_EQUAL: 'greaterThanOrEqual',
  IN_RANGE: 'inRange',
  ONE: 'one',
  ALL: 'all',
  NONE: 'none',
  NONE_ANY: 'none-any',
};

const AppFilter = {
  FilterType: {
    Text: {
      NAME: AppFilterType.TEXT,
      Type: {
        CONTAINS: AppFilterOperation.CONTAINS,
        NOT_CONTAINS: AppFilterOperation.NOT_CONTAINS,
        EQUALS: AppFilterOperation.EQUALS,
        NOT_EQUAL: AppFilterOperation.NOT_EQUAL,
        STARTS_WITH: AppFilterOperation.STARTS_WITH,
        ENDS_WITH: AppFilterOperation.ENDS_WITH,
      },
    },
    Number: {
      NAME: AppFilterType.NUMBER,
      Type: {
        EQUALS: AppFilterOperation.EQUALS,
        NOT_EQUAL: AppFilterOperation.NOT_EQUAL,
        LESS_THAN: AppFilterOperation.LESS_THAN,
        LESS_THAN_OR_EQUAL: AppFilterOperation.LESS_THAN_OR_EQUAL,
        GREATER_THAN: AppFilterOperation.GREATER_THAN,
        GREATER_THAN_OR_EQUAL: AppFilterOperation.GREATER_THAN_OR_EQUAL,
        IN_RANGE: AppFilterOperation.IN_RANGE,
      },
    },
    Date: {
      NAME: AppFilterType.DATE,
      Type: {
        EQUALS: AppFilterOperation.EQUALS,
        NOT_EQUAL: AppFilterOperation.NOT_EQUAL,
        LESS_THAN: AppFilterOperation.LESS_THAN,
        GREATER_THAN: AppFilterOperation.GREATER_THAN,
        IN_RANGE: AppFilterOperation.IN_RANGE,
      },
    },
    Boolean: {
      NAME: AppFilterType.BOOLEAN,
      Values: {
        UNDETERMINED: 'undetermined',
        YES: 'yes',
        NO: 'no',
      },
    },
    Categories: {
      NAME: AppFilterType.CATEGORIES,
      Type: {
        ONE: AppFilterOperation.ONE,
        ALL: AppFilterOperation.ALL,
        NONE: AppFilterOperation.NONE,
        NONE_ANY: AppFilterOperation.NONE_ANY,
      },
    },
    Enum: {
      NAME: AppFilterType.ENUM,
      Type: {
        ONE: AppFilterOperation.ONE,
        ALL: AppFilterOperation.ALL,
        NONE: AppFilterOperation.NONE,
      },
    },
    Tags: {
      NAME: AppFilterType.TAGS,
      Type: {
        ONE: AppFilterOperation.ONE,
        ALL: AppFilterOperation.ALL,
        NONE: AppFilterOperation.NONE,
        NONE_ANY: AppFilterOperation.NONE_ANY,
      },
    },
  },
  FilterMathType: {
    ALL: 'all',
    ANY: 'any',
  },
  FilterOperator: {
    AND: 'AND',
    OR: 'OR',
  },
};

Object.freeze(AppFilterType);
Object.freeze(AppFilterOperation);
Object.freeze(AppFilter);

module.exports = {
  AppFilterType,
  AppFilterOperation,
  AppFilter,
};
