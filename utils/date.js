import { formatNumber, getLoopArray, isLoopYear } from './util'
/**
 * 格式化日期
 * @author Ling
 * @version 2018/03/27
 * @param {Date} date 日期
 * @param {Boolean} format 是否需要格式化
 * @returns {String|Array} 格式化后的日期字符串或数组
 */
export const formatTime = (date, format = true) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  if (format) {
    return (
      [year, month, day].map(formatNumber).join('/') +
      ' ' +
      [hour, minute, second].map(formatNumber).join(':')
    )
  } else {
    return [year, month, day, hour, minute, second].map(formatNumber)
  }
}
/**
 * 获取当前月份所有天
 * @author Ling
 * @version 2018/03/27
 * @param {Number|String} year 年月
 * @param {String} month 月份
 * @returns {Array} 当前月份所有天的数组
 */
export const getMonthDay = (year, month) => {
  let flag = isLoopYear(year),
    array = null

  // 定义每月为31,30天的月份以及特殊月份2月
  const DAY_31 = ['01', '03', '05', '07', '08', '10', '12']
  const DAY_30 = ['04', '06', '09', '11']
  const DAY_2 = ['02']

  if (DAY_31.includes(month)) {
    array = getLoopArray({ start: 1, end: 31 })
  } else if (DAY_30.includes(month)) {
    array = getLoopArray({ start: 1, end: 30 })
  } else if (DAY_2.includes(month)) {
    array = flag
      ? getLoopArray({ start: 1, end: 29 })
      : getLoopArray({ start: 1, end: 28 })
  }
  return array
}
/**
 * 获取多列日期选择器
 * @author Ling
 * @version 2018/03/27
 * @param {Number|String} startYear 开始年份
 * @param {Number|String} endYear   结束年份
 * @param {String} date 当前日期，可选  @example 2018-04-15 09:12:12
 * @returns {Object} 显示的数组和联动二维数组
 */
export const dateTimePicker = (startYear, endYear, date) => {
  // 返回默认显示的数组和联动数组的声明
  let dateTime = [],
    dateTimeArray = [[], [], [], [], [], []],
    // 默认开始显示数据
    defaultDate = date
      ? [
          ...date.split(' ')[0].split('-'),
          ...date.split(' ')[1].split(':')
        ].map(formatNumber)
      : formatTime(new Date(), false)
  // 处理联动列表数据 年月日 时分秒
  dateTimeArray[0] = getLoopArray({ start: startYear, end: endYear })
  dateTimeArray[1] = getLoopArray({ start: 1, end: 12 })
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1])
  dateTimeArray[3] = getLoopArray({ start: 0, end: 23 })
  dateTimeArray[4] = getLoopArray({ start: 0, end: 59 })
  dateTimeArray[5] = getLoopArray({ start: 0, end: 59 })

  // 获取默认显示的位置
  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]))
  })

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
