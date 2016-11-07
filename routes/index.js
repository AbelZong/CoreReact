/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-31 16:04:50
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
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
import AdminBrandsRoute from './Admin/Brands'
import AdminCompanyRoute from './Admin/Company'
import AdminAccessRoute from './Admin/Access'
import PurchaseListRoute from './Purchase/List'
import CompanyClientsRoute from './Company/Clients'
import WarehouseSettingsRoute from './Warehouse/Settings'
import WarehouseSettingsPlusRoute from './Warehouse/Settings+'
import WarehouseOrderulesRoute from './Warehouse/Orderules'
import BusinessSettingRoute from './Admin/BusinessSetting'
import ProductCatesRoute from './Product/Cates'
import ProductNormMappingRoute from './Product/NormMapping'
import Warehouse3rdRoute from './Warehouse/3rd'
//import AdminCompanyRoute from './Admin/Company'
// const QQ = require.context('./__ENTERIES__', false, /\.js$/)
// console.dir(QQ)
// console.log(QQ.keys())
// console.log(QQ('./AdminBrandsRoute.js'))

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
    path: '/',
    component: WheatLayout,
    indexRoute: DashBordRoute(store),
    childRoutes: [
      AdminShopsRoute(store),
      AdminCompanyRoute(store),
      AdminMenusRoute(store),
      AdminUsersRoute(store),
      AdminBrandsRoute(store),
      AdminAccessRoute(store),
      PurchaseListRoute(store),
      CompanyClientsRoute(store),
      WarehouseSettingsRoute(store),
      WarehouseSettingsPlusRoute(store),
      WarehouseOrderulesRoute(store),
      Warehouse3rdRoute(store),
      ProductCatesRoute(store),
      BusinessSettingRoute(store),
      ProductNormMappingRoute(store),
      NotFoundRoute
    ],
    ignoreScrollBehavior: true
  }
])
export default createRoutes
