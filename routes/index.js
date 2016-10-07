// We only need to import the modules necessary for initial render
import WheatLayout from 'layouts/WheatLayout'
import GoLayout from 'layouts/GoLayout'
import PageLayout from 'layouts/PageLayout'
import DashBordRoute from './DashBord'
import LoginRoute from './Login'
import ApplyRoute from './Apply'
import NotFoundRoute from './NotFound'
import PrintUserRoute from './Print'
import PrintAdminRoute from './Print/admin'
import PrintModifyRoute from './Print/modify'
import AdminMenusRoute from './Admin/Menus'
import AdminShopsRoute from './Admin/Shops'
import AdminUsersRoute from './Admin/Users'
import AdminCompanyRoute from './Admin/Company'
import PurchaseListRoute from './Purchase/List'

export const createRoutes = (store) => ([
  {
    path: '/go',
    component: GoLayout,
    childRoutes: [
      LoginRoute(store),
      ApplyRoute(store),
      NotFoundRoute
    ],
    ignoreScrollBehavior: true,
    indexRoute: NotFoundRoute
  },
  {
    path: '/page',
    component: PageLayout,
    childRoutes: [
      PrintModifyRoute(store),
      NotFoundRoute
    ],
    ignoreScrollBehavior: true,
    indexRoute: NotFoundRoute
  },
  {
    path: '/print',
    component: WheatLayout,
    childRoutes: [
      PrintUserRoute(store),
      PrintAdminRoute(store)
    ],
    ignoreScrollBehavior: true,
    indexRoute: NotFoundRoute
  },
  {
    path: '/admin',
    component: WheatLayout,
    childRoutes: [
      AdminShopsRoute(store),
      AdminCompanyRoute(store),
      AdminMenusRoute(store),
      AdminUsersRoute(store)
    ],
    ignoreScrollBehavior: true,
    indexRoute: NotFoundRoute
  },
  {
    path: '/',
    component: WheatLayout,
    indexRoute: DashBordRoute(store),
    childRoutes: [
      PurchaseListRoute(store),
      NotFoundRoute
    ],
    ignoreScrollBehavior: true
  }
])
export default createRoutes
