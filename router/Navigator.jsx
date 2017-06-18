import React from 'react'
import {resolver} from 'frontful-resolver'
import {Model} from './Model'

@resolver.define(({models}) => ({
  router: models.global(Model)
}))
@resolver((resolve) => {
  resolve.untracked(({router, constraints}) => {
    return constraints().then((path) => {
      if (path) {
        if (router.path !== path) {
          router.replace(path)
        }
      }
      return null
    })
  })
})
class Navigator extends React.PureComponent {
  render() {
    return this.props.children
  }
}

export {
  Navigator,
}
