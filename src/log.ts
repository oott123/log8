import chalk from 'chalk'
import { format as formatDate } from 'date-fns'
import { formatStackTrace } from 'jest-message-util'
import { inspect } from 'util'

const transport: Array<(str: string, level: string) => void> = [
  x => console.log(x)
]

function rawLog(level: string, ...args: any[]) {
  const logBuilder = [
    chalk.gray(`[${formatDate(new Date(), 'MM-DD HH:mm:ss.SSS')}]`)
  ]
  switch (level) {
    case 'debug':
      logBuilder.push(chalk.gray('DEBUG'))
      break
    case 'info':
      logBuilder.push(chalk.green('INFO '))
      break
    case 'warn':
      logBuilder.push(chalk.yellow('WARN '))
      break
    case 'error':
      logBuilder.push(chalk.red('ERROR'))
      break
    default:
      logBuilder.push(level)
  }
  for (const arg of args) {
    if (typeof arg === 'string') {
      logBuilder.push(arg)
    } else if (arg instanceof Error) {
      logBuilder.push(
        arg.message +
          formatStackTrace(
            arg.stack,
            { rootDir: process.cwd(), testMatch: [] },
            { noStackTrace: false }
          )
      )
    } else {
      logBuilder.push(
        inspect(arg, {
          showHidden: true,
          depth: 2,
          colors: chalk.enabled
        })
      )
    }
  }
  // console.log(logBuilder.join(' '))
  // process.stderr.write(chalk.reset() + logBuilder.join(' ') + '\n')
  const str = logBuilder.join(' ')
  for (const t of transport) {
    t(str, level)
  }
}

export const log = {
  debug: rawLog.bind(this, 'debug'),
  info: rawLog.bind(this, 'info'),
  warn: rawLog.bind(this, 'warn'),
  error: rawLog.bind(this, 'error'),
  raw: rawLog,
  transport
}
