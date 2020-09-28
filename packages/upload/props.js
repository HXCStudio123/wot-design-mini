/**
 * @description 微信对应API接口共用参数
 */
export const commonProps = {
  // 多选
  multiple: Boolean,
  // 接受选择文件的类型
  accept: {
    type: String,
    value: 'image'
  },
  sizeType: {
    type: Array,
    value: ['original', 'compressed']
  },
  sourceType: {
    type: Array,
    value: ['album', 'camera']
  },
  // accept==="video" ---> 60
  maxDuration: {
    type: Number,
    value: 60
  },
  camera: {
    type: String,
    value: 'back'
  }
}

/**
 * @description 选择图片接口参数 以微信版本库1.9.91为准
 */
export const chooseImageProps = {
}

/**
 * @description 上传接口参数 以微信版本库1.9.91为准
 */
export const uploadProps = {
  header: {
    type: Object,
    value () {
      return {}
    }
  },
  name: {
    type: String,
    value: 'file'
  },
  formData: {
    type: Object,
    value () {
      return {}
    }
  }
}

/**
 * @description 选择视频接口参数 以微信版本库1.9.91为准
 */
export const videoProps = {
  compressed: {
    type: Boolean,
    value: true
  }
}

/**
 * @description 选择文件接口参数
 */
export const fileProps = {
  type: {
    type: String,
    value: 'file'
  }
}