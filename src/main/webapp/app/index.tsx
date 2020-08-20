
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import {Provider} from "mobx-react"
import commonStore from "./stores/CommonStore"

const stores = {
    commonStore
}

ReactDOM.render(
    <Provider {...stores}>
        <App />
    </Provider >,
    document.getElementById('root')
)