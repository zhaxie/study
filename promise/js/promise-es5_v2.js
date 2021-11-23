
function Promise(promiseFn) {
    let _this = this;

    this.promiseStatus_pending = 'pending'
    this.promiseStatus_resolve = 'resolve'
    this.promiseStatus_reject = 'reject'

    this.promiseStatus = this.promiseStatus_pending
    this.thenCatchExecuteList = []

    setTimeout(function () {
        try {
            promiseFn(function (res) {
                _this.resolveOrReject(res, _this.promiseStatus_resolve)
            }, function (error) {
                _this.resolveOrReject(error, _this.promiseStatus_reject)
            })
            _this.promiseStatus = _this.promiseStatus_pending
        } catch (error) {
            console.info('promiseFn---error', error)
            _this.executeThenCatch(error, _this.promiseStatus_reject)
        }
    });

    this.then = function (thenFn) {
        _this.thenCatchExecuteList.push(thenFn)

        return _this
    }

    this.catch = function (catchFn) {
        _this.thenCatchExecuteList.push(catchFn)

        return _this
    }

    this.resolveOrReject = function (res, promiseStatus) {
        _this.finallyRes = res

        if (res instanceof Promise) {
            res.executeFinallyCb = _this.executeThenCatch
        } else {
            _this.executeThenCatch(res, promiseStatus)
        }
    }

    this.executeThenCatch = function (res, promiseStatus) {
        if (res instanceof Promise) {
            res.executeFinallyCb = _this.executeThenCatch
        } else {
            if (_this.thenCatchExecuteList && _this.thenCatchExecuteList.length > 0) {
                const current = _this.thenCatchExecuteList.splice(0, 1)[0]

                try {
                    const currentReturnRet = current(res)
                    _this.executeThenCatch(currentReturnRet, _this.promiseStatus_resolve)
                } catch (error) {
                    _this.executeThenCatch(currentReturnRet, _this.promiseStatus_reject)
                }
            } else {
                _this.promiseStatus = promiseStatus
                _this.executeFinally(res)
            }
        }
    }

    this.finally = function (res) {
        this.finallyFunc = res
    }

    this.executeFinally = function (res) {
        if (_this.executeFinallyCb) {
            _this.executeFinallyCb(res, _this.promiseStatus)
        }

        this.finallyFunc && this.finallyFunc()

        return res
    }

    return this
}


Promise.all = function (promiseList) {
    const promiseRetList = []

    let _resolve
    let _reject

    promiseList.forEach((item, index) => {
        item.finally(function (res) {
            if (item.promiseStatus === item.promiseStatus_reject) {
                setTimeout(() => {
                    _reject(res)
                })
            } else {
                promiseRetList.push(res)
                setTimeout(function () {
                    const isAllResolved = promiseRetList.filter(item => item).length === promiseList.length

                    if (isAllResolved) {
                        _resolve(promiseRetList)
                    }
                })
            }
        })
    })

    return new Promise((resolve, reject) => {
        _resolve = resolve
        _reject = reject
    })
}