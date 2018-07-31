import PropTypes from 'prop-types'
import React from 'react'
import {Extras} from './Extras.jsx'
import {Match} from './Match.jsx'
import {Model} from '.'
import {resolver} from 'frontful-resolver'

@resolver.define(({models}) => ({
  router: models.global(Model)
}))
@resolver((resolve) => {
  resolve.untracked(({router, queries}) => router.setup(queries))
  resolve(
    ({router, children}) => ({
      Match:
        <Match path={router.path} setParams={router.setParams}>
          {children}
        </Match>,
      context: {
        path: router.path,
        push: router.push,
      },
    }),
    ({router}) => router.resolved(),
    () => ({
      Extras:
        <Extras />,
    }),
  )
})
class Router extends React.PureComponent {
  static childContextTypes = {
    'frontful-router': PropTypes.object
  }

  getChildContext() {
    return {
      'frontful-router': this.props.context
    }
  }

  render() {
    const {Match, Extras} = this.props
    return (
      <React.Fragment>
        <Match />
        <Extras />
      </React.Fragment>
    )
  }

  componentDidUpdate() {
    window.scrollTo(0, 0)
  }
}

export {
  Router,
}
