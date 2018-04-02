/**
 * 补足两位，不足前面补0
 * @author Ling
 * @version 2018/03/27
 * @param {String|Number} n
 * @returns {String} 至少两位的字符串
 */
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 获取开始到结束之间的数
 * @author Ling
 * @version 2018/03/27
 * @param {Object} param0 {start, end}两个属性
 * @returns {Array} 开始到结束之间数的数组
 */
export const getLoopArray = ({ start = 0, end = 1 } = {}) => {
  let array = []
  for (let i = start; i <= end; i++) {
    array.push(formatNumber(i))
  }
  return array
}
/**
 * 判断是否是闰年
 * @author Ling
 * @version 2018/03/27
 * @param {Number|String} year 年份
 * @returns TRUE or FALSE
 */
export const isLoopYear = year => {
  return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)
}
