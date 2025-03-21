/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/cli-progress
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { Multi } = require('./index.js')

const tasks = [
  "task 1",
  "task 2",
  "task 3",
  "task 4",
  "task 5",
]

Multi.save()
const multis = []
for (const task of tasks) {
  const multi = Multi(task)
  Multi.push(multi)
  multis.push(multi)
}

setTimeout(_ => multis[1].percent = 10, 1000)
setTimeout(_ => multis[0].percent = 5, 2000)
setTimeout(_ => multis[3].percent = 8, 1100)
setTimeout(_ => multis[1].percent = 30, 2200)
setTimeout(_ => multis[2].percent = 1, 1100)
setTimeout(_ => multis[0].percent = 30, 3000)
setTimeout(_ => multis[1].percent = 50, 3100)
setTimeout(_ => multis[3].percent = 63, 1500)
setTimeout(_ => multis[4].percent = 32, 2000)
setTimeout(_ => multis[1].percent = 70, 3500)
setTimeout(_ => multis[2].percent = 19, 2100)
setTimeout(_ => multis[0].percent = 45, 4000)
setTimeout(_ => multis[3].percent = 90, 3100)
setTimeout(_ => multis[4].percent = 66, 3000)
setTimeout(_ => multis[4].percent = 82, 4000)
setTimeout(_ => multis[1].percent = 90, 4000)
setTimeout(_ => multis[0].percent = 75, 5000)
setTimeout(_ => multis[2].percent = 49, 3100)
setTimeout(_ => multis[3].percent = 95, 5200)
setTimeout(_ => multis[0].percent = 100, 6000)
setTimeout(_ => multis[2].percent = 75, 4100)
setTimeout(_ => multis[4].percent = 100, 5000)
setTimeout(_ => multis[3].percent = 100, 5500)
setTimeout(_ => multis[1].percent = 100, 5000)
setTimeout(_ => multis[2].percent = 100, 5100)

setTimeout(_ => multis[2].text = 'task 3-change', 1100)
setTimeout(_ => multis[0].text = 'task 1-change', 2200)
setTimeout(_ => multis[1].text = 'task 2-change', 3300)
setTimeout(_ => multis[4].text = 'task 5-change', 4400)
setTimeout(_ => multis[3].text = 'task 4-change', 5500)

setTimeout(_ => {
  Multi.back()
  console.error('ok');
}, 7000)
