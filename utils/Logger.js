/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-08 14:07:23
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import createLogger from 'redux-logger'

const actionTransformer = action => {
  if (action.type === 'BATCHING_REDUCER.BATCH') {
    action.payload.type = action.payload.map(next => next.type).join(' => ')
    return action.payload
  }

  return action
}

const level = 'info'

const logger = {}

for (const method in console) {
  if (typeof console[method] === 'function') {
    logger[method] = console[method].bind(console)
  }
}

logger[level] = function levelFn(...args) {
  const lastArg = args.pop()

  if (Array.isArray(lastArg)) {
    return lastArg.forEach(item => {
      //console[level].apply(console, [...args, item])
    })
  }

  console[level].apply(console, arguments)
}

export default createLogger({
  level,
  actionTransformer,
  logger
})
