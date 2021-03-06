import React, { Component, Fragment } from 'react'
import autobind from 'autobind-decorator'

import * as EditorMode from '../../constants/EditorMode'

import { Popover, Menu, MenuItem, Button } from '@material-ui/core'
import { SwapVert } from '@material-ui/icons'

class EditorSwitch extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      open: false,
      popoverParent: null
    }
  }

  @autobind
	handleOpenEditorMode(e) {
		e.preventDefault()
		this.setState({
			open: true,
			popoverParent: e.currentTarget
		})
  }
  
  @autobind
	handleCloseEditorMode(e) {
		this.setState({
      open: false,
      popoverParent: null
		})
  }
  
  @autobind
  handleChangeEditorMode(editorMode) {
    const { onChange } = this.props
    this.handleCloseEditorMode()
    onChange(editorMode)
  }

  render() {
    const { open, popoverParent } = this.state
    const { editorMode } = this.props

    return (
      <Fragment>
        <Button variant='fab' color='primary' className="btn_change_editor" aria-owns={open? 'change-editor-menu':undefined} mini={true} onClick={this.handleOpenEditorMode}>
					<SwapVert />
				</Button>

        <Menu
          id='change-editor-menu'
          open={open}
          anchorEl={popoverParent}
          onClose={this.handleCloseEditorMode}
        >
          <MenuItem selected={editorMode === EditorMode.QUILL}
            onClick={e => this.handleChangeEditorMode(EditorMode.QUILL)}>
            Rich Editor (Quill)
          </MenuItem>
          <MenuItem selected={editorMode === EditorMode.TINYMCE}
            onClick={e => this.handleChangeEditorMode(EditorMode.TINYMCE)}>
            Rich Editor (Tinymce)
          </MenuItem>
          <MenuItem selected={editorMode === EditorMode.MARKDOWN}
            onClick={e => this.handleChangeEditorMode(EditorMode.MARKDOWN)}>
            Markdown Editor
          </MenuItem>
        </Menu>
      </Fragment>
    )
  }
}

export default EditorSwitch
