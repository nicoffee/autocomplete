import React, { Component } from 'react'

class Input extends Component {
    render() {
        return (
          <input
            placeholder="Введите или выберите из списка"
            ref={(input) => { this.textInput = input; }}
            type="text"
          />
        );
    }
}

export default Input