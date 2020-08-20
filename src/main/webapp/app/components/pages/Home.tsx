import React, { Component } from 'react'
import {inject, observer} from "mobx-react";

@inject("commonStore", "userStore")
@observer
@withRouter
class Home extends Component {
    componentDidMount() {
        if (this.props.match && this.props.match.params.out) {
            this.props.userStore.logout()
        }
    }
    render () {
        console.log(this.props.commonStore)
        return (
            <div>
                <h1>Home Page</h1>
                <div>Home Page Content: {this.props.commonStore.loading ? this.props.commonStore.error : 'no errors'}</div>
            </div>
        )
    }
}

export default Home