
// Promise.all([promiseOne]).then((res) => {
//     console.info('Promise.all-resolve', res)
// }).catch(error => {
//     console.error('Promise.all-oneReject', error)
// })

// new Promise((resolve, reject) => {
//     console.info('我是 new Promise')
//     resolve('我是resolve')
// }).then((res) => {
//     console.info('我上第一个then', res)

//     return res
// }).then((res) => {
//     console.info('我上第二个then', res)
// })    



// 实例1:
// new Promise((resolve, reject) => {
//     console.info('实例1：----------------------------------', '')
//     console.info('自定义Promise')

//     setTimeout(() => {
//         resolve('异步resolve')
//     })
// }).then((res) => {
//     console.info('-第一个then', res)

//     return res
// }).then((res) => {
//     console.info('-第二个then', res)
// })


// //  实例2：resolve
// new Promise((resolve, reject) => {
//     console.info('实例2：----------------------------------', '')
//     console.info('自定义Promise')

//     resolve(
//         new Promise((resolve, reject) => {
//             resolve('resolve-settimeout-newProimse-resolve-1')
//         })
//     )
// }).then((res) => {
//     console.info('-第一个then', res)

//     return new Promise((resolve, reject) => {
//         resolve(new Promise((resolve, reject) => {
//             resolve('then-newPromise-resolve-newPromise-resolve-2')
//         }))
//     })
// }).then((res) => {
//     console.info('-第二个then', res)
// })


// // 实例4：reject
// new Promise((resolve, reject) => {
//     console.info('实例4：----------------------------------', '')
//     console.info('自定义Promise')

//     setTimeout(() => {
//         reject(
//             new Promise((resolve, reject) => {
//                 reject('resolve-settimeout-newProimse-resolve')
//             })
//         )
//     })
// }).catch(error => {
//     console.error('第一个catch', error)

//     return new Promise((resolve, reject) => {
//         reject(new Promise((resolve, reject) => {
//             reject('第二个catch-reject')
//         }))
//     })
// }).catch(error => {
//     console.error('第二个catch', error)
// })



// //  实例5：resolve
// new Promise((resolve, reject) => {
//     console.info('实例5：----------------------------------', '')
//     console.info('自定义Promise')

//     resolve(
//         new Promise((resolve, reject) => {
//             resolve('resolve-settimeout-newProimse-resolve-1')
//         })
//     )
// }).then((res) => {
//     console.info('-第一个then', res)

//     return new Promise((resolve, reject) => {
//         reject(new Promise((resolve, reject) => {
//             reject('then-newPromise-resolve-newPromise-resolve-2')
//         }))
//     })
// }).catch(error => {
//     console.error('第一个error', error)
// })



// //  实例6：resolve
new Promise((resolve, reject) => {
    console.info('实例6：----------------------------------', '')
    console.info('自定义Promise')

    throw new Promise((resolve, reject) => {
        resolve('121212')
    })
}).then((res) => {
    console.info('-第一个then', res)

    return new Promise((resolve, reject) => {
        reject(new Promise((resolve, reject) => {
            reject('then-newPromise-resolve-newPromise-resolve-2')
        }))
    })
}).catch(error => {
    console.error('第一个error', error)
}).catch(error => {
    console.error('第二个error', error)
})


// //  实例7：resolve

// new Promise((resolve, reject) => {
//     console.info('实例7：----------------------------------', '')
//     console.info('自定义Promise')

//     resolve('一个resolve')
// }).then((res) => {
//     console.info('-1111第一个then', res)

//     throw '主动抛错误'
// }).finally((res) => {
//     console.warn('finally-res', res)
// })
