import {Component} from './Component.jsx'
import {Link} from './Link.jsx'
import {Model} from './Model'
import {Navigator} from './Navigator.jsx'
import {Branch} from './Branch.jsx'
import {Placeholder} from './Placeholder.jsx'
import {Exception} from './Exception'

const Router = Object.assign(Component, {
  Branch,
  Component,
  Exception,
  Link,
  Model,
  Navigator,
  Placeholder,
})

export {
  Branch,
  Component,
  Exception,
  Link,
  Model,
  Navigator,
  Placeholder,
  Router,
}
