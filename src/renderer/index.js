import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './containers/App'
import configureStore from './store/configureStore'
import { registIpcEvent } from './actions/ipc-event'

const store = configureStore()
registIpcEvent(store)

render (
	<Provider store={store}>
    <App />
	</Provider>,
	document.getElementById('root')
)
