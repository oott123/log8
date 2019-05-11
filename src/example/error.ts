import { log } from '../log'

function foo() {
  log.error(new Error('Error here!'))
}

function bar() {
  log.info('show me the error')
  foo()
}

function foobar() {
  log.warn('WARNING: Error!')
  bar()
}

foobar()
