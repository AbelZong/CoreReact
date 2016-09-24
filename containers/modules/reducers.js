import { handleActions } from 'redux-actions'
import update from 'react-addons-update'
import store from 'utils/store' //吃相不太好看

const entering = handleActions({
  ENTERING_SET: (state, action) => action.payload
}, true)
const loading = handleActions({
  LOADING_SET: (state, action) => action.payload
}, true)
const locked = handleActions({
  LOCKED_SET: (state, action) => {
    const newState = action.payload
    store.set('g.locked', newState)
    return newState
  }
}, store.get('g.locked', false))

const authed = handleActions({
  AUTHED_SET: (state, action) => action.payload
}, false)
const user = handleActions({
  USER_SET: (state, action) => (action.payload),
  USER_UPDATE: (state, action) => {
    return update(state, action.update)
  }
}, {})
const permissionMenus = handleActions({
  PERMISSIONMENUS_SET: (state, action) => (action.payload),
  PERMISSIONMENUS_UPDATE: (state, action) => {
    return update(state, action.update)
  }
}, [])
const permissionMenuFilterName = handleActions({
  PERMISSIONMENUFILTERNAME_SET: (state, action) => (action.payload)
}, [])

//页面是否分屏
const mainFixed = handleActions({
  MAINFIXED_SET: (state, action) => action.payload,
  MAINFIXED_REVER: (state, action) => !state
}, false)
const collapse = handleActions({
  COLLAPSE_SET: (state, action) => {
    const newState = action.payload
    store.set('g.collapse', newState)
    return newState
  },
  COLLAPSE_REVER: (state, action) => {
    const newState = !state
    store.set('g.collapse', newState)
    return newState
  }
}, store.get('g.collapse', false))

const proset_visibel = handleActions({
  PROSET_VISIBEL_SET: (state, action) => action.payload,
  PROSET_VISIBEL_REVER: (state, action) => !state
}, false)
const notice_visibel = handleActions({
  NOTICE_VISIBEL_SET: (state, action) => action.payload,
  NOTICE_VISIBEL_REVER: (state, action) => !state
}, false)
const notice_add = handleActions({
  NOTICE_ADD_SET: (state, action) => action.payload,
  NOTICE_ADD_REVER: (state, action) => !state
}, false)
const asideMenuCollapse1 = handleActions({
  ASIDEMENUCOLLAPSE1_SET: (state, action) => {
    const newState = action.payload
    store.set('g.asideC1', newState)
    return newState
  },
  ASIDEMENUCOLLAPSE1_REVER: (state, action) => {
    const newState = !state
    store.set('g.asideC1', newState)
    return newState
  }
}, store.get('g.asideC1', false))
const asideMenuCollapse2 = handleActions({
  ASIDEMENUCOLLAPSE2_SET: (state, action) => {
    const newState = action.payload
    store.set('g.asideC2', newState)
    return newState
  },
  ASIDEMENUCOLLAPSE2_REVER: (state, action) => {
    const newState = !state
    store.set('g.asideC2', newState)
    return newState
  }
}, store.get('g.asideC2', false))
const zhModUnq = handleActions({
  ZHMODUNQ_SET: (state, action) => action.payload,
  ZHMODUNQ_UPDATE: (state, action) => update(state, action.update),
  ZHMODUNQ_RESET: (state, action) => {
    return { mod: null, query: null, visible: false }
  }
}, { mod: null, query: null, visible: false })

const bookmarkAIndex = handleActions({
  BOOKMARKAINDEX_SET: (state, action) => {
    const newState = action.payload
    store.set('g.bookmarkAIndex', newState)
    return newState
  }
}, store.get('g.bookmarkAIndex', 0))
const bookmarks = handleActions({
  BOOKMARKS_SET: (state, action) => {
    const newState = action.payload
    store.set('g.bookmarks', newState)
    return newState
  },
  BOOKMARKS_UPDATE: (state, action) => {
    const newState = update(state, action.update)
    store.set('g.bookmarks', newState)
    return newState
  },
  BOOKMARKS_RESET: (state, action) => {
    const newState = [state[0]]
    store.set('g.bookmarks', newState)
    return newState
  }
}, store.get('g.bookmarks', [
  {
    name: '首页',
    path: '',
    hold: true,
    id: '0'
  }
]))
const menuActiveID = handleActions({
  MENUACTIVEID_SET: (state, action) => action.payload
}, -1)

export default {
  menuActiveID, entering, loading, locked, authed, proset_visibel, notice_visibel, notice_add, asideMenuCollapse2, asideMenuCollapse1, user, permissionMenus, permissionMenuFilterName, collapse, mainFixed, zhModUnq, bookmarks, bookmarkAIndex
}
