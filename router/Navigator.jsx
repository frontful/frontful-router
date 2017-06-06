import React from 'react'
import {resolver} from 'frontful-resolver'
import {Model} from './Model'

@resolver.config(({models}) => ({
  router: models.global(Model)
}))
@resolver.bind((resolve) => {
  resolve.once(({router, constraints}) => {
    return constraints().then((forcedPath) => {
      if (forcedPath) {
        if (router.path !== forcedPath) {
          router.replace(forcedPath)
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
