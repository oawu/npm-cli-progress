/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/cli-progress
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Xterm = require('@oawu/xterm')

const Progress = {
  lines: [],
  preLines: [],

  timer: null,
  finish: null,

  option: {
    space: 3, color: false,
    $: {
      title: { value: '', color: text => text },
      subtitle: { value: '', color: text => text },
      percent: { value: '', color: text => text },
      header: { value: '◉', color: text => Xterm.purple(text) },
      newline: { value: '↳', color: text => Xterm.purple(text).dim() },
      dash: { value: '─', color: text => Xterm.dim(text) },
      dot: { value: '…', color: text => Xterm.lightBlack(text).dim() },
      loading: { _value: '⠦⠧⠇⠏⠉⠙⠹⠸⠼⠴⠤⠦', _index: 0, _length: 12, get value () { return this._value[this._index++ % this._length] }, set value (val) { return this._index = 0, this._length = val.length, this._value = val }, color: text => Xterm.yellow(text) },
      done: { value: '完成', color: text => Xterm.green(text) },
      fail: { value: '錯誤', color: text => Xterm.red(text) },
      index: { value: '', color: text => Xterm.dim(text) }
    },
  },

  percent: {
    index: null, total: null, text: '',
    toString (percent) {
      if (this.index !== null && this.total !== null) {
        percent = Math.ceil(this.index * 100) / this.total
        Progress.option.index = `(${this.index}/${this.total})`
        return [
          Progress.option.index,
          (Progress.option.percent = `${parseInt(percent <= 100
            ? percent >= 0
              ? percent
              : 0
            : 100, 10)}%`),
          this.text].filter(t => t !== '').join(` ${Progress.option.dash} `)
      }
      return this.text !== ''
        ? ` ${Progress.option.dash} ${this.text}`
        : ''
    },
    appendTo(lines) {
      const s = ' '.repeat(Progress.option.space)
      
      if (!lines.length)
        return `${s}${this}`

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

  set advance (val) {
    Progress.percent.index += val
    if (Progress.percent.index > Progress.percent.total)
      Progress.percent.index = Progress.percent.total
    return Progress
  },
  get advance () {
    Progress.advance = 1
    return Progress
  },
  get clean () {
    return Progress.option.$.loading._index
      ? Progress.lines.length > 1
        ? `\x1b[${Progress.lines.length - 1}A`
        : "\r"
      : ''
  },

  print: (...strs) => process.stdout.write(`\r${strs.join('')}`),
  
  title (...strs) {
    if (Progress.timer) return Progress

    Progress.option.$.loading._index = 0
    Progress.lines = []
    Progress.appendTitle(...strs)

    const timer = _ => {
      if (Progress.finish)
        return Progress.stop()

      if (Progress.lines.length > 1)
        Progress.print(Progress.clean)

      if (Progress.preLines.length) {
        Progress.lines = Progress.lines
          .concat(Progress.preLines)
          .map(({ space, str }, index) => ({ space, str, index }))
        Progress.preLines = []
      }

      Progress.print(`${Progress.percent.appendTo(Progress.lines)}${Progress.option.dot} ${Progress.option.loading} `)
    }

    Progress.timer = setInterval(timer, 85, timer())

    return Progress
  },
  appendTitle(...strs) {
    Progress.preLines = strs.map(line => {
      const match = /(?<space>^\s*)(?<str>.*)/gm.exec(line)
      return match !== null ? { ...match.groups } : null
    })
    .filter(line => line !== null)

    return Progress
  },
  total (total) {
    Progress.percent.total = total
    Progress.percent.index = 0
    return Progress
  },
  stop () {
    if (Progress.timer === null)
      return Progress
    
    Progress.print(`${Progress.clean}${Progress.percent.appendTo(Progress.lines)}\n`)

    clearInterval(Progress.timer)
    
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
  done (message = '完成') {
    Progress.percent.index = Progress.percent.total
    Progress.option.done = message
    Progress.percent.text = Progress.option.done
    Progress.stop(Progress.finish = _ => {})
    return Progress
  },
  fail (message = '錯誤', ...errors) {
    Progress.option.fail = message === null || message === undefined
      ? '錯誤'
      : message
    Progress.percent.text = Progress.option.fail
    Progress.stop(Progress.finish = _ => Progress.error(...errors))
    return Progress
  },
  error (...errors) {
    errors.length && Progress.print(
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
      const f = function() {}
      return f.toString = _ => Progress.option.color ? Progress.option.$[key].color(Progress.option.$[key].value).toString() : Progress.option.$[key].value, Object.defineProperty(f, 'color', { set: func => Progress.option.$[key].color = func }), f
    }
  }))

module.exports = Progress
