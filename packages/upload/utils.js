const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i

function isImageUrl (url) {
  return IMAGE_REGEXP.test(url)
}

export function isImageFile (item) {
  if (item.type) {
    return item.type.indexOf('image') === 0
  }

  if (item.path) {
    return isImageUrl(item.path)
  }

  if (item.url) {
    return isImageUrl(item.url)
  }

  return false
}

export function isVideo (
  res,
  accept
) {
  return accept === 'video'
}

/**
 * @description 初始化文件数据
 * @param {Object} file 上传的文件
 */
export function choose ({
  accept,
  multiple,
  sizeType,
  sourceType,
  maxDuration,
  camera,
  compressed,
  maxCount
}) {
  if (accept === 'image') {
    // 选择图片文件
    return new Promise((resolve, reject) => {
      jd.chooseImage({
        count: multiple ? Math.min(maxCount, 9) : 1, // 最多可以选择的数量，如果不支持多选则数量为1
        sizeType,
        sourceType,
        success: resolve,
        fail: reject
      })
    })
  } else if (accept === 'video') {
    // 选择视频文件
    return new Promise((resolve, reject) => {
      jd.chooseVideo({
        compressed,
        camera,
        maxDuration,
        sourceType,
        success: resolve,
        fail: reject
      })
    })
  } else {
    // 选择文件
    return new Promise((resolve, reject) => {
      jd.chooseMessageFile({
        count: multiple ? Math.min(maxCount, 9) : 1, // 最多可以选择的数量，如果不支持多选则数量为1
        type: 'file',
        success: resolve,
        fail: reject
      })
    })
  }
}