import React, { Component } from 'react'
// import Input from './Input'
import citys from './kladr.json'

let cities = citys.slice(1, 10);

const ListItem = (props) => { console.log('props.key', props); console.log('props.focusedId.key', props.focusedId) ;return (+props.key === props.focusedId) ? <li><b>{props.children}</b></li> : <li><i>{props.children}</i></li>};
const List = (props) => <ul>{props.children}</ul>;

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
                cities: citiesList
            });
        }, true);

        this.textInput.addEventListener('keydown', (e) => {
            console.log('keypress', e);

            if (e.keyCode === 40) {
                this.setState({
                    focusedElementId: this.state.focusedElementId + 1
                });
            }
        }, true);

        console.log('this.toggleListBtn', this.toggleListBtn);
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
          (city, idx) => <ListItem key={idx} focusedId={this.state.focusedElementId}>{city.City}</ListItem>
        );

        return (
          <div className="select__input">
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="404.308" height="404.309" viewBox="0 0 404.308 404.309"><path d="M0 101.08h404.308l-202.157 202.149-202.151-202.149z"/></svg>
                  </button>
              </div>
              <div
                className="select__menu"
                style={{ display: (this.state.listVisible) ? 'block' : 'none'}}
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
