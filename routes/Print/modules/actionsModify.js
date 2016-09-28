import { ZPost } from 'utils/Xfetch'
import { message } from 'antd'
import { getLodop } from '3rd/Lodop'
//设置边距
// const setPrintRange = (setting, print_setting) => {
//   const _mm = 0.1;
//   let _size_top = _mm * 2;
//   let _size_left = _mm * 2;
//   let _size_width = setting.pageW - (_mm * 4);
//   let _size_height = setting.pageH - (_mm * 4);
//   if (print_setting.machine !== '-1') {
//
//   }
//   try {
//     const Lodop = getLodop();
//   } catch (e) {
//     //
//   }
// }
//解析打印区域，后期从控件中获取
const parsePrintRanger = (setting, _padding_left, _padding_top) => {
  const _mm = 0.1
  const _size_top = _mm / 2
  const _size_left = _mm / 2
  const _page_width = setting.pageW
  const _page_height = setting.pageH
  const _size_width = _page_width - _mm
  const _size_height = _page_height - _mm

  const left = _padding_left + _size_left
  const top = _padding_top + _size_top
  const size_width = _size_width - _padding_left - _mm / 4
  const size_height = _size_height - _padding_top - _mm / 4
  const rightBorder = _page_width - left - size_width
  const bottomBorder = _page_height - size_height - top
  const css = {
    borderLeftWidth: `${left}mm`,
    borderTopWidth: `${top}mm`
  }
  if (rightBorder > 0) {
    css.borderRightWidth = `${rightBorder}mm`
  }
  if (bottomBorder > 0) {
    css.borderBottomWidth = `${bottomBorder}mm`
  }
  return css
}
const compareMinTHHeight = (minHeight, tableColumns) => {
  let height = minHeight
  if (tableColumns) {
    for (let i = 0; i < tableColumns.length; i++) {
      if (tableColumns[i].thCss.height > height) {
        height = tableColumns[i].thCss.height
      }
    }
  }
  return height + 1 //hack + 1, for border-bottom: 1px
}
const compareMinTDHeight = (minHeight, tableColumns) => {
  let height = minHeight
  if (tableColumns) {
    for (let i = 0; i < tableColumns.length; i++) {
      if (tableColumns[i].tdCss.height > height) {
        height = tableColumns[i].tdCss.height
      }
    }
  }
  return height + 1 //hack + 1, for border-bottom: 1px
}

const compareMinHeight = (tableColumns, minTH, minTD) => {
  let minTHHeight = minTH || 0
  let minTDHeight = minTD || 0
  if (tableColumns) {
    for (let i = 0; i < tableColumns.length; i++) {
      if (tableColumns[i].thCss.height > minTHHeight) {
        minTHHeight = tableColumns[i].thCss.height
      }
      if (tableColumns[i].tdCss.height > minTDHeight) {
        minTDHeight = tableColumns[i].tdCss.height
      }
    }
  }
  minTHHeight++//hack + 1, for border-bottom: 1px
  minTDHeight++
  return { minTHHeight, minTDHeight }
}

const findColumn = (id, tableColumns) => {
  const column = tableColumns.filter(c => c.id === id)[0]
  return { column, index: tableColumns.indexOf(column) }
}
const findDom = (id, doms) => {
  const dom = doms.filter(c => c.id === id)[0]
  return { dom, index: doms.indexOf(dom) }
}

  //背景黄色谁激活
export function activeFilter(id) {
  return (dispatch, getState) => {
    const state = getState()
    const { pm_doms, pm_cacheActiveID, pm_cacheActiveColumnID } = state
    if (pm_cacheActiveID !== id) {
      if (pm_cacheActiveID !== -1) {
        dispatch({ type: 'PM_DOM_MERGE', index: pm_cacheActiveID, merge: {
          actived: false
        } })
      }
      dispatch({ type: 'PM_DOM_MERGE', index: id, merge: {
        actived: true
      } })
      if (pm_cacheActiveColumnID !== null) {
        const { pm_tableColumns } = state
        const { index: oldIndex } = findColumn(pm_cacheActiveColumnID[0], pm_tableColumns)
        dispatch({ type: 'PM_TABLECOLUMN_MERGE', index: oldIndex, merge: {
          actived: 0
        } })
      }
      dispatch({ type: 'PM_CACHEACTIVEID_SET', val: id })
      dispatch({ type: 'PM_CACHEACTIVECOLUMNID_SET', val: null })
      dispatch({ type: 'PM_EDITITEM_SET', item: pm_doms[id] })
    }
  }
}
export function activeColumnFilter(id, thOrTd) {
  return (dispatch, getState) => {
    const state = getState()
    const { pm_tableColumns, pm_cacheActiveID, pm_cacheActiveColumnID } = state
    const { index: newIndex, column: newColumn } = findColumn(id, pm_tableColumns)
    if (pm_cacheActiveColumnID !== null) { //如果不是首次
      if (id === pm_cacheActiveColumnID[0] && pm_cacheActiveColumnID[1] === thOrTd) {
        return
      }
      const { index: oldIndex } = findColumn(pm_cacheActiveColumnID[0], pm_tableColumns)
      dispatch({ type: 'PM_TABLECOLUMN_MERGE', index: oldIndex, merge: {
        actived: 0
      } })
    }
    dispatch({ type: 'PM_TABLECOLUMN_MERGE', index: newIndex, merge: {
      actived: thOrTd
    } })
    if (pm_cacheActiveID !== -1) {
      dispatch({ type: 'PM_DOM_MERGE', index: pm_cacheActiveID, merge: {
        actived: false
      } })
    }
    const editItem = {
      act: newColumn.act,
      actived: thOrTd,
      css: thOrTd === 1 ? newColumn.thCss : newColumn.tdCss,
      field: newColumn.field,
      id: newColumn.id,
      name: newColumn.title,
      type: newColumn.type,
      ext: newColumn.ext
    }
    dispatch({ type: 'PM_CACHEACTIVEID_SET', val: -1 })
    dispatch({ type: 'PM_CACHEACTIVECOLUMNID_SET', val: [id, thOrTd] })
    dispatch({ type: 'PM_EDITITEM_SET', item: editItem })
  }
}

export function addDom(item) {
  return (dispatch, getState) => {
    const { pm_domIndex } = getState()
    const index = pm_domIndex + 1
    const newer = {
      id: `DOMS-${item.type}-${item.field}-${index}`,
      type: item.type,
      field: item.field,
      name: item.name,
      index,
      act: item.act,
      actived: false,
      css: {
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height
      },
      ext: item.type === 5 ? item.ext : {
        barcodeWidth: ''
      }
    }
    dispatch({ type: 'PM_DOMS_ADD', dom: newer })
    dispatch({ type: 'PM_DOMINDEX_INCREMENT' })
  }
}

export function setAct(type, id, newAct) {
  return (dispatch, getState) => {
    const state = getState()
    let index = -1
    switch (type) {
      case 1:
      case 2:
      case 4: {
        const { index: domIndex } = findDom(id, state.pm_doms)
        if (domIndex > -1) {
          index = domIndex
          dispatch({ type: 'PM_DOM_MERGE', index: domIndex, merge: {
            act: newAct
          } })
        }
        break
      }
      case 3: {
        const { index: columnIndex } = findColumn(id, state.pm_tableColumns)
        if (columnIndex > -1) {
          index = columnIndex
          dispatch({ type: 'PM_TABLECOLUMN_MERGE', index: columnIndex, merge: {
            act: newAct
          } })
        }
        break
      }
      default: break
    }
    if (index > -1) {
      dispatch({ type: 'PM_EDITITEM_MERGE', merge: {
        act: newAct
      } })
    }
  }
}
export function changeDomExt(type, id, merger) {
  return (dispatch, getState) => {
    const state = getState()
    let index = -1
    switch (type) {
      case 1:
      case 2:
      case 4: {
        const { index: domIndex } = findDom(id, state.pm_doms)
        if (domIndex > -1) {
          index = domIndex
          dispatch({ type: 'PM_DOM_MERGE', index: domIndex, node: 'ext', merge: merger })
        }
        break
      }
      case 3: {
        const { index: columnIndex } = findColumn(id, state.pm_tableColumns)
        if (columnIndex > -1) {
          index = columnIndex
          dispatch({ type: 'PM_TABLECOLUMN_MERGE', index: columnIndex, node: 'ext', merge: merger })
        }
        break
      }
      default: break
    }
    if (index > -1) {
      dispatch({ type: 'PM_EDITITEM_MERGE', node: 'ext', merge: merger })
    }
  }
}
export function removeDom(type, id) {
  return (dispatch, getState) => {
    const state = getState()
    let index = -1
    switch (type) {
      case 1:
      case 2:
      case 5:
      case 4: {
        const { index: domIndex } = findDom(id, state.pm_doms)
        if (domIndex > -1) {
          index = domIndex
          dispatch({ type: 'PM_DOM_REMOVE', index: domIndex })
        }
        break
      }
      case 3: {
        const { index: columnIndex } = findColumn(id, state.pm_tableColumns)
        if (columnIndex > -1) {
          index = columnIndex
          dispatch({ type: 'PM_TABLECOLUMN_REMOVE', index: columnIndex })
          const min = compareMinHeight(state.tableColumns)
          dispatch({ type: 'PM_TABLEHELP_SET', val: min })
        }
        break
      }
      default: break
    }
    if (index > -1) {
      dispatch({ type: 'PM_EDITITEM_REMOVE' })
      dispatch({ type: 'PM_CACHEACTIVEID_SET', val: -1 })
      dispatch({ type: 'PM_CACHEACTIVECOLUMNID_SET', val: null })
    }
  }
}

export function modifyTitle(type, id, title) {
  return (dispatch, getState) => {
    const state = getState()
    let index = -1
    switch (type) {
      case 1:
      case 2:
      case 4: {
        const { index: domIndex } = findDom(id, state.pm_doms)
        if (domIndex > -1) {
          index = domIndex
          if (type === 4) {
            dispatch({ type: 'PM_DOM_MERGE', index: domIndex, merge: {
              name: title
            } })
          } else {
            dispatch({ type: 'PM_DOM_MERGE', index: domIndex, node: 'ext', merge: {
              name: title
            } })
          }
        }
        break
      }
      case 3: {
        const { index: columnIndex } = findColumn(id, state.pm_tableColumns)
        if (columnIndex > -1) {
          index = columnIndex
          dispatch({ type: 'PM_TABLECOLUMN_MERGE', index: columnIndex, merge: {
            title
          } })
        }
        break
      }
      default: break
    }
    if (index > -1) {
      dispatch({ type: 'PM_EDITITEM_MERGE', merge: {
        name: title
      } })
    }
  }
}

export function addColumn(item) {
  return (dispatch, getState) => {
    const { pm_tableColumns, pm_columnIndex } = getState()
    const newer = Object.assign({
      title: item.name,
      id: `Column-${item.type}-${item.field}-${pm_columnIndex + 1}`,
      active: false,
      ext: {
        barcodeWidth: ''
      }
    }, item)
    const newHelp = compareMinHeight(pm_tableColumns, item.thCss.height, item.tdCss.height)
    dispatch({ type: 'PM_COLUMNINDEX_INCREMENT' })
    dispatch({ type: 'PM_TABLECOLUMN_ADD', column: newer })
    dispatch({ type: 'PM_TABLEHELP_SET', val: newHelp })
  }
}

export function settingPrintRangeTop(value) {
  return (dispatch, getState) => {
    const { pm_setting } = getState()
    dispatch({ type: 'PM_SETTING_PRT_SET', val: value })
    dispatch({ type: 'PM_PRINTRANGE_SET', val: parsePrintRanger(pm_setting, pm_setting.prL, value) })
  }
}
export function settingPrintRangeLeft(value) {
  return (dispatch, getState) => {
    const { pm_setting } = getState()
    dispatch({ type: 'PM_SETTING_PRL_SET', val: value })
    dispatch({ type: 'PM_PRINTRANGE_SET', val: parsePrintRanger(pm_setting, value, pm_setting.prT) })
  }
}

export function resizeColumn(id, size, type) {
  return (dispatch, getState) => {
    const state = getState()
    const { pm_tableColumns, pm_tableHelp } = state
    const { index } = findColumn(id, pm_tableColumns)
    switch (type) {
      case 'thCss': {
        const minHeight = compareMinTHHeight(size.height, pm_tableColumns)
        dispatch({ type: 'PM_TABLECOLUMN_UPDATE', update: {
          [index]: {
            [type]: {
              $merge: size
            }
          }
        } })
        if (pm_tableHelp.minTHHeight !== minHeight) {
          dispatch({ type: 'PM_TABLEHELP_UPDATE', update: {
            minTHHeight: {
              $set: minHeight
            }
          } })
        }
        break
      }
      case 'tdCss': {
        const minHeight = compareMinTDHeight(size.height, pm_tableColumns)
        dispatch({ type: 'PM_TABLECOLUMN_UPDATE', update: {
          [index]: {
            [type]: {
              $merge: size
            }
          }
        } })
        if (pm_tableHelp.minTHHeight !== minHeight) {
          dispatch({ type: 'PM_TABLEHELP_UPDATE', update: {
            minTDHeight: {
              $set: minHeight
            }
          } })
        }
        break
      }
      default: break
    }
  }
}

export function changeDomCss(item, merge) {
  return (dispatch, getState) => {
    const state = getState()
    switch (item.type) {
      case 2: { //数据项
        const { index } = findDom(item.id, state.pm_doms)
        dispatch({ type: 'PM_DOM_CSS_MERGE', index, merge })
        break
      }
      case 3: { //表列项
        const { index, column } = findColumn(item.id, state.pm_tableColumns)
        let updateCssName = null
        switch (column.actived) {
          case 1: { //th
            updateCssName = 'thCss'
            break
          }
          case 2: { //th
            updateCssName = 'tdCss'
            break
          }
          default: break
        }
        if (updateCssName !== null) {
          dispatch({ type: 'PM_TABLECOLUMN_UPDATE', update: {
            [index]: {
              [updateCssName]: {
                $merge: merge
              }
            }
          } })
        }
        break
      }
      case 4: { //自定义
        const { index } = findDom(item.id, state.pm_doms)
        dispatch({ type: 'PM_DOM_CSS_MERGE', index, merge })
        break
      }
      default: break
    }
  }
}
export function removeEditItem() {
  return (dispatch, getState) => {
    const { pm_editItem } = getState()
    if (pm_editItem !== null) {
      if (window.confirm('确定要删除选中节点吗')) {
        dispatch(removeDom(pm_editItem.type, pm_editItem.id))
      }
    }
  }
}
const getKeybordMoveOffset = (direction, css) => {
  let merge = null
  switch (direction) {
    case 'left': {
      merge = {
        left: css.left - 1
      }; break
    }
    case 'right': {
      merge = {
        left: css.left + 1
      }; break
    }
    case 'up': {
      merge = {
        top: css.top - 1
      }; break
    }
    case 'down': {
      merge = {
        top: css.top + 1
      }; break
    }
    default: break
  }
  return merge
}
export function keybordMoveEditItem(direction) {
  return (dispatch, getState) => {
    const state = getState()
    if (state.pm_editItem !== null) {
      const item = state.pm_editItem
      switch (item.type) {
        case 2: //数据项
        case 1: //自定义线框
        case 4: { //自定义内容 //todo 自定义logo
          const { index, dom } = findDom(item.id, state.pm_doms)
          const merge = getKeybordMoveOffset(direction, dom.css)
          if (merge) {
            dispatch({ type: 'PM_DOM_CSS_MERGE', index, merge })
          }
          return
        }
        case 3: { //表列项
          const merge = getKeybordMoveOffset(direction, state.pm_tableStyle)
          if (merge) {
            dispatch({ type: 'PM_TABLESTYLE_MERGE', merge })
          }
          return
        }
        default: break
      }
    }
  }
}
//hack
export function saveSys() {
  return (dispatch, getState) => {
    const { pm_tpl_name, pm_setting, pm_tableStyle, pm_tableHelp, pm_doms, pm_tableColumns } = getState()
    const save_data = {
      type: window.ZCH.type,
      sys_id: window.ZCH.sys_id,
      name: pm_tpl_name,
      state: {
        setting: pm_setting,
        tableStyle: pm_tableStyle,
        tableHelp: pm_tableHelp,
        doms: pm_doms,
        tableColumns: pm_tableColumns
      }
    }
    const uri = window.ZCH.sys_id > 0 ? 'print/tpl/modifySys' : 'print/tpl/createSys'
    ZPost(uri, save_data, (s, d, m) => {
      if (window.ZCH.sys_id > 0) {
        message.success('保存模板成功')
      } else {
        window.location.href = `/page/print/modify?sys_id=${d.sys_id}`
      }
    })
  }
}

//保存
export function saveTpl() {
  return (dispatch, getState) => {
    //return dispatch(saveSys());
    const { pm_tpl_name, pm_setting, pm_print_setting, pm_tableStyle, pm_tableHelp, pm_doms, pm_tableColumns } = getState()
    const len = pm_tpl_name.length
    if (len < 1 || len > 20) {
      message.error('模板名长度必须1~20字')
      return
    }
    let Lodop = getLodop()
    if (typeof Lodop === 'string') {
      Lodop = false
    }
    const save_data = {
      my_id: window.ZCH.my_id, //currentTplID,
      sys_id: window.ZCH.sys_id,
      type: window.ZCH.type,
      pm_tpl_name,
      state: {
        setting: pm_setting,
        tableStyle: pm_tableStyle,
        tableHelp: pm_tableHelp,
        doms: pm_doms,
        tableColumns: pm_tableColumns
      },
      print_setting: {
        machine_name: Lodop ? Lodop.GET_PRINTER_NAME(pm_print_setting.machine) : '', //这个应该是保存名字
        paper: pm_print_setting.paper,
        direction: pm_print_setting.direction,
        quality: pm_print_setting.quality
      }
    }
    //如果是创建，要跳转
    ZPost('print/tpl/saveMy', save_data, (s, d, m) => {
      if (!window.ZCH.my_id) {
        window.location.href = `/?my_id=${d.my_id}`
      } else {
        message.success('保存模板成功')
      }
    })
  }
}

const getPagers = function(key) {
  const papers = window.CLODOP.GET_PAGESIZES_LIST(key, '\n').split('\n').map((item) => {
    return {
      key: item,
      value: item
    }
  })
  papers.unshift({ key: '*', value: '纸张:自动' })
  return papers
}
export function selectPrintMachine(key) {
  return (dispatch) => {
    //dispatch({ type: 'PRINTMACHINESELECT_SET', payload: key });
    const merge = {
      papers: getPagers(key),
      paper: '*',
      machine: key,
      direction: window.CLODOP.GET_PRINTER_NAME(`${key}:Orientation`) || '1'
    }
    dispatch({ type: 'PM_PRINTSETTING_MERGE', merge })
  }
}
export function selectPrintOri(src, print_setting) {
  return (dispatch, getState) => {
    let setting = print_setting
    if (!print_setting) {
      setting = getState().pm_print_setting
    }
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
    const oscript = document.createElement('script')
    oscript.src = src
    head.insertBefore(oscript, head.firstChild)
    oscript.onload = oscript.onreadystatechange = () => {
      if ((!oscript.readyState || /loaded|complete/.test(oscript.readyState))) {
        const Lodop = getLodop()
        if (typeof Lodop === 'string') {
          dispatch({ type: 'PM_PRINTMSG_SET', payload: Lodop })
        } else if (Lodop) {
          const len = Lodop.GET_PRINTER_COUNT()
          if (len > 0) {
            let machine_index = 0
            let paper = '*'
            let direction = '1'
            let quality = 100
            const machines = []
            for (let i = 0; i < len; i++) {
              const name = Lodop.GET_PRINTER_NAME(i)
              if (name === setting.machine_name) { //这个名字是从后台获取的
                machine_index = i
                paper = setting.paper
                direction = setting.direction //.GET_PRINTER_NAME('0:Orientation')
                quality = setting.quality //.GET_PRINTER_NAME(`${machine_index}:PrintQuality`);
              }
              machines.push({
                key: i + '',
                value: name
              })
            }
            const merge = {
              machines,
              papers: getPagers(machine_index),
              direction,
              paper,
              machine: machine_index + '',
              quality
            }
            dispatch({type: 'PM_LODOP_TARGET_SET', payload: src})
            dispatch({ type: 'PM_PRINTSETTING_MERGE', merge })
          }
        }
      }
    }
  }
}

export function initRender(d, zch) {
  return (dispatch, getState) => {
    if (typeof d.currentTplID !== 'undefined') {
      dispatch({ type: 'PM_CURRENTTPLID_SET', id: d.currentTplID })
    }
    if (typeof d.tpl_name !== 'undefined') {
      dispatch({ type: 'PM_TPL_NAME_SET', text: d.tpl_name })
    }
    if (typeof d.states !== 'undefined' && d.states) {
      if (typeof d.states.setting !== 'undefined') {
        dispatch({ type: 'PM_SETTING_SET', payload: d.states.setting })
        dispatch({ type: 'PM_PRINTRANGE_SET', val: parsePrintRanger(d.states.setting, d.states.setting.prL, d.states.setting.prT) })
      }
      if (typeof d.states.tableStyle !== 'undefined') {
        dispatch({ type: 'PM_TABLESTYLE_SET', val: d.states.tableStyle })
      }
      if (typeof d.states.tableHelp !== 'undefined') {
        dispatch({ type: 'PM_TABLEHELP_SET', val: d.states.tableHelp })
      }
      let domIndex = 0
      if (typeof d.states.doms !== 'undefined') {
        const doms = d.states.doms.map((dom) => {
          domIndex++
          dom.id = `DOMS-${dom.type}-${dom.field}-${domIndex}`
          dom.actived = false
          return dom
        })
        dispatch({ type: 'PM_DOMS_SET', payload: doms })
      }
      dispatch({ type: 'PM_DOMINDEX_SET', val: domIndex })
      let columnIndex = 0
      if (typeof d.states.tableColumns !== 'undefined') {
        const tableColumns = d.states.tableColumns.map((column) => {
          columnIndex++
          column.id = `Column-${column.type}-${column.field}-${columnIndex}`
          column.actived = 0
          return column
        })
        dispatch({ type: 'PM_TABLECOLUMN_SET', payload: tableColumns })
      }
      dispatch({ type: 'PM_COLUMNINDEX_SET', val: columnIndex })
    } else {
      if (typeof d.type_setting !== 'undefined') {
        dispatch({ type: 'PM_SETTING_MERGE', merge: d.type_setting }) //pageW pageH
      }
    }
    dispatch({ type: 'PM_ENTERLOADING_SET', payload: false })
    //预置
    if (typeof d.presets !== 'undefined' && d.presets) {
      dispatch({ type: 'PM_PRESETFIELDS_SET', payload: d.presets })
      if (typeof d.print_setting_page !== 'undefined') {
        dispatch({ type: 'PM_SETTING_MERGE', merge: d.print_setting_page })
      }
    }
    if (typeof d.type !== 'undefined' && d.type) {
      window.ZCH.type = d.type
    }
    if (typeof d.sys_id !== 'undefined' && d.sys_id) {
      window.ZCH.sys_id = d.sys_id
    }
    if (typeof d.lodop_target !== 'undefined') {
      dispatch(selectPrintOri(d.lodop_target, d.print_setting))
    } else {
      const {pm_lodop_target} = getState()
      dispatch(selectPrintOri(pm_lodop_target, d.print_setting))
    }
  }
}
