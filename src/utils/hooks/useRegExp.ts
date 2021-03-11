import _ from 'lodash';

export type Regs = Record<string, RegExp>;

export type Values = Record<string, any>;

type UseRegExp<T> = Partial<
  {
    [index in keyof T]: undefined | boolean;
  }
>;

/**
 * 判断是否符合正则表达式
 *
 * @params regs 正则表达式, key 为 字段名, value 为正则表达式
 * @params values 被检查的对象
 * @description
 * undefined 表示正则表达式未设置或不合法
 * true: 表示符合正则表达式
 * false: 表示不符合正则表达式
 *
 * @author Witee <github.com/Witee>
 * @date 2020-11-16
 */
export function useRegExp<T>(regs: Regs, values?: Values): UseRegExp<T> {
  const result: UseRegExp<T> = {};

  _.forEach(values, (value, key) => {
    const regExp = _.get(regs, key);

    if (_.isRegExp(regExp) && (_.isString(value) || _.isNumber(value))) {
      let val = value;
      if (_.isNumber(val)) val = _.toString(val);
      if (regExp.test(val)) {
        _.set(result, key, true);
      } else {
        _.set(result, key, false);
      }
    } else {
      _.set(result, key, undefined);
    }
  });

  return result;
}
