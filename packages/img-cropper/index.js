import VueComponent from '../common/component'
// 延时动画设置
let IS_TOUCH_END = false
// 延时动画设置
let CHANGE_TIME = null
// 移动节流
let MOVE_THROTTLE = null
// 节流标志
let MOVE_THROTTLE_FLAG = true

VueComponent({
  externalClasses: [''],
  props: {
    show: {
      type: Boolean,
      value: false,
      observer (val) {
        if (val) {
          this.data.info = jd.getSystemInfoSync()
          this.data.cutSize = this.data.info.windowWidth - this.data.offset * 2
          this.setData({
            cutWidth: this.data.cutSize,
            cutHeight: this.data.cutSize,
            cutTop: (this.data.info.windowHeight - this.data.cutSize) * 0.5,
            cutLeft: this.data.offset,
            canvasHeight: this.data.cutSize,
            canvasWidth: this.data.cutSize
          })
          this.initCanvas()
          this.data.imgSrc && this.loadImg()
          // 设置图片<裁剪框尺寸
          this.computeCutSize()
        } else {
          this.resetImg()
        }
      }
    },
    offset: {
      type: Number,
      value: 20
    },
    // 图片源路径
    imgSrc: {
      type: null,
      value: '',
      observer (val) {
        val && this.loadImg()
      }
    },
    // 最大缩放
    maxScale: {
      type: Number,
      value: 3
    },
    // 最小缩放
    minScale: {
      type: Number,
      value: 0.5
    },
    /** Watching Data **/
    // 旋转角度
    imgAngle: {
      type: Number,
      value: 0,
      observer (val) {
        if (val % 90) {
          this.setData({
            angle: Math.round(val / 90) * 90
          })
        }
      }
    },
    // 是否开启动画
    isAnimation: {
      type: Boolean,
      value: false,
      observer (val) {
        // 开启过渡300毫秒之后自动关闭
        clearTimeout(CHANGE_TIME)
        if (val) {
          CHANGE_TIME = setTimeout(() => {
            this.setData({ isAnimation: false })
          }, 300)
        }
      }
    }
  },

  data: {
    // 裁剪框的宽高
    cutWidth: 0,
    cutHeight: 0,
    // 裁剪框的距顶距左
    cutLeft: 0,
    cutTop: 0,
    // canvas最终成像宽高
    canvasWidth: '',
    canvasHeight: '',
    // 当前缩放大小
    imgScale: 1,
    // 图片宽高
    imgWidth: null,
    imgHeight: null,
    // 图片中心轴点距左的距离
    imgLeft: jd.getSystemInfoSync().windowWidth / 2,
    imgTop: jd.getSystemInfoSync().windowHeight / 2,
    // 是否高亮背景(拖动时高亮 拖动结束添加阴影)
    isHighlight: false,
    // 记录移动中的双指位置 [0][1]分别代表两根手指
    movingPosRecord: [{
      x: '',
      y: ''
    }, {
      x: '',
      y: ''
    }],
    // 双指缩放时 两个坐标点斜边长度
    fingerDistance: ''
  },

  methods: {
    /**
     * @description 对外暴露：获取截取后图片
     */
    getImg () {
      // 外部获取图片
    },
    /**
     * @description 对外暴露：控制旋转角度
     * @param {Number} angle 角度
     */
    setRoate (angle) {
      if (!angle) return
      this.setData({
        isAnimation: true,
        imgAngle: angle
      })
      // 设置旋转后需要判定旋转后宽高是否不符合贴边的标准
      this.detectImgPosIsEdge()
    },
    /**
     * @description 初始化图片的大小和角度以及距离
     */
    resetImg () {
      const { windowHeight, windowWidth } = jd.getSystemInfoSync()
      const { imgScale, imgAngle } = this.data
      this.setData({
        imgScale: 1 || imgScale,
        imgAngle: 0 || imgAngle,
        imgLeft: windowWidth / 2,
        imgTop: windowHeight / 2
      })
    },

    /**
     * @description 加载图片资源文件，并初始化裁剪框内图片信息
     */
    loadImg () {
      const { imgSrc } = this.data
      if (!imgSrc) return
      jd.getImageInfo({
        src: imgSrc,
        success: (res) => {
          // 存储img图片信息
          this.data.imgInfo = res
          // 计算最后图片尺寸
          this.computeImgSize()
          // 初始化尺寸
          this.resetImg()
          // 绘制canvas
        },
        fail: () => {
          this.setData({ imgSrc: '' })
        }
      })
    },

    /**
     * @description 设置图片尺寸，使其有一边小于裁剪框尺寸
     * 1、图片宽或高 小于裁剪框，自动放大至一边与高平齐
     * 2、图片宽或高 大于裁剪框，自动缩小至一边与高平齐
     */
    computeImgSize () {
      let { imgWidth, imgHeight, imgInfo, cutWidth, cutHeight } = this.data
      // 没有设置宽高，写入图片的真实宽高
      imgWidth = imgInfo.width
      imgHeight = imgInfo.height
      /**
       * 设 a = imgWidth; b = imgHeight; x = cutWidth; y = cutHeight
       * 共有三种宽高比：1、a/b > x/y 2、a/b < x/y 3、a/b = x/y
       * 1、已知 b = y => a = a/b*y
       * 2、已知 a = x => b = b/a*x
       * 3、可用上方任意公式
       */
      if (imgWidth / imgHeight > cutWidth / cutHeight) {
        imgHeight = cutHeight
        imgWidth = imgInfo.width / imgInfo.height * cutHeight
      } else {
        imgWidth = cutWidth
        imgHeight = imgInfo.height / imgInfo.width * cutWidth
      }
      this.setData({
        imgWidth,
        imgHeight
      })
    },

    /**
     * @description 设置裁剪窗口大小
     */
    computeCutSize () {
    },

    /**
     * @description 初始化裁剪框内的图片
     */
    initImgSize () {
      const { INIT_IMGWIDTH, INIT_IMGHEIGHT } = this.data
      if (INIT_IMGWIDTH && typeof INIT_IMGWIDTH === 'string' && this.data.INIT_IMGWIDTH.indexOf('%') !== -1) {
        const width = INIT_IMGWIDTH.replace('%', '')
        this.data.INIT_IMGWIDTH = this.data.imgWidth = this.data.info.windowWidth / 100 * width
      }
      if (INIT_IMGHEIGHT && typeof INIT_IMGHEIGHT === 'string' && this.data.INIT_IMGHEIGHT.indexOf('%') !== -1) {
        const height = INIT_IMGHEIGHT.replace('%', '')
        this.data.INIT_IMGHEIGHT = this.data.imgHeight = this.data.info.windowHeight / 100 * height
      }
    },

    /**
     * @description canvas 初始化
     */
    initCanvas () {
      if (!this.data.ctx) {
        this.data.ctx = jd.createCanvasContext('wd-img-cropper-canvas', this)
      }
    },
    /**
     * @description 图片拖动边缘检测：检测移动或缩放时 是否触碰到图片边缘位置
     */
    detectImgPosIsEdge (scale) {
      const {
        cutLeft,
        cutTop,
        cutWidth,
        cutHeight,
        imgAngle
      } = this.data
      const imgScale = scale || this.data.imgScale
      let { imgWidth, imgHeight, imgLeft, imgTop } = this.data
      // 翻转后宽高切换
      if (imgAngle / 90 % 2) {
        imgWidth = this.data.imgHeight
        imgHeight = this.data.imgWidth
      }
      // 左
      imgLeft = imgWidth * imgScale / 2 + cutLeft >= imgLeft ? imgLeft : imgWidth * imgScale / 2 + cutLeft
      // 右
      imgLeft = cutLeft + cutWidth - imgWidth * imgScale / 2 <= imgLeft ? imgLeft : cutLeft + cutWidth - imgWidth * imgScale / 2
      // 上
      imgTop = imgHeight * imgScale / 2 + cutTop >= imgTop ? imgTop : imgHeight * imgScale / 2 + cutTop
      // 下
      imgTop = cutTop + cutHeight - imgHeight * imgScale / 2 <= imgTop ? imgTop : cutTop + cutHeight - imgHeight * imgScale / 2

      this.setData({
        imgLeft,
        imgTop,
        imgScale
      })
    },
    /**
     * @description 缩放边缘检测：检测移动或缩放时 是否触碰到图片边缘位置
     */
    detectImgScaleIsEdge () {
      const { cutHeight, cutWidth, imgAngle } = this.data
      let { imgWidth, imgHeight, imgScale } = this.data
      // 翻转后宽高切换
      if (imgAngle / 90 % 2) {
        imgWidth = this.data.imgHeight
        imgHeight = this.data.imgWidth
      }
      if (imgWidth * imgScale < cutWidth) {
        imgScale = cutWidth / imgWidth
      }
      if (imgHeight * imgScale < cutHeight) {
        imgScale = cutHeight / imgHeight
      }
      this.detectImgPosIsEdge(imgScale)
    },
    /**
     * @description 节流
     */
    throttle () {
      if (this.data.info.platform === 'android') {
        clearTimeout(MOVE_THROTTLE)
        MOVE_THROTTLE = setTimeout(() => {
          MOVE_THROTTLE_FLAG = true
        }, 1000 / 40)
        return MOVE_THROTTLE_FLAG
      } else {
        !MOVE_THROTTLE_FLAG && (MOVE_THROTTLE_FLAG = true)
      }
    },
    /**
     * @description 移动中的通用处理
     */
    setMoving () {

    },
    /**
     * @description 移动结束的通用处理
     */
    setMoveEnd () {

    },
    /**
     * @description {裁剪区} 开始拖动
     */
    handleCutTouchStart () {
      console.log('{裁剪区} 开始拖动')
    },
    /**
     * @description {裁剪区} 拖动中
     */
    handleCutTouchMove () {
      // console.log('{裁剪区} 拖动中')
    },
    /**
     * @description {裁剪区} 拖动结束
     */
    handleCutTouchEnd () {
      // console.log('{裁剪区} 拖动结束')
    },
    /**
     * @description {图片区} 开始拖动
     */
    handleImgTouchStart (event) {
      // 如果处于在拖动中，背景为淡色展示全部，拖动结束则为 0.85 透明度
      IS_TOUCH_END = false
      this.setData({ isHighlight: true })
      if (event.touches.length === 1) {
        // 单指拖动
        this.data.movingPosRecord[0] = {
          x: (event.touches[0].clientX - this.data.imgLeft),
          y: (event.touches[0].clientY - this.data.imgTop)
        }
      } else {
        // 以两指为坐标点 做直角三角形 a2 + b2 = c2
        const width = Math.abs(event.touches[1].clientX - event.touches[0].clientX)
        const height = Math.abs(event.touches[1].clientY - event.touches[0].clientY)
        this.data.fingerDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
      }
    },
    /**
     * @description {图片区} 拖动中
     */
    handleImgTouchMove (event) {
      if (IS_TOUCH_END || !MOVE_THROTTLE_FLAG) return
      // 节流
      this.throttle()
      // 通用移动事件
      this.setMoving()
      if (event.touches.length === 1) {
        // 单指拖动
        const { x, y } = this.data.movingPosRecord[0]
        const left = event.touches[0].clientX - x
        const top = event.touches[0].clientY - y
        this.data.imgLeft = left
        this.data.imgTop = top
        this.detectImgPosIsEdge()
        this.setData({
          imgLeft: this.data.imgLeft,
          imgTop: this.data.imgTop
        })
      } else {
        // 以两指为坐标点 做直角三角形 a2 + b2 = c2
        const width = Math.abs(event.touches[1].clientX - event.touches[0].clientX)
        const height = Math.abs(event.touches[1].clientY - event.touches[0].clientY)
        const hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
        const scale = this.data.imgScale * (hypotenuse / this.data.fingerDistance)
        this.data.imgScale = Math.min(scale, this.data.maxScale)
        this.detectImgScaleIsEdge()
        this.data.fingerDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
      }
    },
    /**
     * @description {图片区} 拖动结束
     */
    handleImgTouchEnd () {
      IS_TOUCH_END = true
      this.setData({ isHighlight: false })
      this.setMoveEnd()
    },
    /**
     * @description 图片已加载完成
     */
    handleImgLoaded () {
      console.log('图片已加载')
      this.$emit('')
    },
    /**
     * @description 图片加载失败
     */
    handleImgLoadError () {
      console.log('图片已加载失败')
      this.$emit('confirm')
    },
    handleRotate () {
      this.setRoate(this.data.imgAngle + 90)
    },
    handleCancel () {
      this.setData({ show: false })
      this.$emit('cancel')
    },
    handleConfirm () {
      this.draw()
      this.setData({ show: false })
      this.$emit('confirm')
    },

    /**
     * @description canvas绘制
     */
    draw () {
      if (!this.data.imgSrc) return
      const draw = () => {
        const { imgWidth, imgHeight, imgScale, info, imgAngle } = this.data
        const { pixelRatio } = info
        // 图片真实大小
        const width = imgWidth * imgScale * pixelRatio
        const height = imgHeight * imgScale * pixelRatio
        // 取裁剪框和图片的交集
        const x = ''
        const y = ''
        // 如果直接使用canvas绘制的图片会有锯齿，因此需要*设备像素比
        // 设置（x, y）
        this.data.ctx.translate(x * pixelRatio, y * pixelRatio)
        // 设置
        this.data.rotate(imgAngle * Math.PI / 180)
        console.log(width, height)
      }
      draw()
    },
    preventTouchMove () { }
  }
})