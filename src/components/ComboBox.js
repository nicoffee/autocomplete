import React, { Component } from 'react'
// import Input from './Input'
import cities from './../kladr.json'

class ComboBox extends Component {
    constructor() {
        super();
        this.state = {
            cities: cities
        };
    }

    componentDidMount() {
        this.textInput.addEventListener('input', (e) => {
            const reg = new RegExp(e.target.value);
            const citiesList = cities.filter((city, idx) => reg.test(city.City));

            this.setState({
                cities: citiesList
            });
        }, true);
    }

    render() {
        let cities = this.state.cities.map((city, idx) => <li key={idx}>{city.City}</li>);

        return (
          <div>
              <input
                placeholder="Введите или выберите из списка"
                ref={(input) => { this.textInput = input; }}
                type="text"
              />
              <ul>
                  {cities}
              </ul>
          </div>
        );
    }
}

export default ComboBox