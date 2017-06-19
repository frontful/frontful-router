import {Exceptions as ResolverExceptions} from 'frontful-resolver'

class Reload extends ResolverExceptions.Cancel {}

const Exceptions = {
  Reload,
}

export {
  Exceptions,
}
