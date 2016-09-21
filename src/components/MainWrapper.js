import React from 'react'
import EE from 'utils/EE'
const dataCB = 'refreshDataCallback'
//const collapseCB = 'collapseCallback'
//todo ...looool
const MainWrapper = ComposedComponent => {
  return React.createClass({
    componentDidMount() {
      EE.bindRefreshMain(this.component[dataCB])
    },
    componentWillUnmount() {
      EE.offRefreshMain(this.component[dataCB])
    },
    handleChildRef(component) {
      this.component = component
    },
    render() {
      return <ComposedComponent {...this.props} ref={this.handleChildRef} />
    }
  })
}
export default MainWrapper

//
// const getObjectClass = (obj) => {
//   if (typeof obj !== 'object' || obj === null) {
//     return false
//   }
//   return /(\w+)\(/.exec(obj.constructor.toString())[1]
// }
// const getDisplayName = (Component) => {
//   return Component.displayName || Component.name || 'Component'
// }
// export default function MainWrapper(WrappedComponent, options = {}) {
//   // const {
//   //     withRef = false
//   // } = options
//   const WheatWrapper = React.createClass({
//     //displayName: `InjectIntl(${getDisplayName(WrappedComponent)})`,
//     //static WrappedComponent = WrappedComponent
//
//     // getWrappedInstance() {
//     //   invariant(withRef,
//     //       'To access the wrapped instance, ' +
//     //       'the `{withRef: true}` option must be set when calling: ' +
//     //       '`MainWrapper()`'
//     //   )
//     //   return this.refs.wrappedInstance
//     // }
//     componentWillMount() {
//       // if (!WrappedComponent.qq) {
//       //   WrappedComponent.qq = getDisplayName(WrappedComponent)
//       // } else {
//       //   console.error(WrappedComponent.qq)
//       // }
//       console.warn('componentWillMount 1')
//     },
//     componentDidMount() {
//       console.warn('componentDidMount 2')
//       //EE.bindRefreshMain(this.dataCBEvent)
//     },
//     componentWillUnmount() {
//       console.warn('componentWillUnmount 3')
//       EE.offRefreshMain(this.dataCBEvent)
//     },
//
//     handleRef(component) {
//       this.dataCBEvent = component ? component[dataCB] : null
//     },
//     //ref={withRef ? 'wrappedInstance' : this.handleRef}
//     render() {
//       console.warn('render')
//       return (
//         <WrappedComponent
//           {...this.props}
//           ref={this.handleRef}
//         />
//       )
//     }
//   })
//   return hoistStatics(WheatWrapper, WrappedComponent)
// }
