import React from 'react'
import styles from 'components/App.scss'

class Side extends React.Component {

  render() {
    console.log(' -- component {Side} render...')

    return (
      <div className={styles.side}>
        i'm superman
      </div>
    )
  }
}

export default Side
