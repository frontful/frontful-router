import ExtendableError from 'es6-error'

class NotFound extends ExtendableError {}
class Reload extends ExtendableError {}

const Exception = {
  NotFound,
  Reload,
}

export {
  Exception,
}
