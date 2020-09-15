import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import {inject, observer} from "mobx-react"
import {Button, Icon, TextField, withStyles, WithStyles} from "@material-ui/core"
import {CommonStore} from "app/stores/CommonStore";
import {UserStore} from "app/stores/UserStore";

interface IProps extends WithStyles<typeof styles> {
    commonStore: CommonStore,
    userStore: UserStore
}

interface IState {
}

const styles = theme =>
    ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    })

@inject("commonStore", "userStore")
@withRouter
@observer
class SignUp extends Component<IProps, IState> {

    componentWillUnmount() {
        this.props.userStore.reset()
    }

    handleUserNameChange = e => {
        this.props.userStore.setUserName(e.target.value)
    }

    handlePasswordChange = e => {
        this.props.userStore.setPassword(e.target.value)
    }

    handleSubmitForm = e => {
        e.preventDefault()
        this.props.userStore.register()
    }

    render () {
        const { loading } = this.props.commonStore
        const { userName, password } = this.props.userStore
        return (
            <form
                className="grey lighten-2"
                noValidate
                autoComplete="off"
                title="Register"
            >
                <div>
                    <TextField
                        label='Login'
                        value={userName}
                        onChange={this.handleUserNameChange}
                    />
                </div>
                <div>
                    <TextField
                        label='Password'
                        value={password}
                        onChange={this.handlePasswordChange}
                    />
                </div>
                <div>
                    <Button
                        disabled={loading}
                        onClick={this.handleSubmitForm}
                    >
                        Submit
                        <Icon>
                            send
                        </Icon>
                    </Button>
                </div>
            </form>
        )
    }
}

export default withStyles(styles) (SignUp)