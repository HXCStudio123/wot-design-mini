Page({
  data: {
    src: '',
    width: 250, // 宽度
    height: 250, // 高度
    show: true,
    showExm: false,
    showCus: false
  },
  onLoad () {
    // 创建canvas绘图上下文
    const ctx = jd.createCanvasContext('myCanvas')
    ctx.setFillStyle('red')
    // fillRect(x, y, width, height)
    ctx.fillRect(20, 20, 150, 75)
    ctx.draw()
  },
  test () {
    const that = this
    const ppi = jd.getSystemInfoSync().pixelRatio
    console.log('ppi: ', ppi)
    jd.canvasToTempFilePath({
      x: 20,
      y: 20,
      width: 150,
      height: 75,
      destWidth: 70 * ppi,
      destHeight: 70 * ppi,
      canvasId: 'myCanvas',
      success (res) {
        console.log('成功', res)
        that.setData({
          src: res.tempFilePath
        })
        // jd.previewImage({
        //   current: res.tempFilePath, // 当前显示图片的http链接
        //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
        // })
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
        that.setData({
          src: tempFilePaths
        })
      }
    })
  },
  rotate () {
    // 在用户旋转的基础上旋转90°
    this.cropper = this.selectComponent('#image-cropper')
    this.cropper.setAngle(this.cropper.data.angle += 90)
  },
  cropperload (e) {
    console.log('cropper初始化完成')
  },
  loadimage (e) {
    console.log('图片加载完成', e.detail)
    jd.hideLoading()
    this.cropper = this.selectComponent('#image-cropper')
    // 重置图片角度、缩放、位置
    this.cropper.imgReset()
  },
  clickcut (e) {
    console.log(e.detail)
    // 点击裁剪框阅览图片
    jd.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  test1 () {
    this.setData({
      showExm: true
    })
    // 获取到image-cropper实例
    this.cropper = this.selectComponent('#image-cropper')
    // 开始裁剪
    this.setData({
      src: 'https://img13.360buyimg.com/venderadsman/jfs/t1/156393/5/10597/52828/60330904E8e3b7ffc/d6bbe56bcdc35e0d.jpg'
    })
  },
  test2 () {
    this.upload()
    jd.hideLoading()
    // this.setData({
    //   src: 'https://img13.360buyimg.com/venderadsman/jfs/t1/156393/5/10597/52828/60330904E8e3b7ffc/d6bbe56bcdc35e0d.jpg'
    // })
    this.setData({
      showCus: true
    })
  },
  test3 () {
    // //开始裁剪
    this.setData({
      src: 'https://img13.360buyimg.com/venderadsman/jfs/t1/156393/5/10597/52828/60330904E8e3b7ffc/d6bbe56bcdc35e0d.jpg'
    })
  }
})