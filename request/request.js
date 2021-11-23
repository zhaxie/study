/**
 * @feat < 请求封装函数 >
 *
 * @author [xuxin] - 2021-05-26 11:03:39
 * @version [v1, 2021-05-26 11:03:39]
 */
// eslint-disable-next-line max-classes-per-file
import axios from 'axios'
import { getToken, triggerLogout } from '@util/gw-header'
import LoadingDialog from '@component/loadingDialog/main'
import { manualCanCelRequest } from '@util/function.js'

/**
 * @feat < 手动取消请求 >
 * @author [xuxin] - 2021-09-08 12:27:58
 */
class ManualCanCelRequest {
  static manualCanCelRequest = manualCanCelRequest

  /**
   * @feat < 收集当前请求的取消请求操作 >
   * @describe <>
   * @param {String} requestKey 当前请求的唯一key
   * @author [xuxin] - 2021-09-08 10:32:28
   */
  static collectCancelSource(requestKey, axiosCancelSource) {
    this.cancelSourceList.push({
      requestKey,
      axiosCancelSource,
    })

    // console.info('添加 collectCancelSource---1', this.cancelSourceList)
  }

  /**
   * @feat < 移除当前请求的取消请求操作 >
   * @param {String } requestKey 当前请求的唯一key
   * @author [xuxin] - 2021-09-08 10:37:41
   */
  static removeCurrentCancelSource(requestKey) {
    const { cancelSourceList } = this

    const myIndex = cancelSourceList.findIndex(
      (item) => item.requestKey === requestKey
    )

    if (myIndex !== -1) {
      this.cancelSourceList.splice(myIndex, 1)
    }
    // console.info('移除 removeCurrentCancelSource---2-0', this.cancelSourceList)
  }

  /**
   * @feat <手动取消请求>
   * @param {String} requestKey 当前请求的唯一key
   * @author [xuxin] - 2021-09-08 10:42:22
   */
  static cancelRequest(requestKey) {
    const { cancelSourceList } = this

    const current = cancelSourceList.find(
      (item) => item.requestKey === requestKey
    )

    // console.info('手动取消请求', current)

    console.info('(manualCanCelRequest)', this.manualCanCelRequest)

    if (current) {
      current.axiosCancelSource.cancel(this.manualCanCelRequest)
    }
    // console.info('手动取消移除 cancelRequest---2-0', this.cancelSourceList)
  }
}

class Request extends ManualCanCelRequest {
  static requestSendTimes = 0 // 请求发送次数

  static cancelSourceList = [] // 取消请求资源

  /**
   * @feat < 发送请求 >
   * @param {Object} options
   */
  static async send(options) {
    try {
      // 显示进度条
      this.showProgressBar()

      // 获取ajax请求结果
      const ajaxRet = await this.getAjaxRet(options)

      // 处理请求结果
      return this.handleAjaxRet(ajaxRet)
    } catch (error) {
      console.error('Request出错', error)

      if (
        typeof error === 'object' &&
        error.message !== this.manualCanCelRequest
      ) {
        this.requestSendTimes = 1 // 设置次数为1 直接移除请求loading
      }

      throw error
    } finally {
      this.hideProgressBar()
    }
  }

  // 发送请求
  static async getAjaxRet(options) {
    let requestOptions = {}

    try {
      // 检查并适配请求参数
      requestOptions = this.checkAndAdaptOptions(options)

      const { url, method, data, params, requestKey } = requestOptions

      let source

      if (requestKey) {
        source = axios.CancelToken.source()
        this.collectCancelSource(requestKey, source) // 收集当前请求的取消请求操作
      }

      // 请求发送
      const ajaxRet = await axios({
        cancelToken: source && source.token,
        url,
        method: method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Mng-Token': getToken(),
        },
        transformRequest: [],
        data,
        params,
      })

      return ajaxRet
    } catch (error) {
      // eslint-disable-next-line no-alert
      console.error('getAjaxRet 出错', error)

      const response = error && error.response

      if (response) {
        this.handleAjaxRet(response)
      }

      throw error
    } finally {
      const { requestKey } = requestOptions

      if (requestKey) {
        this.removeCurrentCancelSource(requestKey)
      }
    }
  }

  static handleAjaxRet(ajaxRet) {
    const { status, data } = ajaxRet

    switch (status) {
      case 200:
        return data
      case 401:
        if (!this.isToLoggeted) {
          triggerLogout() // 跳转登录
          this.isToLoggeted = true
        }
        throw String('登录信息已失效，请重新登录')
      default:
        throw data ? data.msg : '网路请求发生未知错误'
    }
  }

  // 检查并适配请求参数
  static checkAndAdaptOptions(options) {
    try {
      const selfOptions = options

      const { method, data } = options
      const requiredOptions = {
        url: true,
      }

      // 必填参数校验
      Object.keys(requiredOptions).forEach((item) => {
        if (!options[item]) {
          throw String(`缺少必备参数 ${item}`)
        }
      })

      // 默认使用 POST 请求
      if (!method) {
        selfOptions.method = 'POST'
      }

      // axios GET请求的 key 为 params
      if (method === 'GET') {
        selfOptions.params = data
        delete selfOptions.data
      }

      return selfOptions
    } catch (error) {
      console.error('checkAndAdaptOptions 出错', error)
      throw error
    }
  }

  // 显示：加载条
  static showProgressBar() {
    this.requestSendTimes += 1

    if (this.requestSendTimes === 1) {
      LoadingDialog.open({})
    }
  }

  // 隐藏：加载条
  static hideProgressBar() {
    this.requestSendTimes -= 1

    if (this.requestSendTimes === 0) {
      LoadingDialog.close()
    }
  }
}

export { Request }
