import _ from 'lodash';

type Result = string | number | null;
type LocalStorage = [Result, (value: string) => void];

const numberExp = /^\d+$/;

/**
 * localStorage 存取逻辑
 *
 * @author Witee<github.com/Witee>
 * @date 2020-10-21
 */
export function useLocalStorage(key: string): LocalStorage {
  const value = window.localStorage.getItem(key);

  let result: Result = value;
  if (result && numberExp.test(result)) {
    result = _.toNumber(result);
  }

  const setValue = (val: Result) => {
    window.localStorage.setItem(key, val as string);
  };

  return [result, setValue];
}
