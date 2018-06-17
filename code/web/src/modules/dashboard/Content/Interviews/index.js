// Imports
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// UI Imports
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import IconAdd from '@material-ui/icons/Add'
import IconCached from '@material-ui/icons/Cached'
import Fade from '@material-ui/core/Fade'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'

// App Imports
import { messageShow } from '../../../common/api/actions'
import { getListByClient } from '../../../interview/api/actions/query'
import { view, viewHide, edit, editClose } from '../../../interview/api/actions/mutation'
import Loading from '../../../common/Loading'
import CreateOrEdit from '../../../interview/Manage/CreateOrEdit'
import ListTable from '../../../interview/Manage/List/ListTable'
import View from '../../../interview/Manage/View'

// Component
class Interviews extends PureComponent {

  constructor() {
    super()

    this.state = {
      drawerAdd: false
    }
  }

  componentDidMount() {
    const { editClose } = this.props

    editClose()

    this.refresh()
  }

  refresh = (isLoading = true) => {
    const { getListByClient, clientDashboard: { client } } = this.props

    getListByClient({ clientId: client._id }, isLoading)
  }

  toggleDrawer = (open) => () => {
    this.setState({
      drawerAdd: open
    })
  }

  successCallback = () => {
    this.refresh(false)

    this.toggleDrawer(false)()
  }

  add = () => {
    const { editClose } = this.props

    editClose()

    this.toggleDrawer(true)()
  }

  edit = interview => () => {
    const { edit } = this.props

    edit(interview)

    this.toggleDrawer(true)()
  }

  view = interview => () => {
    const { view } = this.props

    view(interview)
  }

  render() {
    const { classes, clientDashboard: { client }, interviewsByClient: { isLoading, list }, interviewView, viewHide } = this.props
    const { drawerAdd } = this.state

    return (
      <div className={classes.root}>
        {/* Actions */}
        <div className={classes.actions}>
          <Button onClick={this.toggleDrawer(true)}>
            <IconAdd className={classes.actionIcon} />
            Add
          </Button>

          <Button onClick={this.refresh}>
            <IconCached className={classes.actionIcon} />
            Refresh
          </Button>
        </div>

        <Divider />

        {/* Candidate list */}
        {
          isLoading
            ? <Loading />
            : <Fade in={true}>
                <ListTable list={list} view={this.view} edit={this.edit} />
              </Fade>
        }

        {/* Candidate view */}
        <Drawer
          anchor={'right'}
          open={interviewView.open}
          onClose={viewHide}
          ModalProps={{
            BackdropProps: {
              classes: { root: classes.backdrop }
            }
          }}
        >
          { <View /> }
        </Drawer>

        {/* Candidate create or edit */}
        <Drawer
          anchor={'right'}
          open={drawerAdd}
          onClose={this.toggleDrawer(false)}
          ModalProps={{
            BackdropProps: {
              classes: { root: classes.backdrop }
            }
          }}
        >
          <div className={classes.drawer}>
            <CreateOrEdit
              elevation={0}
              clientId={client._id}
              successCallback={this.successCallback}
            />
          </div>
        </Drawer>
      </div>
    )
  }
}

// Component Properties
Interviews.propTypes = {
  classes: PropTypes.object.isRequired,
  interviewsByClient: PropTypes.object.isRequired,
  interviewView: PropTypes.object.isRequired,
  clientDashboard: PropTypes.object.isRequired,
  getListByClient: PropTypes.func.isRequired,
  editClose: PropTypes.func.isRequired,
  messageShow: PropTypes.func.isRequired
}

// Component State
function interviewsState(state) {
  return {
    interviewsByClient: state.interviewsByClient,
    interviewView: state.interviewView,
    clientDashboard: state.clientDashboard
  }
}

export default connect(interviewsState, { getListByClient, view, viewHide, edit, editClose, messageShow })(withStyles(styles)(Interviews))
