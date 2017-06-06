import PropTypes from 'prop-types'
import React from 'react'
import {Branch} from './Branch'
import {Placeholder} from './Placeholder'
import {Model} from '.'
import {resolver} from 'frontful-resolver'

@resolver.config(({models}) => ({
  router: models.global(Model)
}))
@resolver.bind((resolve) => {
  resolve.once(({router, queries}) => {
    router.setupQueries(queries)
  })
  resolve(
    ({router, children, hierarchy}) => ({
      Branch: <Branch hierarchy={hierarchy || children} selector={router.path} />,
      router: {
        path: router.path,
        push: router.push
      }
    }),
    ({router}) => {
      router.resolved()
    },
    () => ({
      Placeholder: <Placeholder />,
    }),
  )
})
class Component extends React.PureComponent {
  static childContextTypes = {
    router: PropTypes.object
  }

  getChildContext() {
    return {
      router: this.props.requisites.router
    }
  }

  render() {
    const {Branch, Placeholder} = this.props.requisites
    return (
      <Branch Placeholder={Placeholder}/>
    )
  }

  componentDidUpdate() {
    window.scrollTo(0, 0)
  }
}

export {
  Component,
}
