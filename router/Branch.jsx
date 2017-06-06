import React from 'react'
import {resolver} from 'frontful-resolver'

function findRoute(hierarchy, selector) {
  if (!hierarchy) {
    return []
  }
  else if (hierarchy.props.selector === '*' || hierarchy.props.selector === selector) {
    const Item = hierarchy.type
    const {children, ...rest} = hierarchy.props // eslint-disable-line
    return [<Item {...rest}/>]
  }
  else {
    const {children: _children, ...rest} = hierarchy.props
    let children = _children
    if (children) {
      children = [].concat(children)
      for (let i = 0, l = children.length; i < l; i++) {
        const match = findRoute(children[i], selector)
        if (match.length > 0) {
          const Item = hierarchy.type
          if (Item === 'foo') {
            return match
          }
          else {
            return [<Item {...rest}/>].concat(match)
          }
        }
      }
    }
  }
  return []
}

@resolver.bind((resolve) => {
  resolve(({hierarchy, selector, onNotFound}) => {
    const route = findRoute(<foo>{hierarchy}</foo>, selector)
    if (!route || !route.length) {
      if (onNotFound) {
        onNotFound()
      }
      else {
        return null
      }
    }
    return route
  })
})
class Branch extends React.PureComponent {
  extractSortedComponentArray(object) {
    return Object.keys(object).map((key, idx) => {
      return object[idx]
    })
  }

  renderHierarchy(items, restProps) {
    return this.getHierarchyItem(items, restProps)
  }

  getHierarchyItem(items, restProps) {
    if (!items || items.length === 0) return null
    const [Item, ...restItems] = items

    return (
      <Item {...restProps}>
        {this.getHierarchyItem(restItems, null)}
      </Item>
    )
  }

  render() {
    const {requisites, ...restProps} = this.props
    return (
      this.renderHierarchy(requisites.__array, restProps)
    )
  }
}

export {
  Branch,
}
