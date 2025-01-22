# OA's Node.js Cli Progress

OA 的終端機進度工具 🚀


## 說明
終端機上使用 Node.js「進度工具」

![@oawu/cli-progress](Cli-Progress.png)

## 安裝

```shell
npm install @oawu/cli-progress
```

## 使用

引入 `require('@oawu/cli-progress')` 即可使用，如下範例：

```javascript

  const Progress = require('@oawu/cli-progress')
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

```

## 設定

* 使用色彩器(@oawu/xterm)，於一開始使用 `Progress.option.color = true` 即可，預設為 `false`

* 設定左邊空格基礎 `Progress.option.space = 2`，預設為 `3`
* 設定讀取中
  * 顯示：於一開始使用 `Progress.option.loading = "⠦⠧⠇⠏⠉⠙⠹⠸⠼⠴⠤⠦"`，預設為 `⠦⠧⠇⠏⠉⠙⠹⠸⠼⠴⠤⠦`
  * 顏色：於一開始使用 `Progress.option.loading.color = Xterm.red`，預設為 `Xterm.yellow`

* 設定主標題顏色，於一開始使用 `Progress.option.title.color = Xterm.red`，預設為 `Xterm.gray`
* 設定小標題顏色，於一開始使用 `Progress.option.subtitle.color = Xterm.red`，預設為 `Xterm.gray`
* 設定百分比顏色，於一開始使用 `Progress.option.percent.color = Xterm.red`，預設為 `Xterm.gray`
* 設定數值顏色，於一開始使用 `Progress.option.index.color = Xterm.red`，預設為 `Xterm.dim`
* 設定 done 顏色，於一開始使用 `Progress.option.done.color = Xterm.red`，預設為 `Xterm.green`
* 設定 fail 顏色，於一開始使用 `Progress.option.fail.color = Xterm.red`，預設為 `Xterm.red`

* 設定主標題符號
  * 顯示：於一開始使用 `Progress.option.header = "！"`，預設為 `◉`
  * 顏色：於一開始使用 `Progress.option.header.color = Xterm.red`，預設為 `Xterm.purple`

* 設定小標題符號
  * 顯示：於一開始使用 `Progress.option.newline = "！"`，預設為 `↳`
  * 顏色：於一開始使用 `Progress.option.newline.color = Xterm.red`，預設為 `Xterm.dim.purple`

* 設定分隔符號
  * 顯示：於一開始使用 `Progress.option.dash = "！"`，預設為 `─`
  * 顏色：於一開始使用 `Progress.option.dash.color = Xterm.red`，預設為 `Xterm.dim`

* 設定點點點符號
  * 顯示：於一開始使用 `Progress.option.dot = "！"`，預設為 `…`
  * 顏色：於一開始使用 `Progress.option.dot.color = Xterm.red`，預設為 `Xterm.dim.lightBlack`

以下為基本設定範例與執行結果：

```javascript

  const Progress = require('@oawu/cli-progress')
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
```

執行中：

![@oawu/cli-progress](01.png)

完成：

![@oawu/cli-progress](02.png)



## Multi 功能

這是可以多行顯示進度功能，如下範例會依序顯示不同任務完成的進度。

```javascript

  const { Multi } = require('@oawu/cli-progress')

  const tasks = [
    "task 1",
    "task 2",
    "task 3",
    "task 4",
    "task 5",
  ]

  // 儲存游標位置
  Multi.save()
  const multis = []
  for (const task of tasks) {
    const multi = Multi(task)
    Multi.push(multi)
    multis.push(multi)
  }

  // 模擬不同任務的進度轉換
  setTimeout(_ => multis[1].percent =  10, 1000)
  setTimeout(_ => multis[0].percent =   5, 2000)
  setTimeout(_ => multis[3].percent =   8, 1100)
  setTimeout(_ => multis[1].percent =  30, 2200)
  setTimeout(_ => multis[2].percent =   1, 1100)
  setTimeout(_ => multis[0].percent =  30, 3000)
  setTimeout(_ => multis[1].percent =  50, 3100)
  setTimeout(_ => multis[3].percent =  63, 1500)
  setTimeout(_ => multis[4].percent =  32, 2000)
  setTimeout(_ => multis[1].percent =  70, 3500)
  setTimeout(_ => multis[2].percent =  19, 2100)
  setTimeout(_ => multis[0].percent =  45, 4000)
  setTimeout(_ => multis[3].percent =  90, 3100)
  setTimeout(_ => multis[4].percent =  66, 3000)
  setTimeout(_ => multis[4].percent =  82, 4000)
  setTimeout(_ => multis[1].percent =  90, 4000)
  setTimeout(_ => multis[0].percent =  75, 5000)
  setTimeout(_ => multis[2].percent =  49, 3100)
  setTimeout(_ => multis[3].percent =  95, 5200)
  setTimeout(_ => multis[0].percent = 100, 6000)
  setTimeout(_ => multis[2].percent =  75, 4100)
  setTimeout(_ => multis[4].percent = 100, 5000)
  setTimeout(_ => multis[3].percent = 100, 5500)
  setTimeout(_ => multis[1].percent = 100, 5000)
  setTimeout(_ => multis[2].percent = 100, 5100)

  // 更新文字
  setTimeout(_ => multis[2].text = 'task 3-change', 1100)
  setTimeout(_ => multis[0].text = 'task 1-change', 2200)
  setTimeout(_ => multis[1].text = 'task 2-change', 3300)
  setTimeout(_ => multis[4].text = 'task 5-change', 4400)
  setTimeout(_ => multis[3].text = 'task 4-change', 5500)

  // 完成
  setTimeout(_ => {
    // 恢復游標位置
    Multi.back()
    console.error('ok');
  }, 7000)
```
