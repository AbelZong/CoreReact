/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-31
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
import PrintViewRoute from './Print/view'
import AdminMenusRoute from './Admin/Menus'
import AdminShopsRoute from './Admin/Shops'
import AdminUsersRoute from './Admin/Users'
import AdminBrandsRoute from './Admin/Brands'
import AdminCompanyRoute from './Admin/Company'
import AdminAccessRoute from './Admin/Access'
import AdminPrintSetRoute from './Admin/PrintSet'
import PurchaseListRoute from './Purchase/List'
import CompanyClientsRoute from './Company/Clients'
import WarehouseSettingsRoute from './Warehouse/Settings'
import WarehouseSettingsPlusRoute from './Warehouse/Settings+'
import WarehouseOrderulesRoute from './Warehouse/Orderules'
import WarehousePriRoute from './Warehouse/Pri'
import BusinessSettingRoute from './Admin/BusinessSetting'
import ProductCatesRoute from './Product/Cates'
import ProductListRoute from './Product/List'
import ProductList2Route from './Product/List2'
import ProductApproveRoute from './Product/Approve'
import ProductTagPrintRoute from './Product/TagPrint'
import ProductNormMappingRoute from './Product/NormMapping'
import Warehouse3rdRoute from './Warehouse/3rd'
import SuperAnnounceRoute from './Super/Announce'
import OrderListRoute from './Order/List'
import OrderAfterRoute from './Order/After'
import OrderGiftRuleRoute from './Order/GiftRule'
import StockInitRoute from './Stock/Init'
import StockTakeRoute from './Stock/Take'
import StockPickAndBatch from './Stock/PickAndBatch'
import StockMainInvRoute from './Stock/MainInv'
import StockFenInvRoute from './Stock/FenInv'
import LogisticsFreightRoute from './Logistics/Freight'
import LogisticsCompanyRoute from './Logistics/Company'
import SaleOutRoute from './Sale/Out'
import SalePayRoute from './Sale/Pay'
import SaleRefundRoute from './Sale/Refund'
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
      PrintViewRoute(store),
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
      AdminPrintSetRoute(store),
      PurchaseListRoute(store),
      CompanyClientsRoute(store),
      WarehouseSettingsRoute(store),
      WarehouseSettingsPlusRoute(store),
      WarehouseOrderulesRoute(store),
      Warehouse3rdRoute(store),
      WarehousePriRoute(store),
      ProductCatesRoute(store),
      ProductListRoute(store),
      ProductList2Route(store),
      ProductApproveRoute(store),
      ProductTagPrintRoute(store),
      BusinessSettingRoute(store),
      ProductNormMappingRoute(store),
      SuperAnnounceRoute(store),
      StockInitRoute(store),
      StockTakeRoute(store),
      StockMainInvRoute(store),
      StockFenInvRoute(store),
      StockPickAndBatch(store),
      OrderListRoute(store),
      OrderAfterRoute(store),
      OrderGiftRuleRoute(store),
      LogisticsFreightRoute(store),
      LogisticsCompanyRoute(store),
      SaleOutRoute(store),
      SalePayRoute(store),
      SaleRefundRoute(store),
      NotFoundRoute
    ],
    ignoreScrollBehavior: true
  }
])
export default createRoutes
