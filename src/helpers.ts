import { getTemplateSrv } from '@grafana/runtime';
import { HelperOptions } from 'handlebars';
import * as rison from 'rison';

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

const json_stringify = (left: any, space = 0): string => {
  return JSON.stringify(left, null, space);
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

const array_sort = (data: any[], prop: string, direction: string): any => {
  return data.sort((a, b) => {
    const v1 = a[prop] || 0;
    const v2 = b[prop] || 0;
    const dir = direction === 'desc' ? -1 : 1;
    if (typeof v1 === 'number') {
      return dir * (v1 - v2);
    } else {
      return dir * (v1 as string).localeCompare(v2 as string);
    }
  });
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

const array_sum = (array: number[]): number => {
  return array.reduce((prev, cur) => prev + cur, 0);
};

const array_min = (array: number[]): number => {
  return Math.min(...array);
};

const array_max = (array: number[]): number => {
  return Math.max(...array);
};

const format_duration = (ms: number): string => {
  return new Date(ms)
    .toLocaleTimeString('en-GB', {
      timeZone: 'Etc/UTC',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .toString();
};

const assign_variable = (name: string, value: any, options: HelperOptions): void => {
  if (!options.data.root) {
    options.data.root = {};
  }
  options.data.root[name] = value;
};

const sum = (v1: number, v2: number): number => {
  return v1 + v2;
};

const subtract = (v1: number, v2: number): number => {
  return v1 - v2;
};

const multiply = (v1: number, v2: number): number => {
  return v1 * v2;
};

const divide = (v1: number, v2: number): number => {
  return v1 / v2;
};

const strings_join = (s1: string, s2: string, sep = ''): string => {
  return [s1, s2].join(sep);
};

const kibana_url = (baseUrl: string, from: number, to: number, index: string, query: string): string => {
  const startDate = new Date(from).toISOString();
  const endDate = new Date(to).toISOString();
  const _g = {
    filters: [],
    refreshInterval: {
      pause: true,
      value: 0,
    },
    time: {
      from: startDate,
      to: endDate,
    },
  };
  const filters = query.split(',').map((q) => {
    const [k, v] = q.split('=', 2);
    return {
      $state: { store: 'appState' },
      query: { match_phrase: { [k]: v } },
    };
  });
  const _a = {
    filters,
    index,
    interval: 'auto',
    query: { language: 'kuery', query: '' },
    sort: [['timestamp', 'desc']],
  };
  return `${baseUrl}?_g=${rison.encode(_g)}&_a=${rison.encode(_a)}`;
};

export const registerHelpers = (handlebars: typeof Handlebars) => {
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
  handlebars.registerHelper('array_sort', array_sort);
  handlebars.registerHelper('array_filter', array_filter);
  handlebars.registerHelper('array_sum', array_sum);
  handlebars.registerHelper('array_min', array_min);
  handlebars.registerHelper('array_max', array_max);
  handlebars.registerHelper('format_duration', format_duration);
  handlebars.registerHelper('assign_variable', assign_variable);
  handlebars.registerHelper('sum', sum);
  handlebars.registerHelper('subtract', subtract);
  handlebars.registerHelper('multiply', multiply);
  handlebars.registerHelper('divide', divide);
  handlebars.registerHelper('strings_join', strings_join);
  handlebars.registerHelper('kibana_url', kibana_url);
};
