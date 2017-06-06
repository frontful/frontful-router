import PropTypes from 'prop-types'
import React from 'react'

class Link extends React.PureComponent {
  constructor(...args) {
    super(...args)
    this.onClick = this.onClick.bind(this)
  }

  static contextTypes = {
    router: PropTypes.object
  }

  onClick(event) {
    event.preventDefault()
    this.context.router.push(this.props.href)
    return false
  }

  render() {
    return <a onClick={this.onClick} {...this.props}></a>
  }
}

export {
  Link,
}
