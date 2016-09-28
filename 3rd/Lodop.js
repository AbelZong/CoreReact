const strHtmInstall = '打印控件未安装！<a href="install_lodop32.exe" target="_self">点我执行安装</a>，安装成功后请刷新页面或重新进入。'
const strHtmUpdate = '打印控件需要升级！<a href="install_lodop32.exe" target="_self">点我执行升级</a>，升级后请重新进入。'
const strHtm64_Install = '打印控件未安装！<a href="install_lodop64.exe" target="_self">点我执行安装</a>，安装成功后请刷新页面或重新进入。'
const strHtm64_Update = '打印控件需要升级！<a href="install_lodop64.exe" target="_self">点我执行升级</a>，升级后请重新进入。'
const strHtmFireFox = '（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）'
const strHtmChrome = '(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）'
const strCLodopInstall = 'CLodop云打印服务(localhost本地)未安装启动！<a href="CLodopPrint_Setup_for_Win32NT.exe" target="_self">点我执行安装</a>,安装后请刷新页面。'
const strCLodopUpdate = 'CLodop云打印服务需升级！<a href="CLodopPrint_Setup_for_Win32NT.exe" target="_self">点我执行升级</a>,升级后请刷新页面。'

const needClodop = (() => {
  try {
    const ua = navigator.userAgent
    if (ua.match(/Windows\sPhone/i) !== null) {
      return true
    }
    if (ua.match(/iPhone|iPod/i) !== null) {
      return true
    }
    if (ua.match(/Android/i) !== null) {
      return true
    }
    if (ua.match(/Edge\D?\d+/i) !== null) {
      return true
    }
    if (ua.match(/QQBrowser/i) !== null) {
      return false
    }
    const verTrident = ua.match(/Trident\D?\d+/i)
    const verIE = ua.match(/MSIE\D?\d+/i)
    let verOPR = ua.match(/OPR\D?\d+/i)
    let verFF = ua.match(/Firefox\D?\d+/i)
    const x64 = ua.match(/x64/i)
    if ((verTrident === null) && (verIE === null) && (x64 !== null)) {
      return true
    } else if (verFF !== null) {
      verFF = verFF[0].match(/\d+/)
      if (verFF[0] >= 42) {
        return true
      }
    } else if (verOPR !== null) {
      verOPR = verOPR[0].match(/\d+/)
      if (verOPR[0] >= 32) {
        return true
      }
    } else if ((verTrident === null) && (verIE === null)) {
      let verChrome = ua.match(/Chrome\D?\d+/i)
      if (verChrome !== null) {
        verChrome = verChrome[0].match(/\d+/)
        if (verChrome[0] >= 42) {
          return true
        }
      }
    }
    return false
  } catch (err) {
    return true
  }
})()

let LODOPER

/**
string 则在指定位置输出， 同等 false
*/
export function getLodop(oOBJECT, oEMBED) {
  const isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0)
  const is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0)
  let LODOP
  try {
    if (needClodop) {
      try {
        LODOP = window.getCLodop()
      } catch (err) {}
      if (!LODOP && document.readyState !== 'complete') {
        return 'C-Lodop没准备好，请稍后再试！'
      }
      if (!LODOP) {
        return strCLodopInstall
      }
      if (window.CLODOP.CVERSION < '2.0.5.3') {
        //message.error(strCLodopUpdate, 30)
        return strCLodopUpdate
      }
      if (oEMBED && oEMBED.parentNode) {
        oEMBED.parentNode.removeChild(oEMBED)
      }
      if (oOBJECT && oOBJECT.parentNode) {
        oOBJECT.parentNode.removeChild(oOBJECT)
      }
    } else {
      //=====如果页面有Lodop就直接使用，没有则新建:==========
      if (oOBJECT !== undefined || oEMBED !== undefined) {
        LODOP = isIE ? oOBJECT : oEMBED
      } else if (LODOPER === null) {
        LODOP = document.createElement('object')
        LODOP.setAttribute('width', 0)
        LODOP.setAttribute('height', 0)
        LODOP.setAttribute('style', 'position:absolute;left:0px;top:-100px;width:0px;height:0px;')
        if (isIE) {
          LODOP.setAttribute('classid', 'clsid:2105C259-1E0C-4534-8141-A753534CB4CA')
        } else {
          LODOP.setAttribute('type', 'application/x-print-lodop')
        }
        document.documentElement.appendChild(LODOP)
        LODOPER = LODOP
      } else {
        LODOP = LODOPER
      }
      //=====Lodop插件未安装时提示下载地址:==========
      if ((LODOP === null) || (typeof LODOP.VERSION === 'undefined')) {
        let str = is64IE ? strHtm64_Install : strHtmInstall
        if (navigator.userAgent.indexOf('Chrome') >= 0) {
          str += strHtmChrome
          return str
        }
        if (navigator.userAgent.indexOf('Firefox') >= 0) {
          str += strHtmFireFox
          return str
        }
        return str
      }
    }
    if (LODOP.VERSION < '6.2.0.4') {
      let str = ''
      if (needClodop) {
        str += strCLodopUpdate
      } else {
        str = is64IE ? strHtm64_Update : strHtmUpdate
      }
      return str
    }
    return LODOP
  } catch (err) {
    return `getLodop出错: ${err}`
  }
}
