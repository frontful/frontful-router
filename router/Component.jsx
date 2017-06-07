import PropTypes from 'prop-types'
import React from 'react'
import {Branch} from './Branch.jsx'
import {Placeholder} from './Placeholder.jsx'
import {Model} from '.'
import {resolver} from 'frontful-resolver'

@resolver.config(({models}) => ({
  model: models.global(Model)
}))
@resolver.bind((resolve) => {
  resolve.once(({model, queries}) => {
    model.setupQueries(queries)
  })
  resolve(
    ({model, children, hierarchy}) => ({
      Branch: <Branch hierarchy={hierarchy || children} selector={model.path} />,
      router: {
        path: model.path,
        push: model.push
      }
    }),
    ({model}) => {
      model.resolved()
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
