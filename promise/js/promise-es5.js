
function Promise(promiseFn) {
    let _this = this;

    this.promiseStatus_pending = 'pending'
    this.promiseStatus_resolve = 'resolve'
    this.promiseStatus_reject = 'reject'

    this.promiseStatus = this.promiseStatus_pending

    this.thenFuncList = []
    this.catchFuncList = []

    setTimeout(function () {
        try {
            promiseFn(_this.resolve, _this.reject)
            _this.promiseStatus = _this.promiseStatus_pending
        } catch (error) {
            _this.executeCatch(error)
        }
    });

    this.then = function (thenFn) {
        _this.thenFuncList.push(thenFn)

        return _this
    }

    this.resolve = function (res) {
        _this.finallyRes = res

        if (res instanceof Promise) {
            res.executeFinallyCb = (res, promiseStatus) => {
                if (promiseStatus === _this.promiseStatus_resolve) {
                    _this.executeThen(res)
                } else {
                    _this.executeCatch(res)
                }
            }
        } else {
            _this.executeThen(res)
        }
    }

    this.executeThen = function (res) {
        if (res instanceof Promise) {
            res.executeFinallyCb = (res, promiseStatus) => {
                if (promiseStatus === _this.promiseStatus_resolve) {
                    _this.executeThen(res)
                } else {
                    _this.executeCatch(res)
                }
            }
        } else {
            if (_this.thenFuncList && _this.thenFuncList.length > 0) {
                const current = _this.thenFuncList.splice(0, 1)[0]

                try {
                    const currentReturnRet = current(res)
                    _this.executeThen(currentReturnRet)
                } catch (error) {
                    _this.executeCatch(error)
                }
            } else {
                _this.promiseStatus = _this.promiseStatus_resolve
                _this.executeFinally(res)
            }
        }
    }

    this.catch = function (catchFn) {
        _this.catchFuncList.push(catchFn)

        return this
    }

    this.reject = function (error) {
        _this.finallyRes = error

        if (error instanceof Promise) {
            error.executeFinallyCb = _this.executeCatch
        } else {
            _this.executeCatch(error)
        }
    }

    this.executeCatch = function (error) {
        if (error instanceof Promise) {
            error.executeFinallyCb = _this.executeCatch
        } else {
            if (_this.catchFuncList && _this.catchFuncList.length > 0) {
                const current = _this.catchFuncList.splice(0, 1)[0]

                try {
                    const currentReturnRet = current(error)
                    _this.executeThen(currentReturnRet)
                } catch (error) {
                    _this.executeCatch(error)
                }
            } else {
                _this.promiseStatus = _this.promiseStatus_reject
                _this.executeFinally(error)
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

        this.finallyFunc && this.finallyFunc(res)

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