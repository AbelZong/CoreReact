// We only need to import the modules necessary for initial render
import WheatLayout from 'layouts/WheatLayout'
import PageLayout from 'layouts/PageLayout'
import DashBordRoute from './DashBord'
import LoginRoute from './Login'
import ApplyRoute from './Apply'
import NotFoundRoute from './NotFound'
import PrintUserRoute from './Print'
import PrintAdminRoute from './Print/admin'

export const createRoutes = (store) => ([
  {
    path: '/go',
    component: PageLayout,
    childRoutes: [
      LoginRoute(store),
      ApplyRoute(store),
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
    path: '/',
    component: WheatLayout,
    indexRoute: DashBordRoute(store),
    childRoutes: [
      NotFoundRoute
    ],
    ignoreScrollBehavior: true
  }
])
export default createRoutes
