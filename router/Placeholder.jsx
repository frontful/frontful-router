import React from 'react'
import {Branch} from './Branch'
import {Model} from './Model'
import {resolver} from 'frontful-resolver'

@resolver.config(({models}) => ({
  router: models.global(Model),
}))
@resolver.bind((resolve) => {
  resolve(({router}) => {
    return router.injectionRegister.keys().reduce((items, key) => {
      items[key] = <Branch hierarchy={router.queries[key].responder} selector={router.injectionRegister.get(key)} />
      return items
    }, {})
  })
})
class Placeholder extends React.PureComponent {
  render() {
    return (
      <div>
        {Object.keys(this.props.requisites).map((key) => {
          const Element = this.props.requisites[key]
          return <Element key={key} />
        })}
      </div>
    )
  }
}

export {
  Placeholder,
}
