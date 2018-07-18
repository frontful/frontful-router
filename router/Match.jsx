import React from 'react'
import pathToRegexp from 'path-to-regexp'
import {resolver} from 'frontful-resolver'

function test(pattern, path) {
  if (pattern) {
    let keys = []
    const match = `${path}`.match(pattern instanceof RegExp ? pattern : pathToRegexp(pattern, keys))
    if (match) {
      return keys.reduce((result, key, idx) => {
        result[key.name] = match[idx + 1]
        return result
      }, {match})
    }
  }
  return null
}

function match(element, path, setParams) {
  const matched = test(element.props.pattern, path)

  if (matched) {
    const Item = element.type
    const {children, ...rest} = element.props // eslint-disable-line
    if (setParams) {
      setParams(matched)
    }
    return [<Item {...rest}/>]
  }
  else {
    let {children, ...rest} = element.props
    if (children) {
      children = [].concat(children)
      for (let i = 0, l = children.length; i < l; i++) {
        const result = match(children[i], path, setParams)
        if (result.length > 0) {
          const Item = element.type
          if (Item === 'void') {
            return result
          }
          else {
            return [<Item {...rest}/>].concat(result)
          }
        }
      }
    }
    return []
  }
}

@resolver((resolve) => {
  resolve(({children, path, setParams}) => {
    const items = resolve.value(match(<void>{children}</void>, path, setParams))
    return {items}
  })
})
class Match extends React.PureComponent {
  hierarchify(items, props) {
    if (items.length === 0) {
      return null
    }
    else {
      let [Item, ...rest] = items
      let elementProps = {}
      if (React.isValidElement(Item)) {
        elementProps = Item.props
        Item = Item.type
      }
      return (
        <Item {...elementProps} {...props}>
          {this.hierarchify(rest, null)}
        </Item>
      )
    }
  }

  render() {
    const {items, ...rest} = this.props
    return this.hierarchify(items, rest)
  }
}

export {
  Match,
}
