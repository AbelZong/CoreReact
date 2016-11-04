/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-03 14:19:48
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {EventEmitter2} from 'eventemitter2'
const EE = new EventEmitter2({
  wildcard: true,
  //delimiter: '.',
  //newListener: false,
  maxListeners: 12
})

// EE.on('zhang.hua', function() {
//   console.log('zhang.hua', this.event)
// })
// EE.on('zhang.chun.hua', function() {
//   console.log('zhang.chun.hua', this.event)
// })
// EE.on('zhang.chun.hua.11', function() {
//   console.log('zhang.chun.hua.11', this.event)
// })
// EE.removeAllListeners('zhang.chun.hua.**')
// EE.emit('zhang.*')
const _refreshMain = 'main.refresh'
EE.triggerRefreshMain = function() {
  this.emit(_refreshMain)
}
EE.bindRefreshMain = function(cb) {
  this.on(_refreshMain, cb)
}
EE.offRefreshMain = function(cb) {
  this.off(_refreshMain, cb)
}

export default EE
