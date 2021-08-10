import React from 'react';
import { render } from 'react-dom';
import classNames from 'classnames';

import './index.scss'
import './index.less'
import './index.css'

const handleClick = () => {
    alert()
}

const App = () => {
    const aa = '1212'

    return (
        <div
            className={classNames("main-content", 'index-css', 'box')}
            onClick={handleClick}
        >
            <div className={classNames('color', 'name')}>
                {aa}
            </div>
        </div >
    )
};
render(<App />, document.getElementById("root"));