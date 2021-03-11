/* eslint-disable */
/**
 * Table
 */
import _ from 'lodash';
import type {
  PagedData,
  TablePageOpt,
  TableSorterOpt,
  TableFilterOpt,
  TableRequestParam,
  StringOrNumber,
} from 'commonTypes';
import moment from 'moment';
import type { TablePaginationConfig } from 'antd/lib/table';
import type { SorterResult } from 'antd/lib/table/interface';

type UseTablePaginationParams = Pick<PagedData<any>, 'pageSize' | 'total' | 'pageNum'>;

const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

/**
 * 根据返回分页结果，返回分页数据
 * @param config UseTablePaginationParams 分页设置
 */
export function genPagination(config?: UseTablePaginationParams): TablePaginationConfig {
  return {
    total: config?.total ?? 0,
    defaultPageSize: config?.pageSize ?? 10,
    current: config?.pageNum ?? 1,
    pageSizeOptions: ['10', '20', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (totalNum, range) => `${range[0]}-${range[1]} 共${totalNum}项`,
  };
}

/**
 * 转化 ProTable 参数为请求参数
 * @param params Table 的 pageSize, current， 以及传入的参数
 * @param sorter sorter
 * @param filter filter
 */
export function transformTableParams(
  params: TablePageOpt,
  sorter: TableSorterOpt,
  filter: TableFilterOpt,
): TableRequestParam {
  const { current: pageNum, pageSize } = params;
  let sort: string | undefined;

  if (sorter && Object.keys(sorter).length > 0) {
    const sortField = Object.keys(sorter)[0];
    sort = sorter[sortField] === 'ascend' ? sortField : `-${sortField}`;
  }

  const formattedFilter: Record<string, string | undefined> = {};
  for (const key in filter) {
    formattedFilter[key] = filter[key] ? filter[key].join(',') : undefined;
  }

  return {
    ..._.omit(params, 'current'), // 删除无用的 current 参数
    ...formattedFilter,
    sort,
    pageNum,
    pageSize,
  };
}

/**
 * 转化 Table 参数为请求参数
 * @param paginate 分页
 * @param sorter 排序
 * @param filter 筛选
 */
export function transformAntdTableParams<T extends object>(
  pagination: TablePaginationConfig,
  filters: Record<string, StringOrNumber[] | null>,
  sorter: SorterResult<T>,
): TableRequestParam {
  const { pageSize, current: pageNum } = pagination;
  const { order, field } = sorter;
  const sort = field ? (order === 'ascend' ? (field as string) : `-${field}`) : undefined;

  const filterParams = Object.keys(filters).reduce<Record<string, string>>((prev, cur) => {
    if (filters[cur]) {
      prev[cur] = filters[cur]!.join(',');
    }
    return prev;
  }, {});

  return {
    ...filterParams,
    sort,
    pageNum,
    pageSize,
  };
}

/**
 * 处理过期时间范围参数
 *
 * expRange 是 columns 中设置的字段名称
 * expiredAtStart,expiredAtEnd 是接口查询参数
 *
 * @author Witee <github.com/Witee>
 * @date 2021-01-19
 */
export const beforeSearchSubmit = (filters: any) => {
  const { expRange, ...rest } = filters;

  let expiredAtStart;
  let expiredAtEnd;
  if (expRange) {
    expiredAtStart = moment(expRange[0]).startOf('day').format(dateTimeFormat);
    expiredAtEnd = moment(expRange[1]).endOf('day').format(dateTimeFormat);
  }

  return { ...rest, expiredAtStart, expiredAtEnd };
};
