/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/cli-progress
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Xterm = require('@oawu/xterm')

const Print = (...strs) => process.stdout.write(`\r${strs.join('')}`)

const Progress = {
  lines: [],
  preLines: [],

  timer: null,
  finish: null,

  option: {
    space: 3, color: false,
    $: {
      title: {
        value: '',
        color: text => text
      },
      subtitle: {
        value: '',
        color: text => text
      },
      percent: {
        value: '',
        color: text => text
      },
      header: {
        value: '◉',
        color: text => Xterm.purple(text)
      },
      newline: {
        value: '↳',
        color: text => Xterm.purple(text).dim()
      },
      dash: {
        value: '─',
        color: text => Xterm.dim(text)
      },
      dot: {
        value: '…',
        color: text => Xterm.lightBlack(text).dim()
      },
      loading: {
        _value: '⠦⠧⠇⠏⠉⠙⠹⠸⠼⠴⠤⠦',
        _index: 0,
        _length: 12,
        get value() {
          return this._value[this._index++ % this._length]
        },
        set value(val) {
          this._index = 0
          this._length = val.length
          this._value = val
        },
        color: text => Xterm.yellow(text)
      },
      done: {
        value: '完成',
        color: text => Xterm.green(text)
      },
      fail: {
        value: '錯誤',
        color: text => Xterm.red(text)
      },
      index: {
        value: '',
        color: text => Xterm.dim(text)
      }
    },
  },

  percent: {
    index: null,
    total: null,
    text: '',
    toString(percent) {
      if (this.index !== null && this.total !== null) {
        percent = Math.ceil(this.index * 100) / this.total

        Progress.option.index = `(${this.index}/${this.total})`
        percent = parseInt(percent <= 100 ? percent >= 0 ? percent : 0 : 100, 10)
        Progress.option.percent = `${percent}%`

        return [
          Progress.option.index,
          Progress.option.percent,
          this.text
        ].filter(t => t !== '').join(` ${Progress.option.dash} `)
      }
      return this.text !== ''
        ? ` ${Progress.option.dash} ${this.text}`
        : ''
    },
    appendTo(lines) {
      const s = ' '.repeat(Progress.option.space)

      if (!lines.length) {
        return `${s}${this}`
      }

      const header = (index, space) => index
        ? `${space}  ${Progress.option.newline}`
        : Progress.option.header

      const title = (index, str) => index
        ? (Progress.option.subtitle = str, Progress.option.subtitle)
        : (Progress.option.title = str, Progress.option.title)

      const percent = index => index
        ? ''
        : this

      return [...lines].map(({ index, space, str }) => `\x1b[K${s}${header(index, space)} ${title(index, str)}${percent(index)}`).join("\n")
    }
  },

  clean() {
    if (!Progress.option.$.loading._index) {
      return ''
    }
    if (Progress.lines.length > 1) {
      return `\x1b[${Progress.lines.length - 1}A`
    }
    return "\r"
  },

  advance(val = 1) {
    Progress.percent.index += val
    if (Progress.percent.index > Progress.percent.total) {
      Progress.percent.index = Progress.percent.total
    }
    return Progress
  },

  title(...strs) {
    if (Progress.timer) {
      return Progress
    }

    Progress.option.$.loading._index = 0
    Progress.lines = []
    Progress.appendTitle(...strs)

    Progress.timer = setInterval(Progress._timer.bind(Progress, false), 85, Progress._timer(false))

    return Progress
  },
  _timer(fromStop) {
    if (!fromStop && Progress.finish) {
      return Progress.stop()
    }

    if (Progress.lines.length > 1) {
      Print(Progress.clean())
    }

    if (Progress.preLines.length) {
      Progress.lines = Progress.lines.concat(Progress.preLines).map(({ space, str }, index) => ({ space, str, index }))
      Progress.preLines = []
    }

    fromStop
      ? Print(`${Progress.percent.appendTo(Progress.lines)}\n`)
      : Print(`${Progress.percent.appendTo(Progress.lines)}${Progress.option.dot} ${Progress.option.loading} `)
  },
  appendTitle(...strs) {
    Progress.preLines = Progress.preLines.concat(strs.map(line => {
      const match = /(?<space>^\s*)(?<str>.*)/gm.exec(line)
      return match !== null ? { ...match.groups } : null
    })
      .filter(line => line !== null))

    return Progress
  },
  total(total) {
    Progress.percent.total = total
    Progress.percent.index = 0
    return Progress
  },
  stop() {
    if (Progress.timer === null) {
      return Progress
    }

    clearInterval(Progress.timer)

    Progress._timer(true)

    Progress.lines = []
    Progress.preLines = []

    Progress.percent.index = null
    Progress.percent.total = null
    Progress.percent.text = ''

    Progress.option.$.loading._index = 0

    Progress.finish()
    Progress.finish = null
    Progress.timer = null

    return Progress
  },
  done(message = '完成') {
    Progress.percent.index = Progress.percent.total
    Progress.option.done = message
    Progress.percent.text = Progress.option.done
    Progress.stop(Progress.finish = _ => { })
    return Progress
  },
  fail(message = '錯誤', ...errors) {
    Progress.option.fail = message === null || message === undefined
      ? '錯誤'
      : message
    Progress.percent.text = Progress.option.fail
    Progress.stop(Progress.finish = _ => Progress.error(...errors))
    return Progress
  },
  error(...errors) {
    if (errors.length <= 0) {
      return Progress
    }

    Print(
      `${Progress.option.color
        ? "\n 【錯誤訊息】\n".red
        : "\n 【錯誤訊息】\n"}${errors.map(
          error => `${' '.repeat(Progress.option.space)}${Progress.option.header} ${error instanceof Error
            ? error.stack
            : error}\n`).join('')}\n`)

    process.emit('SIGINT')
    return Progress
  },
}

Object.keys(Progress.option.$).forEach(key => Object.defineProperty(Progress.option, key, {
  set: val => Progress.option.$[key].value = val,
  get: _ => {
    const f = function () { }
    return f.toString = _ => Progress.option.color ? Progress.option.$[key].color(Progress.option.$[key].value).toString() : Progress.option.$[key].value, Object.defineProperty(f, 'color', { set: func => Progress.option.$[key].color = func }), f
  }
}))

Progress.Multi = function (text, percent = 0) {
  if (!(this instanceof Progress.Multi)) {
    return new Progress.Multi(text, percent)
  }

  this._text = text
  this._percent = percent
}

Object.defineProperty(Progress.Multi.prototype, 'text', {
  set(val) {
    this.refresh(this._text = val)
  }
})
Object.defineProperty(Progress.Multi.prototype, 'percent', {
  set(val) {
    this.refresh(this._percent = val)
  }
})
Progress.Multi.prototype.toString = function () {
  return `${this._percent < 100
    ? this._percent < 10
      ? `  ${this._percent}`
      : ` ${this._percent}`
    : `${this._percent}`}% | ${this._text}`
}
Progress.Multi.prototype.refresh = function () {
  if (this._index === null || this._index >= process.stdout.rows || Progress.Multi.lock) {
    return this
  }
  process.stdout.write(`\x1b[${this._index}A\r\x1b[K`)
  process.stdout.write(`${this}`)
  Progress.Multi.back()
  return this
}

Progress.Multi.save = _ => process.stdout.write('\x1b[s')
Progress.Multi.back = _ => process.stdout.write(`\x1b[u`)

Progress.Multi.lock = false
Progress.Multi.push = task => Progress.Multi.container.push(task)
Progress.Multi.container = {
  $: [],
  clean() {
    this.$ = []
    Progress.Multi.back()
    return this
  },
  push(task) {
    Progress.Multi.lock = true
    this.$.push(task)

    const len = this.$.length
    for (let i = 0; i < len; i++) {
      this.$[i]._index = len - i
    }

    process.stdout.write(`${task}\n`)
    Progress.Multi.save()
    Progress.Multi.lock = false
    return task
  }
}

module.exports = Progress
