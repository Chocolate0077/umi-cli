/* eslint-disable @typescript-eslint/no-explicit-any */
import { toHundred } from 'utils/formatter';
import { sumBy, get, maxBy, minBy } from 'lodash-es';
import type { EChartOption } from 'echarts';
import numeral from 'numeral';

export type ChartType =
  | 'pie'
  | 'bar'
  | 'line'
  | 'map'
  | 'tag'
  | 'topBar'
  | 'limitTopBar';
type ChartOptionsData = ChartValueItem[] | number[];

/* toolbox 的格式化 */
function genToolbox() {
  return {
    // mark: {
    //   show: true,
    // },
    dataView: {
      show: true,
      readOnly: false,
      title: '数据视图',
      lang: ['数据视图', '关闭', '刷新'],
    },
    restore: {
      show: true,
      title: '还原',
    },
    saveAsImage: {
      show: true,
      backgroundColor: 'rgba(0,0,0,0)',
      title: '保存为图片',
    },
  };
}

/* echarts 公共配置 */
function genEchartsOptions(options?: EChartOption): EChartOption {
  const { title, legend, tooltip, toolbox, series = [] } = options!;

  // 默认的配置
  const defaultOpt: EChartOption = {
    // 标题
    title: {
      text: '',
      subtext: '',
      left: 0,
      textStyle: {
        fontSize: 16,
      },
    },
    // 标注
    legend: {
      orient: 'vertical',
      left: 'left',
      data: [],
    },
    // 提示文字
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d})',
    },
    // charts 工具按钮
    toolbox: {
      show: true,
      orient: 'horizontal',
      x: 'right',
      y: 'top',
      feature: genToolbox(),
    },
    // 数据的格式化和内容
    series: [
      {
        type: 'pie',
        name: '', // 数据代表的含义
        radius: '55%',
        // 中心位置， 单个样式
        center: ['50%', '60%'],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: [],
      },
    ],
  };

  return {
    ...options,
    title: { ...defaultOpt.title, ...title },
    legend: { ...defaultOpt.legend, ...legend },
    tooltip: { ...defaultOpt.tooltip, ...tooltip },
    toolbox: { ...defaultOpt.toolbox, ...toolbox },
    series: [
      {
        ...defaultOpt.series![0],
        ...series[0],
      } as EChartOption.Series,
    ],
  };
}

/* Title 的处理: 是否添加总数 */
function getSum(
  list: ChartValueItem[],
  title = '',
  showTitle: boolean | number = false,
) {
  if (!showTitle) return title;
  const total =
    typeof showTitle === 'number'
      ? showTitle
      : sumBy(list, (i) => {
          return Number(i.value);
        });
  const sum = numeral(total).format();
  return `${title}  (${sum})`;
}

interface ChartOptionsParam<T extends any[] = ChartOptionsData> {
  title?: string;
  valueType?: 'number' | 'percent'; // value 的百分比是否启用
  type?: string; // 用于处理不同类型的数据
  data: T;
  showTotal?: boolean | number; // 是否在 title 中显示总数
}

export type ChartValueItem = {
  name: string;
  value: number;
};

type ChartOptionTranlator = (
  type?: string,
) => (options: ChartOptionsParam) => EChartOption;

/* Chart Data number 类型和 { name, value } 类型的转换 */
function isChartValue(list: ChartOptionsData): list is ChartValueItem[] {
  if (!list.length) return true;
  return typeof list[0] !== 'number' && Object.keys(list[0]).includes('value');
}

type toChartValueItemCb = (item: number, i: number) => ChartValueItem;
function toChartValue(list: ChartOptionsData, callback?: toChartValueItemCb) {
  if (isChartValue(list)) {
    return list.map((v) => ({ name: String(v.name), value: v.value }));
  }

  const cb: toChartValueItemCb = (item) => ({
    name: String(item),
    value: item,
  });
  return list.map(callback || cb);
}

/* 数据的百分比转换 */
function toPercentData(list: ChartValueItem[]) {
  if (!list || list.length < 1) return [];
  const total = sumBy(list, 'value');
  return list.map((item) => ({
    name: item.name,
    value: toHundred(item.value, total),
  }));
}

/* 根据 options 格式化 chart 数据为标椎格式 */
function formatChartData(
  options: ChartOptionsParam,
  callback?: toChartValueItemCb,
) {
  const { valueType } = options;

  let data = toChartValue(options.data || [], callback);

  // 百分比
  if (valueType === 'percent') {
    data = toPercentData(data);
  }

  return data;
}

/* 根据 options.valueType 生成格式化函数 */
function genChartFormatterFunc(
  valueType?: 'number' | 'percent',
): EChartOption.Tooltip.Formatter {
  const percentStr = valueType === 'percent' ? '%' : '';
  return (params) => {
    if (!(params instanceof Array)) {
      return params.seriesName
        ? `${params.seriesName}<br/>${params.name}：${
            params.value || ''
          }${percentStr}`
        : `${params.name}：${params.value || ''}${percentStr}`;
    }
    const tar = params[0];
    return tar.seriesName
      ? `${tar.seriesName}<br/>${tar.name}：${tar.value || ''}${percentStr}`
      : `${tar.name}：${tar.value || ''}${percentStr}`;
  };
}

/* Pie */
const getPieOption: ChartOptionTranlator = () => (options) => {
  const { title } = options;

  const data = formatChartData(options);

  // Pie 默认配置
  const defaultOptions: EChartOption = {
    title: {
      text: getSum(data, title, options.showTotal),
    },
    legend: {
      data: data.map((v) => v.name),
      show: false,
    },
    tooltip: {
      trigger: 'item',
      // {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
      // formatter: '{a} <br/>{b} : {d}%',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    series: !data.length
      ? []
      : [
          {
            data,
            name: title,
            type: 'pie',
          },
        ],
  };

  return genEchartsOptions(defaultOptions);
};

const getMapOption: ChartOptionTranlator = () => (options) => {
  const { title, valueType } = options;

  const data = formatChartData(options);
  const defaultOptions: EChartOption = {
    title: {
      text: getSum(data, title, options.showTotal),
      subtext: '',
      left: 'left',
    },
    tooltip: {
      trigger: 'item',
      formatter: genChartFormatterFunc(valueType),
    },
    toolbox: {
      show: true,
      orient: 'horizontal',
      x: 'right',
      y: 'top',
      feature: genToolbox(),
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: [],
    },
    visualMap: [
      {
        max: get(
          maxBy(data, (v: any) => v.value),
          'value',
          0,
        ),
        min: get(
          minBy(data, (v: any) => v.value),
          'value',
          0,
        ),
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true,
        // color: ['#5ab1ef','#e0ffff'],
      },
    ],
    series: [
      {
        name: '',
        type: 'map',
        map: 'china',
        roam: false,
        // 数据文字的设置
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#d87a80',
            },
          },
          emphasis: {
            show: true,
          },
        },
        // 数据渲染的设置
        itemStyle: {
          normal: {
            borderColor: '#eee',
            areaColor: '#ddd',
          },
          emphasis: {
            areaColor: '#fe994e',
          },
        },
        // 南海诸岛置为0
        data: [
          ...data,
          {
            name: '南海诸岛',
            value: 0,
            itemStyle: {
              normal: { opacity: 0, label: { show: false } },
            },
          },
        ],
      },
    ] as any,
  };

  return genEchartsOptions(defaultOptions);
};

const getTagOption: ChartOptionTranlator = () => (options) => {
  const { title = '标签分布', valueType } = options;

  const data = formatChartData(options);
  const percentStr = valueType === 'percent' ? '%' : '';

  const defaultOptions: EChartOption = {
    series: !data.length
      ? []
      : [
          {
            data,
            name: title,
            type: 'wordCloud',
            gridSize: 6,
            sizeRange: [12, 50],
            rotationRange: [0, 0],
            // shape: 'diamond', // 形状
            drawOutOfBound: false,
            shape: 'circle',
            width: 600,
            height: 400,
            textStyle: {
              normal: {
                color: function color() {
                  return `rgb(${Math.round(Math.random() * 160)},${Math.round(
                    Math.random() * 160,
                  )},${Math.round(Math.random() * 160)})`;
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333',
              },
            },
          },
        ],
    tooltip: {
      trigger: 'item',
      formatter: `{b} : {c}${percentStr}`,
    },
    title: {
      text: getSum(data, title, options.showTotal),
      textStyle: {
        fontFamily: 'PingFangSC-Medium',
        color: '#1c97d2',
      },
    },
  } as any;

  return genEchartsOptions(defaultOptions);
};

/* Bar */
const getBarOption: ChartOptionTranlator = (num?: string) => (options) => {
  const { title, valueType } = options;
  const data = formatChartData(options);

  const defaultOptions: EChartOption = {
    title: {
      text: getSum(data, title, options.showTotal),
    },
    grid: {
      top: '10%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: data.map((v) => v.name),
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: genChartFormatterFunc(valueType),
    },
    toolbox: { show: true },
    series: !data.length
      ? []
      : [
          {
            barWidth: '70%' as any,
            type: 'bar',
            name: title,
            data,
            // data: data.map(v => v.value),
          },
        ],
  };

  if (num) {
    defaultOptions.dataZoom = [
      {
        show: true,
        start: 0,
        end: 50,
      },
      {
        type: 'inside',
        start: 0,
        end: 50,
      },
      {
        show: true,
        yAxisIndex: 0,
        filterMode: 'empty',
        // height: '80%',
        // width: 30,
        // showDataShadow: false,
        left: '93%',
      },
    ];
  }

  return genEchartsOptions(defaultOptions);
};

/* 一条 Line 的设置 */
const getLineOption: ChartOptionTranlator = () => (options) => {
  const { title, valueType } = options;
  const data = formatChartData(options);
  const percentStr = valueType === 'percent' ? '%' : '';

  const defaultOptions: EChartOption = {
    title: {
      text: getSum(data, title, options.showTotal),
      left: 'left',
    },
    tooltip: {
      trigger: 'axis',
      formatter: `{b} : {c}${percentStr}`,
    },
    legend: {
      left: 'left',
      data: [],
    },
    xAxis: [
      {
        type: 'category',
        data: data.map((v) => v.name),
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: !data.length ? [] : [{ type: 'line', data }],
  };

  return genEchartsOptions(defaultOptions);
};

/* 一条 LimitBar 的设置 */
const getLimitBarOption: ChartOptionTranlator = (topLimit = '10') => (
  options,
) => {
  const { title, valueType } = options;
  const data = formatChartData(options);

  const slicedData = data.slice(0, +topLimit).sort((a, b) => b.value - a.value);

  const defaultOptions: EChartOption = {
    title: {
      text: getSum(data, title, options.showTotal),
    },
    grid: {
      top: '10%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: slicedData.map((v) => v.name),
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: genChartFormatterFunc(valueType),
    },
    toolbox: {
      show: true,
      feature: {
        ...genToolbox(),
        dataView: {
          show: true,
          readOnly: false,
          title: '数据视图',
          lang: [
            '数据视图',
            '关闭',
            '<div style="width:15px;position:absolute;height:10px;margin-left:-10px;margin-top:-5px;background:white;"></div>',
          ],
          optionToContent() {
            const seriesText = data.reduce((prev, cur) => {
              prev += `${cur.name}   ${cur.value}`;
              prev += '\n';
              return prev;
            }, '');
            return `<textarea style="width: 100%; height: 100%; font-family: monospace; font-size: 14px; line-height: 1.6rem; color: rgb(0, 0, 0); border-color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);">${seriesText}</textarea>`;
          },
        },
      },
    },
    series: !slicedData.length
      ? []
      : [
          {
            barWidth: '70%' as any,
            type: 'bar',
            name: title,
            data: slicedData,
            // data: data.map(v => v.value),
          },
        ],
  };

  return genEchartsOptions(defaultOptions);
};

const chartUtils: Record<ChartType, ReturnType<ChartOptionTranlator>> = {
  /* Pie */
  pie: getPieOption(),
  /* bar */
  bar: getBarOption(),
  topBar: getBarOption('10'),
  limitTopBar: getLimitBarOption('10'),
  /* line */
  line: getLineOption(),
  /* Map */
  map: getMapOption(),
  /* 词云获取： query 和 stats 的两种数据格式 */
  tag: getTagOption(),
};

export function genEchartOptions(
  type: keyof typeof chartUtils,
  options: ChartOptionsParam,
) {
  if (!chartUtils[type]) return undefined;
  return chartUtils[type](options);
}

export default chartUtils;
