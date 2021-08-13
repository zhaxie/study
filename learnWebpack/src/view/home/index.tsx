import React, { Component } from 'react';

interface Props {}
interface State {
    name: 'cxx',
}

class index extends Component<Props, State> {
    constructor(props) {
        super(props)
    }

    testClickName = (name: String) => {
        console.info('name', name)
    }

    render() {
        return (
            <div onClick={() => this.testClickName('cxx')}>
                我是home  tsx333
            </div>
        );
    }
}

export default index