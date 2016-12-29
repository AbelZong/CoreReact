import { ZAsync } from 'utils/Xfetch'

let _cacheData = null // consider localStorge
async function AreasCall() {
  if (_cacheData === null) {
    const json = await ZAsync('Common/getArea')
    if (json.s > 0) {
      _cacheData = json.d
    }
  }
  return _cacheData
}
export default AreasCall
