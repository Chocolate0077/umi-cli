import { useState } from 'react';

type UseKeyValue<T> = [T | undefined, (key: string, value: any) => void, (initial: T) => void];

/**
 * 使用 key value 存储值, 多用于表单
 *
 * @author Witee <github.com/Witee>
 * @date 2020-11-16
 */
export function useKeyValue<T>(init?: T): UseKeyValue<T> {
  const [values, setValues] = useState<any>(init);

  const setValue = (key: string, value: any) => {
    const newVal = { [key]: value };

    setValues({ ...values, ...newVal });
  };

  const flush = (initial?: T) => {
    setValues(initial);
  };

  return [values, setValue, flush];
}
