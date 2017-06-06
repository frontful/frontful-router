import queryString from 'query-string'
import {Exception} from './Exception'
import {model, format} from 'frontful-model'
import {untracked, action} from 'mobx'

@model.config((context) => ({
  config: Object.assign({
    mapping: {},
    server: null
  }, context.config['frontful-router']),
}))
@model.format({
  path: null,
  prevPath: null,
  status: null,
  injectionRegister: format.map(),
})
class Model {
  constructor() {
    this['push'] = this.execute.bind(this, 'push')
    this['replace'] = this.execute.bind(this, 'replace')
    this['pop'] = this.execute.bind(this, 'pop')
  }

  @action
  executeActionsAndReturnInjections(query) {
    let executed = false

    const injections = Object.keys(query).reduce((injections, key) => {
      let setupQuery = this.queries[key]
      if (setupQuery && !setupQuery.isInjection) {
        if (!this.server) {
          setupQuery.responder(query[key])
        }
        executed = true
      }
      else if (setupQuery && setupQuery.isInjection) {
        injections[key] = query[key]
      }
      else if (key[0] === '_') {
        setupQuery = this.queries[key.replace('_', '')]
        if (setupQuery) {
          injections[key] = null
        }
      }
      return injections
    }, {})

    return executed || injections
  }

  mergeWithInjectionRegister(injections) {
    const injectionKeys = Object.keys(injections)
    const injectionRegisterKeys = this.injectionRegister.keys()

    let merged = injectionRegisterKeys.reduce((merged, injectionRegisterKey) => {
      if (injectionKeys.indexOf('_' + injectionRegisterKey) === -1) {
        merged[injectionRegisterKey] = this.injectionRegister.get(injectionRegisterKey)
      }
      return merged
    }, {})

    merged = injectionKeys.reduce((merged, injectionKey) => {
      if (injectionKey[0] !== '_') {
        merged[injectionKey] = injections[injectionKey]
      }
      return merged
    }, merged)

    return merged
  }

  execute(action, _path) {
    return this._execute(action, _path)
  }

  @action
  _execute(action, _path) {
    if (action === 'pop') {
      this.history.goBack()
      return
    }

    const array = _path.split(/[?#]/gi)
    let path = array[0] || this.path

    const query = array[1] ? queryString.parse('?' + array[1]) : {}

    let injections = this.executeActionsAndReturnInjections(query)

    if (typeof injections === 'boolean' && injections) {
      return
    }

    injections = this.mergeWithInjectionRegister(injections)

    const queryStr = queryString.stringify(injections)

    const oqs = queryString.stringify(this.injectionRegister.toJS())
    const nqs = queryStr

    if (action === 'push' && this.path === path && oqs !== nqs) {
      return this.execute('replace', _path)
    }

    let mappedPath = (this.config.mapping[path] || path) + (queryStr ? '?' + queryStr : '')

    path += queryStr ? '?' + queryStr : ''

    if (this.path !== path || oqs !== nqs) {
      if (!this.server) {
        if (mappedPath) {
          mappedPath = mappedPath.replace(window.location.origin, '')
        }
        this.history[action](mappedPath)
      }
      else {
        this.reload(mappedPath)
      }
    }
  }

  @action
  resolved() {
    this.status = 'resolved'
  }

  setupQueries(_queries) {
    untracked(() => {
      this.queries = Object.keys(_queries || {}).reduce((queries, key) => {
        const responder = _queries[key]
        const isInjection = Array.isArray(responder)
        queries[key] = {key, isInjection, responder}
        return queries
      }, {})

      if (this.server) {
        const inject = Object.keys(this.queries).reduce((inject, key) => {
          const query = this.server.req.query
          if (query.hasOwnProperty(key) && this.queries[key].isInjection) {
            inject[key] = query[key]
          }
          return inject
        }, {})

        this.injectionRegister.clear()
        this.injectionRegister.merge(inject)
      }
    })
  }

  reverseMatchIfAny(path) {
    return Object.keys(this.config.mapping).reduce((reverseMatch, key) => {
      if (!reverseMatch && this.config.mapping[key] === path) {
        return key
      }
      return reverseMatch
    }, null) || path
  }

  getPath() {
    const path = (!this.server ? window.location.pathname : (this.server.req.originalUrl || '').split(/[?#]/gi)[0]) || '/'
    return (this.reverseMatchIfAny(path) || '/').replace(/\/{2,}/gi, '/')
  }

  reload(path) {
    path = path || this.path
    if (path === this.path) {
      if (!this.server) {
        window.location.reload()
      }
      else {
        this.server.res.redirect(path)
      }
    }
    else {
      if (!this.server) {
        window.location.href = path
      }
      else {
        this.server.res.redirect(path)
      }
    }

    if (this.server) {
      throw new Exception.Reload()
    }
  }

  @action
  initialize() {
    this.path = this.getPath()
    this.prevPath = '/'
    this.status = 'resolved'

    if (!this.server) {
      window._loch = (aTagElement) => {
        const href = aTagElement.getAttribute('href')
        const target = aTagElement.getAttribute('target')

        if (target !== '_blank') {
          this.push(href)
          return false
        }

        return true
      }

      const createHistory = require('history/createBrowserHistory')
      this.history = createHistory()
      this.history.listen(action((location) => {
        const query = queryString.parse(location.search)

        this.injectionRegister.clear()
        this.injectionRegister.merge(query)

        this.prevPath = this.path
        this.status = 'resolving'

        this.path = this.reverseMatchIfAny(location.pathname)
      }))
    }
  }
}

export {
  Model,
}
