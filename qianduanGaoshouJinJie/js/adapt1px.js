/*
 * @Date         : 2021-05-17 12:16:18
 * @LastEditors  : cxx
 * @LastEditTime : 2021-05-17 15:08:15
 * @FilePath     : \test\test_project\src\assets\js\adapt1px.js
 */
let viewport = document.querySelector('meta[name=viewport]')
let _contentVal;

//下面是根据设备像素设置viewport
switch (window.devicePixelRatio) {
    case 1:
        _contentVal = 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no';
        break
    case 2:
        _contentVal = 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no';
        break
    case 3:
        _contentVal = 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no';
        break
}

viewport.setAttribute('content', _contentVal)

function resize() {
    let width = screen.width > 750 ? '75px' : screen.width / 10 + 'px'
    document.getElementsByTagName('html')[0].style.fontSize = width
}

window.onresize = resize