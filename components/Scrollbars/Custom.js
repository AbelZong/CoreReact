/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-18 14:09:59
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, { createClass } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import './Custom.scss'

export default createClass({

  renderTrackHorizontal(props) {
    return (
      <div {...props} className='hua--track-horizontal' />
    )
  },
  renderTrackVertical(props) {
    return (
      <div {...props} className='hua--track-vertical' />
    )
  },
  renderThumbHorizontal(props) {
    return (
      <div {...props} className='hua--thumb-horizontal' />
    )
  },
  renderThumbVertical(props) {
    return (
      <div {...props} className='hua--thumb-vertical' />
    )
  },
  renderView(props) {
    return (
      <div {...props} className='hua--view' />
    )
  },
  render() {
    return (
      <Scrollbars
        renderTrackHorizontal={this.renderTrackHorizontal}
        renderTrackVertical={this.renderTrackVertical}
        renderThumbHorizontal={this.renderThumbHorizontal}
        renderThumbVertical={this.renderThumbVertical}
        renderView={this.renderView}
        className='hua--zhang'
        {...this.props} />
    )
  }
})
