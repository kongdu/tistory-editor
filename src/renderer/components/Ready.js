import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import RaisedButton from 'material-ui/RaisedButton'

class Ready extends Component {

	handleRequestAuth() {
		ipcRenderer.send('request-auth')
	}

	render() {
		const { fetchlock } = this.props
		return (
			<div className='container'>
				<div className='ready'>
					<h1><span className="tistory">Tistory</span> Editor</h1>

					<RaisedButton
						label="티스토리 인증"
						labelStyle={{ color:"#fff" }}
						fullWidth={true}
	          backgroundColor="#f1631b"
						onClick={this.handleRequestAuth.bind(this)}
					/>
				</div>
			</div>
		)
	}
}


export default Ready
