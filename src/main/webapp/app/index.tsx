
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import {Provider} from "mobx-react"
import commonStore from "./stores/CommonStore"
import userStore from "./stores/UserStore"
import routerStore from "./stores/RouterStore"

const stores = {
    commonStore,
    userStore,
    routerStore
}

ReactDOM.render(
    <Provider {...stores}>
        <App />
    </Provider >,
    document.getElementById('root')
)