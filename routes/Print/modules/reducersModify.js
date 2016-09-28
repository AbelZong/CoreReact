import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
import store from 'utils/store'

const pm_print_msg = handleActions({
  PM_PRINTMSG_SET: (state, action) => (action.payload)
}, null)
const pm_roleLv = handleActions({
  PM_ROLELV_SET: (state, action) => (action.payload)
}, 0)
const pm_lodop_target = handleActions({
  PM_LODOP_TARGET_SET: (state, action) => {
    const newState = action.payload
    store.set('lodop.target', newState)
    return newState
  }
}, store.get('lodop.target', 'http://localhost:8000/CLodopfuncs.js?priority=1'))
const pm_print_setting = handleActions({
  PM_PRINTSETTING_SET: (state, action) => (action.payload),
  PM_PRINTSETTING_MERGE: (state, action) => {
    return update(state, {
      $merge: action.merge
    })
  }
}, {
  machine: '-1',
  paper: '*',
  direction: '1',
  quality: 100,
  machines: [{ key: '-1', value: '选择打印机' }],
  papers: [{ key: '*', value: '纸张:自动' }],
  directions: [
    { key: '1', value: '纵向(默认)' },
    { key: '2', value: '横向打印' }
  ]
})
const pm_columnIndex = handleActions({
  PM_COLUMNINDEX_INCREMENT: (state, action) => (state + 1),
  PM_COLUMNINDEX_DECREMENT: (state, action) => (state - 1),
  PM_COLUMNINDEX_SET: (state, action) => (action.val)
}, 0)
const pm_domIndex = handleActions({
  PM_DOMINDEX_INCREMENT: (state, action) => (state + 1),
  PM_DOMINDEX_DECREMENT: (state, action) => (state - 1),
  PM_DOMINDEX_SET: (state, action) => (action.val)
}, 0)
const pm_cacheActiveID = handleActions({
  PM_CACHEACTIVEID_SET: (state, action) => (action.val)
}, -1)
const pm_cacheActiveColumnID = handleActions({
  PM_CACHEACTIVECOLUMNID_SET: (state, action) => (action.val)
}, null)

const pm_GRIDLINES_CHECKED = handleActions({
  PM_GRIDLINES_CHECKED: (state, action) => (action.checked)
}, true)

const pm_BGIMG_CHECKED = handleActions({
  PM_BGIMG_CHECKED: (state, action) => (action.checked)
}, false)

const pm_tpl_name = handleActions({
  PM_TPL_NAME_SET: (state, action) => (action.text)
}, '新模板')

const pm_sideTplActived = handleActions({
  PM_SIDETPL_ACTIVIED_SET: (state, action) => (action.actived)
}, false)

const pm_editItem = handleActions({
  PM_EDITITEM_SET: (state, action) => (action.item),
  PM_EDITITEM_REMOVE: (state, action) => (null),
  PM_EDITITEM_MERGE: (state, action) => {
    return update(state, typeof action.node === 'undefined' ? {
      $merge: action.merge
    } : {
      [action.node]: {
        $merge: action.merge
      }
    })
  }
}, null)

const pm_currentTplID = handleActions({
  PM_CURRENTTPLID_SET: (state, action) => (action.id)
}, 0)
const pm_previewed = handleActions({
  PM_PREVIEWED_SET: (state, action) => (action.payload)
}, 0)

const pm_printRange = handleActions({
  PM_PRINTRANGE_SET: (state, action) => (action.val)
}, {})

//todo !计算 printRange
const pm_setting = handleActions({
  PM_SETTING_SET: (state, action) => {
    return action.payload
  },
  PM_SETTING_MERGE: (state, action) => {
    return update(state, {
      $merge: action.merge
    })
  },
  PM_SETTING_PAGEW_SET: (state, action) => {
    return update(state, {
      $merge: {
        pageW: action.val * 1
      }
    })
  },
  PM_SETTING_PAGEH_SET: (state, action) => {
    return update(state, {
      $merge: {
        pageH: action.val * 1
      }
    })
  },
  PM_SETTING_PRT_SET: (state, action) => {
    return update(state, {
      $merge: {
        prT: action.val * 1
      }
    })
  },
  PM_SETTING_PRL_SET: (state, action) => {
    return update(state, {
      $merge: {
        prL: action.val * 1
      }
    })
  }
}, {
  pageW: 210, //mm
  pageH: 270,
  prT: 0, //边距上
  prL: 0 //边距左
})

// const presetFields = createAction('PRESETFIELDS_SET', (state, action) => {
//   return typeof action.payload === 'undefined' ? [] : action.payload;
// });
const pm_enterLoading = handleActions({
  PM_ENTERLOADING_SET: (state, action) => {
    return typeof action.payload === 'undefined' ? false : !!action.payload
  }
}, true)
const pm_presetFields = handleActions({
  PM_PRESETFIELDS_SET: (state, action) => {
    return typeof action.payload === 'undefined' ? [] : action.payload
  }
}, [])

const pm_tableColumns = handleActions({
  PM_TABLECOLUMN_SET: (state, action) => (action.payload),
  PM_TABLECOLUMN_ADD: (state, action) => {
    return update(state, {
      $push: [action.column]
    })
  },
  PM_TABLECOLUMN_REMOVE: (state, action) => {
    return update(state, {
      $splice: [[action.index, 1]]
    })
  },
  PM_TABLECOLUMN_MERGE: (state, action) => {
    return update(state, {
      [action.index]: typeof action.node === 'undefined' ? {
        $merge: action.merge
      } : {
        [action.node]: {
          $merge: action.merge
        }
      }
    })
  },
  PM_TABLECOLUMN_MOVE: (state, action) => {
    return update(state, {
      $splice: action.splice
    })
  },
  PM_TABLECOLUMN_UPDATE: (state, action) => {
    return update(state, action.update)
  }
}, [])

const pm_tableHelp = handleActions({
  PM_TABLEHELP_SET: (state, action) => (action.val),
  PM_TABLEHELP_UPDATE: (state, action) => {
    return update(state, action.update)
  }
}, {
  minTHHeight: 24,
  minTDHeight: 24
})
const pm_tableStyle = handleActions({
  PM_TABLESTYLE_SET: (state, action) => (action.val),
  PM_TABLESTYLE_MERGE: (state, action) => {
    return update(state, action.merge)
  }
}, {
  left: 80, //default
  top: 200 //default
})

const pm_doms = handleActions({
  PM_DOMS_SET: (state, action) => (action.payload),
  PM_DOMS_ADD: (state, action) => {
    return update(state, {
      $push: [action.dom]
    })
  },
  PM_DOM_REMOVE: (state, action) => {
    return update(state, {
      $splice: [[action.index, 1]]
    })
  },
  PM_DOM_MERGE: (state, action) => {
    return update(state, {
      [action.index]: typeof action.node === 'undefined' ? {
        $merge: action.merge
      } : {
        [action.node]: {
          $merge: action.merge
        }
      }
    })
  },
  PM_DOM_CSS_MERGE: (state, action) => {
    //console.log(state, action.index, action.merge);
    return update(state, {
      [action.index]: {
        css: {
          $merge: action.merge
        }
      }
    })
  }
}, [])

export default {
  pm_roleLv,
  pm_GRIDLINES_CHECKED, pm_BGIMG_CHECKED, pm_tpl_name,
  pm_sideTplActived,
  pm_editItem,
  pm_currentTplID, pm_setting,
  pm_columnIndex, pm_domIndex,
  pm_tableHelp, pm_tableColumns, pm_tableStyle,
  pm_printRange,
  pm_doms,
  pm_cacheActiveID, pm_cacheActiveColumnID,
  pm_presetFields, pm_enterLoading,
  pm_previewed,
  pm_print_msg, pm_print_setting, pm_lodop_target
}
