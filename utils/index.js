/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-02 15:21:40
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
// export function exportCSV(filename, fields, data) {
//   //http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
//   //用这个来判断是否支持，不支持的话后端推送下载
//   // try {
//   //     var isFileSaverSupported = !!new Blob;
//   // } catch (e) {}
//   json2csv({ data, fields }, (err, csv) => {
//     if (err) console.log(err)
//     const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
//     saveAs(blob, 'test.csv')
//   })
// }
export function getUriParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const r = window.location.search.substr(1).match(reg)
  return r !== null ? unescape(r[2]) : null
}

const loadingNode = document.getElementById('ant-site-loading')
export function endLoading(cb) {
  setTimeout(() => {
    //loadingNode.parentNode.removeChild(loadingNode)
    loadingNode.style.display = 'none'
    if (cb) {
      cb()
    }
  }, 450)
}
export function startLoading() {
  loadingNode.style.display = 'block'
}

export function utf16to8(str) {
  let out = ''
  let c
  if (typeof str !== 'undefined') {
    const len = str.length
    for (let i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i)
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      }
    }
  }
  return out
}

//https://www.sitepoint.com/css3-animation-javascript-event-handlers/
//https://raw.githubusercontent.com/arve0/react-animate-on-change/master/index.js
const pfx = ['webkit', 'moz', 'MS', 'o', '']
export function addFixedEventListener(element, type, callback) {
  for (let p = 0; p < pfx.length; p++) {
    if (!pfx[p]) {
      type = type.toLowerCase()
    }
    element.addEventListener(pfx[p] + type, callback, false)
  }
}
export function removeFixedEventListener(element, type, callback) {
  for (let p = 0; p < pfx.length; p++) {
    if (!pfx[p]) {
      type = type.toLowerCase()
    }
    element.removeEventListener(pfx[p] + type, callback, false)
  }
}
export function animationStart(element, callback, flag) {
  if (flag) {
    removeFixedEventListener(element, 'AnimationStart', callback)
  } else {
    addFixedEventListener(element, 'AnimationStart', callback)
  }
}
export function animationEnd(element, callback, flag) {
  if (flag) {
    removeFixedEventListener(element, 'AnimationEnd', callback)
  } else {
    addFixedEventListener(element, 'AnimationEnd', callback)
  }
}
export function listToTree(_data, options) {
  const data = [].concat(_data)
  const ID_KEY = options && options.idKey ? options.idKey : 'id'
  const PARENT_KEY = options && options.parentKey ? options.parentKey : 'parent'
  const CHILDREN_KEY = options && options.childrenKey ? options.childrenKey : 'children'
  const tree = []
  const childrenOf = {}
  let item
  let id
  let parentId
  let i = 0
  const len = data.length
  for (i; i < len; i++) {
    item = data[i]
    id = item[ID_KEY]
    parentId = item[PARENT_KEY] || 0
    childrenOf[id] = childrenOf[id] || []
    item[CHILDREN_KEY] = childrenOf[id]
    if (parentId !== 0) {
      childrenOf[parentId] = childrenOf[parentId] || []
      childrenOf[parentId].push(item)
    } else {
      tree.push(item)
    }
  }
  return tree
}
const whichTransitionEvent = (() => {
  const el = document.createElement('fakeElement')
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }
  let evt = null
  for (const t in transitions) {
    if (el.style[t] !== undefined) {
      evt = transitions[t]
      break
    }
  }
  return evt
})()
export function transitionEnd(element, callback, flag) {
  if (flag) {
    element.removeEventListener(whichTransitionEvent, callback, false)
  } else {
    element.addEventListener(whichTransitionEvent, callback, false)
  }
}

export function preZeroFill(num, size) {
  if (num >= Math.pow(10, size)) {
    return num.toString()
  }
  const _str = Array(size + 1).join('0') + num
  return _str.slice(_str.length - size)
}
