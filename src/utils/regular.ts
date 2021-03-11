/**
 * 常用正则表达式
 *
 * @author Witee <github.com/Witee>
 * @date 2020-11-12
 */

// 匹配所有
export const all = /[\s\S]*/;

// 中英文 数字 - _ 空格
export const cnEnNumSpaceUnderlineLine = /^[\u4e00-\u9fa5a-zA-Z0-9-_\s]+$/;

// 中英文 数字 - _ 小中括号
export const cnEnNumLineBracket = /^[\u4e00-\u9fa5a-zA-Z0-9-_()[\]]+$/;

// 变量格式, 不以数字开头, 不包含空格
export const variableFormat = /^[a-zA-Z\u4e00-\u9fa5][0-9a-zA-Z\u4e00-\u9fa5_-]*$/;

// 中文和空格
export const cnSpace = /^[\u4e00-\u9fa5\s]+$/;

// 英文大小写 _
export const enUnderline = /^[a-zA-Z_]+$/;

// 英文大小写 数字 - _
export const enNumLine = /^[a-zA-Z0-9_-]+$/;

// 中英文 数字 点 @
export const cnEnNumPointAt = /^[\u4e00-\u9fa5a-zA-Z0-9@.]+$/;
