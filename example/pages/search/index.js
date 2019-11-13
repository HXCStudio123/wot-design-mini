Page({
  data: {
    value: ''
  },
  focus () {
    console.log('聚焦')
  },
  blur () {
    console.log('失焦')
  },
  search (e) {
    console.log('搜索', e)
  },
  clear () {
    console.log('重置')
  },
  cancel () {
    console.log('取消')
  },
  change (e) {
    console.log('输入', e)
  },
  onReady () {
    setTimeout(() => {
      this.setData({ value: '初始文案' })
    }, 1000)
  }
})