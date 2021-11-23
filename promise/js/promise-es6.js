
class Promise {
    promiseStatus;
    promiseStatus_pending = 'pending'
    promiseStatus_resolve = 'resolve'
    promiseStatus_reject = 'reject'
    thenFuncList = []
    catchFuncList = []


    constructor(promiseFn) {
        setTimeout(() => {
            try {
                promiseFn(this.resolve, this.reject)
                this.promiseStatus = this.promiseStatus_pending
            } catch (error) {
                this.executeCatch(error)
            }
        });
    }

    then = (thenFn) => {
        this.thenFuncList.push(thenFn)

        return this
    }

    resolve = (res) => {
        this.finallyRes = res

        if (res instanceof Promise) {
            res.finallyCb = this.executeThen
        } else {
            this.executeThen(res)
        }
    }

    executeThen = (res) => {
        if (res instanceof Promise) {
            res.finallyCb = (res, promiseStatus) => {
                if (promiseStatus === this.promiseStatus_resolve) {
                    this.executeThen(res)
                } else {
                    this.executeCatch(res)
                }
            }
        } else {
            if (this.thenFuncList && this.thenFuncList.length > 0) {
                const current = this.thenFuncList.splice(0, 1)[0]

                try {
                    const currentReturnRet = current(res)
                    this.executeThen(currentReturnRet)
                } catch (error) {
                    this.executeCatch(error)
                }
            } else {
                this.promiseStatus = this.promiseStatus_resolve
                this.finally(res)
            }
        }
    }

    catch = (catchFn) => {
        this.catchFuncList.push(catchFn)

        return this
    }

    reject = (error) => {
        this.finallyRes = error

        if (error instanceof Promise) {
            error.finallyCb = this.executeCatch
        } else {
            this.executeCatch(error)
        }
    }

    executeCatch = (error) => {
        if (error instanceof Promise) {
            error.finallyCb = this.executeCatch
        } else {
            if (this.catchFuncList && this.catchFuncList.length > 0) {
                const current = this.catchFuncList.splice(0, 1)[0]
                const currentReturnRet = current(error)

                this.executeCatch(currentReturnRet)
            } else {
                this.promiseStatus = this.promiseStatus_reject
                this.finally(error)
            }
        }
    }

    finally = (res) => {
        if (this.finallyCb) {
            this.finallyCb(res, this.promiseStatus)
        }
        return res
    }
}

