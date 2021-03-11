declare module 'commonTypes' {
  import type { RequestData } from '@ant-design/pro-table';
  import type { IRoute, Location } from 'umi';

  type StringOrNumber = string | number;

  type StoreRecord = Record<string, any>;

  /* 键值对的约定 */
  export interface KeyValueOptions<T = StringOrNumber> {
    key: string | number;
    value: T;
  }

  export interface ResponseData<T = any> {
    code: number;
    message: string;
    data: T;
    isSuccess: boolean;
  }

  interface RouteMatch<T = Record<string, unknown>> {
    isExact: boolean;
    path: string;
    url: string;
    params: T;
  }

  export interface UmiPageProps<T = Record<string, unknown>, State = Record<string, unknown>> {
    route: {
      path: string;
      component: any;
      routes: IRoute[];
    };
    history: History;
    location: Location<State>;
    match: RouteMatch<T>;
  }

  /**
   * 分页数据
   */
  export interface PagedData<T> {
    total: number; // 记录数
    totalPage: number; // 总页数
    pageNum: number; // 当前页数
    pageSize: number; // 单页记录条数
    list: T[]; // 记录
  }

  /**
   * Table 分页、排序、过滤
   */
  interface TablePageOpt {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  }
  type TableFilterOpt = Record<string, StringOrNumber[]>;
  type TableSorterOpt = Record<string, 'ascend' | 'descend' | null>;

  /**
   * ProTable requestFn
   */
  interface ProTableRequestFunc<T = any> {
    (params: TablePageOpt, sorter: TableSorterOpt, filter: TableFilterOpt): Promise<RequestData<T>>;
  }

  /* Table List 请求参数 */
  interface TableRequestParam {
    pageNum?: number;
    pageSize?: number;
    sort?: string;
    [key: string]: any;
  }
}
