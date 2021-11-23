/**
* @feat < 可滚动列表的wrapper >
* @describe <
  监听 document scroll事件
  滚动到底部自动拉取下一页数据

  注意：仅适用于body级列表
  注意：此组件的分页规则为：
    list = []  则 pageNum += 1 自动拉取下一页数据。
    code = CONSTANT.NO_MORE_LIST  则表示为不再有数据，无需再加载

* @author [xuxin] - 2021-09-17 17:08:23
*/
<template>
  <div>
    <slot name="list" :dataList="dataList"></slot>
    <div class="reach-bottom-wrapper">
      <template v-if="noMoreProductList">
        <img class="img-content" src="~@img/global/footer-line.png" alt />
        <div class="bottom-line-text">我是有底线的</div>
        <img class="img-content" src="~@img/global/footer-line.png" alt />
      </template>
      <template v-else-if="noMoreProductList === false">
        <mt-spinner type="fading-circle"></mt-spinner>
        <div class="loading-text">加载中...</div>
      </template>
    </div>
  </div>
</template>

<script>
import { Spinner } from "mint-ui";
import CONSTANT from "@/constant/status_code.js";
import {
  catchError,
  manualStopExecuteNext,
  isBodyCanScroll,
} from "@common/util/function.js";
import _ from "underscore";

/**
 * @feat < 页面滚动回调 >
 * @describe <
 *  注意：这个方法必须放在外面，如果放在methods里面，会因为this指向改变 导致 window.removeEventListener('scroll') 失效,无法移除
 * >
 * @author [xuxin] - 2021-09-15 14:44:15
 */
let $this;
const pageScrollCb = _.debounce(function () {
  try {
    if ($this.isGetting_dataList === true) {
      return false;
    }

    const _doc = document;
    const _docEle = _doc.documentElement;
    const _docBody = _doc.body;

    const windowHeight = _docEle.clientHeight || _docBody.clientHeight;
    let scrollTop = _docEle.scrollTop || _docBody.scrollTop;
    let scrollHeight = _docEle.scrollHeight || _docBody.scrollHeight;

    //页面滚动到底部
    if (scrollTop + windowHeight >= scrollHeight - 10) {
      if (!$this.noMoreProductList) {
        $this.triggerGetDataList($this.pageNum + 1);
      }
    }
  } catch (error) {
    $this.isGetting_dataList = false;
  }
}, 50);

export default {
  name: "",
  components: {
    [Spinner.name]: Spinner,
  },
  props: {
    // 拉取数据的方法
    fetchDataMethod: {
      type: Function,
    },
    defaultPageSize: {
      type: Number,
      default: 10,
    },
    defaultPageNum: {
      type: Number,
      default: 1,
    },
    // mounted之后是否立即拉取数据
    fetchDataOnMounted: {
      type: Boolean,
      default: true,
    },
    // 挂载后自动滚动到顶部
    mountedAutoScrollToTop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      noMoreProductList: null, // 底部: null = 啥都不显示； true = 我是有底线的； false: 显示loading
      dataList: [],
      pageSize: this.defaultPageSize,
      pageNum: this.defaultPageNum,
      canBodyScroll: false,
    };
  },
  beforeDestroy() {
    document.removeEventListener("scroll", pageScrollCb); // 移除监听页面滚动

    this.componentWillUnMount = true;
  },
  mounted() {
    $this = this;
    document.addEventListener("scroll", pageScrollCb); // 监听页面滚动

    if (this.fetchDataOnMounted) {
      this.triggerGetDataList(this.pageNum);
    }

    if (this.mountedAutoScrollToTop) {
      window.scrollTo(0, 0);
    }
  },
  methods: {
    /**
     * @feat < 触发获取列表数据 >
     * @param {Number} pageNum 获取第几页数据
     * @author [xuxin] - 2021-09-17 15:42:14
     */
    async triggerGetDataList(pageNum) {
      try {
        const { pageSize } = this;

        this.isGetting_dataList = true; // 请求加锁
        this.noMoreProductList = false;

        await this.getSetDataList({
          pageNum,
          pageSize,
        });
      } catch (error) {
        if (CONSTANT.NO_MORE_LIST === (error && error.status)) {
          this.noMoreProductList = true;
          return false;
        }

        this.$emit("fetchDataError", error);
        catchError(error);
      } finally {
        this.consoleListLen();

        this.isGetting_dataList = false;

        if (!this.noMoreProductList) {
          this.noMoreProductList = null;
        }
        this.$emit("listChange", this.dataList);
      }
    },

    // 特殊操作：请勿删除，方便测试同学统计list length
    consoleListLen() {
      console.warn("已加载list item 数量", this.dataList.length);

      if (this.noMoreProductList) {
        console.log("最后一页，到底了");
      }
    },

    /**
     * @feat < 获取并设置列表数据  >
     * @param {Object} options
     * @param {Number} options.pageSize 每页条数
     * @param {Number} options.pageNum 页码
     * @author [xuxin] - 2021-09-17 15:43:27
     */
    async getSetDataList(options) {
      if (this.componentWillUnMount) throw manualStopExecuteNext; // 组件要卸载了，手动终止事件流

      const { list } = await this.fetchDataMethod(options);

      // 当前页没有数据， 获取下一页的数据
      if (list.length === 0) {
        return this.fetchNextPageData(options);
      } else {
        /**
         * @describe <
         *     有数据返回
         *     判断当前页面有没有出现滚动条，
         *          有的话，停滞递归。因为可以下拉加载更多了，
         *          没有则自动继续递归拉取数据，拉到页面能滚动为止
         * >
         */
        const { pageNum } = options;

        this.pageNum = pageNum;
        this.dataList =
          pageNum === this.defaultPageNum ? list : [...this.dataList, ...list];

        if (!this.canBodyScroll) {
          await this.$nextTick();
          let canBodyScroll = isBodyCanScroll();

          if (canBodyScroll) {
            // 特殊操作，如果快速切换页面，body的滚动状态未必能实时判断正确（因为切换页面有动画时长）
            canBodyScroll = await new Promise((resolve) => {
              setTimeout(() => {
                resolve(isBodyCanScroll());
              }, 700);
            });
          }

          this.canBodyScroll = canBodyScroll;

          if (
            !canBodyScroll
            // (canBodyScroll && this.dataList.length % 2 !== 0)
          ) {
            return this.fetchNextPageData(options);
          }
        }
      }
    },

    /**
     * @feat < 继续拉取数据 >
     * @param {Object} options
     * @param {Number} options.pageSize 每页条数
     * @param {Number} options.pageNum 页码
     * @author [xuxin] - 2021-09-17 15:40:19
     */
    async fetchNextPageData(options) {
      options.pageNum += 1;
      return await this.getSetDataList(options);
    },

    /**
    * @feat <父级调用初始化>
    * @describe < 暂时弃用，因无法手动终结ajax进程，导致可能会数据追加错误，
    *   初始化改用为
    *   v-if="isMountedScrollList"  销毁再创建
    *   
    *   this.isMountedScrollList = false
    * 
        this.$nextTick(() => {
          this.isMountedScrollList = true
        })
    *  >
    */
    // initByParent: _.debounce(async function () {
    //   try {
    //     this.dataList = [];
    //     this.noMoreProductList = false;
    //     this.pageSize = this.defaultPageSize;
    //     this.pageNum = this.defaultPageNum;

    //     await this.$nextTick();

    //     if (this.isGetting_dataList === true) {
    //       return false;
    //     }
    //     this.canBodyScroll = isBodyCanScroll();
    //     this.triggerGetDataList(this.pageNum); // 重新拉取数据
    //   } catch (error) {
    //     this.isGetting_dataList = false;
    //   }
    // }, 100),
  },
};
</script>

<style lang='less' scoped>
.reach-bottom-wrapper {
  height: 40px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  .img-content {
    width: 18px;
    height: 1px;
  }
  .bottom-line-text {
    margin: 0 15px;
    font-size: 13px;
    color: rgb(189, 192, 197);
  }
  .loading-text {
    margin: 0 15px;
    font-size: 13px;
  }
}
</style>
