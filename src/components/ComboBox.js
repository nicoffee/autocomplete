import React, { Component } from 'react'
import kladr from './kladr.json'

let cities = kladr.slice(1, 10);

const ListItem = (props) => {
    if (!props.children) {
        return <li>Не найдено</li>
    }

    return (+props.idx === props.focusedId) ?
        <li><b>{props.children}</b></li> :
        <li><i>{props.children}</i></li>
};

const List = (props) => {
    console.log('!props.children', props.children);
    console.log('!props.children', !props.children.length);

    if (!props.children.length) {
        return <ul><li>Не найдено</li></ul>;
    }

    return <ul>{props.children}</ul>;
}

class ComboBox extends Component {
    constructor() {
        super();
        this.state = {
            cities: cities,
            listVisible: false,
            focusedElementId: -1
        };
    }

    componentDidMount() {
        let data;
        //fetch('http://localhost:3000/Cities').then((res) => {response = res.json()});

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/Cities', true);
        xhr.onload = function() { data = this.responseText };
        xhr.send();

        setTimeout(() => console.log('data:', data), 100);

        this.textInput.addEventListener('input', (e) => {
            const reg = new RegExp(e.target.value, 'i');
            const citiesList = cities.filter((city, idx) => reg.test(city.City));

            this.setState({
                cities: citiesList,
                listVisible: true,
                focusedElementId: 0
            });
        }, true);

        this.textInput.addEventListener('keydown', (e) => {
            console.log(e.keyCode);

            switch (e.keyCode) {
                case 40:
                    if (this.state.focusedElementId < cities.length - 1) {
                        this.setState({
                            focusedElementId: this.state.focusedElementId + 1
                        });
                    };
                    break;
                case 38:
                    if (this.state.focusedElementId > 0) {
                        this.setState({
                            focusedElementId: this.state.focusedElementId -1
                        });
                        break;
                    }
            }

            if (e.keyCode === 13) {
                e.target.value = this.state.cities[this.state.focusedElementId].City;
            }
        }, true);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.focusedElementId !== nextState.focusedElementId) {
            return true;
        }

        return true;
    }

    toggleList() {
        this.setState({
            listVisible: true
        });
    }

    render() {
        let cities = this.state.cities.map(
          (city, idx) => <ListItem key={idx} idx={idx} focusedId={this.state.focusedElementId}>{city.City}</ListItem>
        );

        return (
          <div className="autocomplete">
              <div className="input-wrapper">
                  <input
                    placeholder="Введите или выберите из списка"
                    ref={(input) => { this.textInput = input; }}
                    type="text"
                  />
                  <button
                    className="select__toggle"
                    onClick={this.toggleList.bind(this)}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20.308" height="20.309" viewBox="0 0 404.308 404.309"><path d="M0 101.08h404.308l-202.157 202.149-202.151-202.149z"/></svg>
                  </button>
              </div>
              <div
                className="select__menu"
                style={
                    { display: (this.state.listVisible) ? 'block' : 'none'}
                }
              >
              <List id={this.state.focusedElementId}>
                  {cities}
              </List>
              </div>
          </div>
        );
    }
}

export default ComboBox
