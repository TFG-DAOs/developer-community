import { Component } from 'react'
import { DropDown } from '@aragon/ui'

const items = [
  'Wandering Thunder',
  'Black Wildflower',
  'Ancient Paper',
]

class Dropdown extends React.Component {
  state = {
    activeItem: 0,
  }
  handleChange(index) {
    this.setState({ activeItem: index })
  }
  render() {
    return (
      <DropDown
        items={items}
        active={this.state.activeItem}
        onChange={this.handleChange}
      />
    )
  }
}

export default EditPanel