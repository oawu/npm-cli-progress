/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/cli-progress
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Progress = require('./index.js')
const Xterm = require('@oawu/xterm')

Progress.title('標題', '副標題')
Progress.total(3)

setTimeout(_ => {
  Progress.advance
  
  setTimeout(_ => {
    Progress.advance

    setTimeout(_ => {
      Progress.done()
    }, 1000)
  }, 1000)
}, 1000)

Progress.option.color = true // 使用顏色
Progress.option.done.color = text => Xterm.lightBlue(text).dim() // done 時顯示為細體藍色
Progress.option.fail.color = Xterm.red // fail 時為紅色
Progress.option.header = '➜' // 主標題符號改為 `➜`
Progress.option.header.color = Xterm.lightGray // 主標題符號顏色改為亮灰色

// 開始執行
Progress.title('標題', '副標題')
Progress.total(3)

setTimeout(_ => {
  Progress.advance
  
  setTimeout(_ => {
    Progress.advance

    setTimeout(_ => {
      Progress.done()
    }, 1000)
  }, 1000)
}, 1000)

