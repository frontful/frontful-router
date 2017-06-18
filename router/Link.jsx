import PropTypes from 'prop-types'
import React from 'react'

class Link extends React.PureComponent {
  static contextTypes = {
    'frontful-router': PropTypes.object
  }

  onClick = (event) => {
    this.context['frontful-router'].push(this.props.href)
    event.preventDefault()
    return false
  }

  render() {
    return <a onClick={this.onClick} {...this.props}></a>
  }
}

export {
  Link,
}
