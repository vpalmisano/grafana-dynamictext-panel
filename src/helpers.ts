import { getTemplateSrv } from '@grafana/runtime';

const date = require('helper-date');

const toFixed = (num: unknown, digits: unknown) => {
  if (typeof num !== 'number' || typeof digits !== 'number') {
    return 0;
  }
  return num.toFixed(digits);
};

const variable = (name: any): string[] => {
  const values: string[] = [];

  // Instead of interpolating the string, we collect the values in an array.
  getTemplateSrv().replace(`$${name}`, {}, (value: string | string[]) => {
    if (Array.isArray(value)) {
      values.push(...value);
    } else {
      values.push(value);
    }

    // We don't really care about the string here.
    return '';
  });

  return values;
};

const join = (arr: string[], sep: string): string => {
  return arr.join(sep);
};

const contains = (arr: string[], value: string): boolean => {
  return arr.indexOf(value) !== -1;
};

const indexOf = (arr: string[], value: string): number => {
  return arr.indexOf(value);
};

const eq = (left: string, right: string): boolean => {
  return left === right;
};

const unlessEq = (left: string, right: string): boolean => {
  return left !== right;
};

const gt = (left: number, right: number): boolean => {
  return left > right;
};

const lt = (left: number, right: number): boolean => {
  return left < right;
};

const gte = (left: number, right: number): boolean => {
  return left >= right;
};

const lte = (left: number, right: number): boolean => {
  return left <= right;
};

const and = (left: boolean, right: boolean): boolean => {
  return left && right;
};

const or = (left: boolean, right: boolean): boolean => {
  return left || right;
};

const not = (left: boolean): boolean => {
  return !left;
};

const keys = (left: any): any[] => {
  return Object.keys(left);
};

const values = (left: any): any[] => {
  return Object.values(left);
};

const entries = (left: any): Array<[string, any]> => {
  return Object.entries(left);
};

const json_stringify = (left: any): string => {
  return JSON.stringify(left);
};

const json_parse = (left: string): any => {
  return JSON.parse(left || '{}');
};

const _parseInt = (left: string, right = 10): number => {
  return parseInt(left, right);
};

const date_iso = (left: number | string): string => {
  return new Date(left).toISOString();
};

const url_property = (
  url: string,
  property: 'hash' | 'host' | 'origin' | 'pathname' | 'port' | 'protocol' | 'search'
): string => {
  return new URL(url)[property];
};

const array_filter = (data: any[], prop: string, value: any): any => {
  return data.filter((obj) => {
    const objProp = obj[prop];
    if (Array.isArray(objProp)) {
      return (objProp as any[]).includes(value);
    } else {
      return objProp === value;
    }
  });
};

export const registerHelpers = (handlebars: any) => {
  handlebars.registerHelper('date', date);
  handlebars.registerHelper('toFixed', toFixed);
  handlebars.registerHelper('variable', variable);
  handlebars.registerHelper('join', join);
  handlebars.registerHelper('contains', contains);
  handlebars.registerHelper('indexOf', indexOf);
  handlebars.registerHelper('eq', eq);
  handlebars.registerHelper('unlessEq', unlessEq);
  handlebars.registerHelper('gt', gt);
  handlebars.registerHelper('lt', lt);
  handlebars.registerHelper('gte', gte);
  handlebars.registerHelper('lte', lte);
  handlebars.registerHelper('and', and);
  handlebars.registerHelper('or', or);
  handlebars.registerHelper('not', not);
  handlebars.registerHelper('keys', keys);
  handlebars.registerHelper('values', values);
  handlebars.registerHelper('entries', entries);
  handlebars.registerHelper('json_stringify', json_stringify);
  handlebars.registerHelper('json_parse', json_parse);
  handlebars.registerHelper('parseInt', _parseInt);
  handlebars.registerHelper('date_iso', date_iso);
  handlebars.registerHelper('url_property', url_property);
  handlebars.registerHelper('array_filter', array_filter);
};
