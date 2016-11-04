/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-05 15:07:16
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, {PropTypes} from 'react'

export default class IconStack extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
    children: PropTypes.node.isRequired
  };

  render() {
    let {
      className,
      size,
      children,
      ...props
    } = this.props

    let classNames = ['fa-stack']

    if (size) {
      classNames.push(`fa-${size}`)
    }

    if (className) {
      classNames.push(className)
    }

    const iconStackClassName = classNames.join(' ')

    return (
      <span {...props} className={iconStackClassName}>
        {children}
      </span>
    )
  }
}
