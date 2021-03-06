import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { ipcRenderer, clipboard } from 'electron'
import autobind from 'autobind-decorator'
import Codemirror from 'react-codemirror'
import MarkdownHelper from './MarkdownHelper'

import { Button } from '@material-ui/core'
import { FormatBold, FormatItalic, FormatUnderlined, Attachment } from '@material-ui/icons'

import CodeMirrorHelper from './CodeMirrorHelper'
import GooglePhotosDialog from '../plugins/google-photos/GooglePhotosDialog'

const MacKeymap = [
	{ 'Cmd-2': (cm) => CodeMirrorHelper.header2(cm) },
	{ 'Cmd-3': (cm) => CodeMirrorHelper.header3(cm) },
	{ 'Cmd-B': (cm) => CodeMirrorHelper.bold(cm) },
	{ 'Cmd-I': (cm) => CodeMirrorHelper.italic(cm) },
	{ 'Cmd-U': (cm) => CodeMirrorHelper.underline(cm) },
	{ 'Cmd-K': (cm) => CodeMirrorHelper.link(cm) }
]

const PcKeymap = [
	{ 'Ctrl-2': (cm) => CodeMirrorHelper.header2(cm) },
	{ 'Ctrl-3': (cm) => CodeMirrorHelper.header3(cm) },
	{ 'Ctrl-B': (cm) => CodeMirrorHelper.bold(cm) },
	{ 'Ctrl-I': (cm) => CodeMirrorHelper.italic(cm) },
	{ 'Ctrl-U': (cm) => CodeMirrorHelper.underline(cm) },
	{ 'Ctrl-K': (cm) => CodeMirrorHelper.link(cm) }
]

class MarkdownEditor extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
			value: MarkdownHelper.htmlToMarkdown(props.value),
			openGooglePhotos: false,
			preview: false
		}
  }

  componentWillMount() {
		ipcRenderer.on("finish-add-file", this.handleFinishUploadFile)
	}

	componentWillUnmount() {
		ipcRenderer.removeListener("finish-add-file", this.handleFinishUploadFile)
	}

	componentDidMount() {
		const { editor } = this.refs
		let cm = editor.getCodeMirror()
		cm.on("paste", this.handlePaste)

		const keymap = navigator.userAgent.indexOf('Macintosh') > 0 ? MacKeymap : PcKeymap
		keymap.map(map => cm.addKeyMap(map))
	}

	@autobind
  handleFinishUploadFile(e, fileUrl) {
		const { editor } = this.refs
		console.log("finishUploadFile", fileUrl)
		CodeMirrorHelper.insertImage(editor.getCodeMirror(), fileUrl)
	}

	@autobind
	handlePaste(e) {
		const { currentBlog } = this.props

		let image = clipboard.readImage()
		if (!image.isEmpty()) {
			ipcRenderer.send("add-clipboard-image", currentBlog.name)
		}
	}

  getContent() {
    const { value } = this.state
    return MarkdownHelper.markdownToHtml(value)
  }

	@autobind
  handleChangeContent(value) {
    this.setState({
      value: value
    })
	}

	@autobind
	handleHeader2(e) {
		const { editor } = this.refs
		e.preventDefault()
		CodeMirrorHelper.header2(editor.getCodeMirror())
	}

	@autobind
	handleHeader3(e) {
		const { editor } = this.refs
		e.preventDefault()
		CodeMirrorHelper.header3(editor.getCodeMirror())
	}
	
	@autobind
	handleBold(e) {
		const { editor } = this.refs
		e.preventDefault()
		CodeMirrorHelper.bold(editor.getCodeMirror())
	}

	@autobind
	handleItalic(e) {
		const { editor } = this.refs
		e.preventDefault()
		CodeMirrorHelper.italic(editor.getCodeMirror())
	}

	@autobind
	handleUnderline(e) {
		const { editor } = this.refs
		e.preventDefault()
		CodeMirrorHelper.underline(editor.getCodeMirror())
	}

	@autobind
	handleLink(e) {
		const { editor } = this.refs
		e.preventDefault()
		CodeMirrorHelper.link(editor.getCodeMirror())
	}

	@autobind
	handleGooglePhotos(e) {
		this.setState({
			openGooglePhotos: true
		})
	}

	@autobind
	handleCloseGooglePhotos() {
		this.setState({
			openGooglePhotos: false
		})
	}

	@autobind
	handleInsertImage(url) {
		const { editor } = this.refs
		CodeMirrorHelper.insertImage(editor.getCodeMirror(), url)
	}

	@autobind
	handleTogglePreview() {
		const { preview } = this.state
		this.setState({
			preview: !preview
		})
	}

  render() {
		const { onOpenFile } = this.props
    const { value, openGooglePhotos, preview } = this.state

    const options = {
			lineNumbers: false,
			lineWrapping: true,
			mode: 'markdown',
			theme:'default'
		}
		
		const iconButtonStyle = {
			padding: '5px',
			minWidth: '34px',
			height: '34px',
			lineHeight: '24px'
		}

		return (
			<div className={classnames({ 'preview-on':preview })}>
				<div className="markdown-editor">
					<div className="editor-toolbar">
						<Button variant='text' onClick={this.handleHeader2} style={iconButtonStyle}>H2</Button>
						<Button variant='text' onClick={this.handleHeader3} style={iconButtonStyle}>H3</Button>
						<Button variant='text' onClick={this.handleBold} style={iconButtonStyle}><FormatBold /></Button>
						<Button variant='text' onClick={this.handleItalic} style={iconButtonStyle}><FormatItalic /></Button>
						<Button variant='text' onClick={this.handleUnderline} style={iconButtonStyle}><FormatUnderlined /></Button>
						<Button variant='text' onClick={this.handleLink} style={iconButtonStyle}>Link</Button>
						<Button variant='text' onClick={this.handleGooglePhotos} style={iconButtonStyle}><img src='../src/images/google-photos-logo.png' /></Button>
						<Button variant='text' onClick={onOpenFile} style={iconButtonStyle}><Attachment /></Button>
						<Button variant='text' onClick={this.handleTogglePreview} style={iconButtonStyle}>Preview</Button>
					</div>
					<Codemirror ref="editor" options={options} value={value}
						onChange={this.handleChangeContent} />
				</div>
				<div className="markdown-preview">
					<div className="markdown-preview-content content" dangerouslySetInnerHTML={{__html: MarkdownHelper.markdownToHtml(value)}} />
				</div>
				<GooglePhotosDialog open={openGooglePhotos} onClose={this.handleCloseGooglePhotos} onSelectImage={this.handleInsertImage} />
			</div>
		)
  }
}

MarkdownEditor.propTypes = {
  value: PropTypes.string.isRequired,
	currentBlog: PropTypes.object.isRequired
}

export default MarkdownEditor
