import React from 'react'
import {Match} from './Match.jsx'
import {Model} from './Model'
import {resolver} from 'frontful-resolver'

@resolver.define(({models}) => ({
  router: models.global(Model),
}))
@resolver((resolve) => {
  resolve(({router}) => {
    return Array.from(router.injectionRegister.keys()).reduce((items, key) => {
      items[key] = (
        <Match path={router.injectionRegister.get(key)}>
          {router.queries[key].responder}
        </Match>
      )
      return items
    }, {})
  })
})
class Extras extends React.PureComponent {
  render() {
    return (
      <div>
        {Object.keys(this.props.resolved).map((key) => {
          const Element = this.props.resolved[key]
          return <Element key={key} />
        })}
      </div>
    )
  }
}

export {
  Extras,
}
