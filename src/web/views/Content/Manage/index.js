import React, { Component } from 'react'
import classnames from 'classnames'
import _ from 'lodash'
import moment from 'moment'

import {
  Checkbox,
  Table,
  Button
} from 'react-bootstrap'

const style = require('./style.scss')

export default class ManageView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      checkedIds: [],
      allChecked: false
    }
  }

  handleCheckboxChanged(id) {
    const modified = this.state.checkedIds

    if (_.includes(this.state.checkedIds, id)) {    
      _.pull(modified, id)
    } else {
      modified.push(id)
    }

    this.setState({
      checkedIds: modified
    })
  }

  handleAllCheckedChanged() {
    this.setState({
      allChecked: !this.state.allChecked
    })

    setImmediate(() => {
      const ids = []
      
      if (this.state.allChecked) {
        _.forEach(this.props.messages, ({ id }) => {
          ids.push(id)
        })
      }

      this.setState({
        checkedIds: ids
      })
    })
  }

  handleDeleteSelected() {
    this.props.handleDeleteSelected(this.state.checkedIds)
    
    this.setState({
      checkedIds: [],
      allChecked: false
    })
  }

  renderTableHeader() {
    return <tr>
        <th></th>
        <th>ID</th>
        <th>Category</th>
        <th>Preview</th>
        <th>Created</th>
      </tr>
  }

  renderMessage(m) {
    const checked = _.includes(this.state.checkedIds, m.id)

    return <tr>
        <td style={{ 'width': '2%', 'minWidth': '34px' }}>
          <Checkbox checked={checked} onClick={() => ::this.handleCheckboxChanged(m.id)}/>
        </td>
        <td style={{ 'width': '16%' }}>{m.id}</td>
        <td style={{ 'width': '16%' }}>{m.categoryId}</td>
        <td style={{ 'width': '46%' }}>{m.previewText}</td>
        <td style={{ 'width': '20%' }}>{moment(m.createdOn).format('MMMM Do YYYY, h:mm')}</td>
      </tr>
  }

  renderTable() {
    return <div className={style.container}>
      <Table striped bordered condensed hover>
        <tbody>
          {this.props.messages.map(::this.renderMessage)}
        </tbody>
      </Table>
    </div>
  }

  renderPaging() {
    const of = this.props.count

    let from = (this.props.page - 1) * this.props.messagesPerPage + 1
    let to = this.props.page * this.props.messagesPerPage
    
    from = of !== 0 ? from : 0
    to = to <= of ? to : of

    const text = from + ' - ' + to + ' of ' + of
    
    return <span className={style.paging}>{text}</span>
  }

  renderHeader() {
    return <div className={style.header}>
      <div className={style.left}>
        <Button onClick={::this.handleAllCheckedChanged}>
          <Checkbox checked={this.state.allChecked} onClick={::this.handleAllCheckedChanged}/>
        </Button>
        <Button onClick={this.props.handleRefresh}>
          <i className='material-icons'>refresh</i>
        </Button> 
        <Button
          onClick={::this.handleDeleteSelected}
          disabled={_.isEmpty(this.state.checkedIds)}>
          <i className='material-icons'>delete</i>
        </Button>
      </div>
      <div className={style.right}>
        {this.renderPaging()}
        <Button
          onClick={this.props.handlePrevious}
          disabled={this.props.page === 1}>
          <i className='material-icons'>keyboard_arrow_left</i>
        </Button>
        <Button
          onClick={this.props.handleNext}
          disabled={this.props.page * this.props.messagesPerPage >= this.props.count}>
          <i className='material-icons'>keyboard_arrow_right</i>
        </Button>
      </div>
    </div>
  }

  render() {
    const classNames = classnames({
      'bp-manage': true,
      [style.manage]: true
    })

    return <div className={classNames}>
      {this.renderHeader()}
      {this.renderTable()}
    </div>
  }
}