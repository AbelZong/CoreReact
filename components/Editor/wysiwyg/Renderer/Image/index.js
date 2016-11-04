/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-13 14:27:34
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import { Entity, ContentBlock } from 'draft-js'
import Image from './image'

export default function ImageBlockRenderer(block: ContentBlock): Object {
  if (block.getType() === 'atomic') {
    const entity = Entity.get(block.getEntityAt(0))
    if (entity && entity.type === 'IMAGE') {
      return {
        component: Image,
        editable: false
      }
    }
  }
  return undefined
}
