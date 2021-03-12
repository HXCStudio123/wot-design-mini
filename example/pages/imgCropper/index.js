Page({
  data: {
    src: 'https://img13.360buyimg.com/img/jfs/t1/112383/24/3812/492876/5eaa67eaE26b243c5/0380f68ca36fe050.png',
    imgSrc: '',
    show: false,
    changeX: 0,
    changeY: 0
  },
  onLoad () {
    // 创建canvas绘图上下文
    this.ctx = jd.createCanvasContext('myCanvas')
    // fillRect(x, y, width, height)
    // 移动的是canvas相对图片的距离  图片相对于canvas 向上向左移动了50
    this.ctx.translate(0, 0)
    // this.ctx.rotate(90 * Math.PI / 180)
    // drawImage 的 旋转是根据以当前角度为坐标原点xy轴，并在x y轴上移动
    this.ctx.drawImage(this.data.src, -200, -200, 400, 400)
    this.ctx.draw()
  },
  changeX () {
    this.setData({
      changeY: this.data.changeY - 5
    })
    // this.ctx.rotate(45 * Math.PI / 180)
    this.ctx.translate(-50, -50)

    this.ctx.rotate(this.data.changeY * Math.PI / 180)
    this.ctx.drawImage(this.data.imgSrc, 0, 0, 400, 400)
    this.ctx.draw()
  },
  changeY () {
    this.setData({
      changeY: this.data.changeY + 10
    })
    this.ctx.translate(-50, -50)
    this.ctx.rotate(45 * Math.PI / 180)
    // drawImage 的 旋转是根据以当前角度为坐标原点xy轴，并在x y轴上移动
    this.ctx.drawImage(this.data.imgSrc, this.data.changeY, -200, 400, 400)
    this.ctx.draw()
  },
  test () {
    // 创建canvas绘图上下文
    this.ctx = jd.createCanvasContext('myCanvas')
    // fillRect(x, y, width, height)
    // 移动的是canvas相对图片的距离  图片相对于canvas 向上向左移动了50
    this.ctx.translate(0, 0)
    // this.ctx.rotate(90 * Math.PI / 180)
    // drawImage 的 旋转是根据以当前角度为坐标原点xy轴，并在x y轴上移动
    this.ctx.drawImage(this.data.imgSrc, -200, -200, 400, 400)
    this.ctx.draw()
    const that = this
    jd.canvasToTempFilePath({
      width: 400,
      height: 400,
      destWidth: 400,
      destHeight: 400,
      canvasId: 'myCanvas',
      success (res) {
        console.log('成功', res)
        that.setData({
          src: res.tempFilePath,
          imgSrc: res.tempFilePath
        })
      }
    })
  },
  upload () {
    const that = this

    this.wdcropper = this.selectComponent('#wd-img-cropper')
    jd.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        jd.showLoading({
          title: '加载中'
        })
        const tempFilePaths = res.tempFilePaths[0]
        // 重置图片角度、缩放、位置
        that.wdcropper.resetImg()
        jd.hideLoading()
        that.setData({
          show: true,
          src: tempFilePaths,
          imgSrc: tempFilePaths
        })
      }
    })
  },
  confirm (event) {
    const { url } = event.detail
    console.log('345678', event)
    this.setData({
      show: false,
      src: url,
      imgSrc: url
    })
  },
  cropperload (e) {
    console.log('cropper初始化完成')
  },
  preview () {
    jd.previewImage({
      current: this.data.imgSrc, // 当前显示图片的http链接
      urls: [this.data.imgSrc] // 需要预览的图片http链接列表
    })
  }
})