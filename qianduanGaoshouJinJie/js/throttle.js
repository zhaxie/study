/*
 * @Date         : 2021-04-07 10:14:22
 * @LastEditors  : cxx
 * @LastEditTime : 2021-04-07 10:15:19
 * @FilePath     : \qianduanGaoshouJinJie\js\throttle.js
 */

/**
 * @description:  节流
 * @param {*} func 目标函数
 * @param {*} wait 等待时长
 * @param {*} execFirstCall
 * @return {*}
 */
const throttle = (func, wait = 0, execFirstCall) => {
    let timeout = null;
    let args;
    let firstCallTimestamp;

    function throttled(...arg) {
        if (!firstCallTimestamp) {
            firstCallTimestamp = new Date().getTime();
        };

        if (!execFirstCall || !args) {
            args = arg;
        }
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }

        // 以Promise的形式返回函数执行结果
        return new Promise(async (res, rej) => {
            if (new Date().getTime() - firstCallTimestamp >= wait) {
                try {
                    const result = await func.apply(this, args);
                    res(result);
                } catch (e) {
                    rej(e);
                } finally {
                    cancel();
                }
            } else {
                timeout = setTimeout(async () => {
                    try {
                        const result = await func.apply(this, args);
                        res(result);
                    } catch (e) {
                        rej(e);
                    } finally {
                        cancel();
                    }
                }, firstCallTimestamp + wait - new Date().getTime());
            }
        })
    }

    // 允许取消
    function cancel() {
        clearTimeout(timeout);
        args = null;
        timeout = null;
        firstCallTimestamp = null;
    }

    // 允许立即执行
    function flush() {
        cancel();
        return func.apply(this, args);
    }

    throttled.cancel = cancel;
    throttled.flush = flush;
    
    return throttled;
}

export default throttle;