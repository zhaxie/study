
/**
* @feat < 页面是否可以滚动 >
* @describe <
*   滚动高度：scrollTop > 0 || 文档高度：scrollHeight > 窗口高度：windowHeight
* >
* @author [xuxin] - 2021-09-17 16:56:37
*/
export const isBodyCanScroll = () => {
    const _docEle = document.documentElement;
    const _docBody = document.body;
  
    let scrollTop = _docEle.scrollTop || _docBody.scrollTop;
  
    if (scrollTop > 0) {
      return true;
    } else {
      const windowHeight = _docEle.clientHeight || _docBody.clientHeight;
      let scrollHeight = _docEle.scrollHeight || _docBody.scrollHeight;
      
      return scrollHeight > windowHeight;
    }
  
  }
  