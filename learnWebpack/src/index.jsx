import React from 'react'
import { render } from 'react-dom'
import classNames from 'classnames'

import Home from './view/home/index.tsx'

import 'src/index.scss'
import './index.less'
import './index.css'

const App = () => {
  return (
    <div className={classNames('main-content')}>
      <Home></Home>
    </div>
  )
}
render(<App />, document.getElementById('root'))
