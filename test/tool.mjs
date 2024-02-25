export function genRandomNumArr(n = 10) {
  return new Array(n).fill(0).map(d => {
    return ~~(Math.random() * 100)
  })
}

export function testFunc(func, times = 10) {
  console.log(`---------------【test ${func.name}】--------------`)
  for(let i=0; i<times; i++) {
    console.log(`**************【test ${i+1}】**************`)
    const arr = genRandomNumArr(10)
    const nativeSorted = [...arr].sort((a, b) => a - b)
    console.log(arr.toString())
    func(arr)
    console.log('nativeSorted:', nativeSorted.toString())
    console.log('currentSorted:', arr.toString())
    console.log(`【结果】${arr.toString() === nativeSorted.toString()}`)
    console.log(`**************【test ${i+1}】**************`)
    console.log(' ')
  }
}