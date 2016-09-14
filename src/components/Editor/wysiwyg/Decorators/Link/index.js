import React, { PropTypes, Component } from 'react'
import { Entity } from 'draft-js'
import styles from './styles.scss' // eslint-disable-line no-unused-vars
//import openlink from '../../../../images/openlink.svg';
import Icon from 'components/Icon/index'

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      )
    },
    callback
  )
}

class Link extends Component {

  static propTypes = {
    entityKey: PropTypes.string.isRequired,
    children: PropTypes.any
  };

  state: Object = {
    showPopOver: false
  };

  _openLink: Function = () => {
    const { entityKey } = this.props
    const { url } = Entity.get(entityKey).getData()
    const linkTab = window.open(url, '_blank') // eslint-disable-line no-undef
    linkTab.focus()
  };

  _toggleShowPopOver: Function = () => {
    const showPopOver = !this.state.showPopOver
    this.setState({
      showPopOver
    })
  };

  render() {
    const { children } = this.props
    const { showPopOver } = this.state
    return (
      <span
        className='link-decorator-wrapper'
        onMouseEnter={this._toggleShowPopOver}
        onMouseLeave={this._toggleShowPopOver}>
        <span className='link-decorator-link'>{children}</span>
        {showPopOver ? <Icon type='chain' role='presentation' onClick={this._openLink} className='link-decorator-icon' /> : undefined}
      </span>
    )
  }
}

export default {
  strategy: findLinkEntities,
  component: Link
}
