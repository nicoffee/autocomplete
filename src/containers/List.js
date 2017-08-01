import React, {Component} from 'react'
import ListItem from './../components/ListItem'

class List extends Component {
    render() {
        let cities = this.props.cities.map(
          (city, idx) =>
            <ListItem
              key={idx}
              idx={idx}
              focusedId={this.props.id}
              onClick={this.props.onClick}
            >
                {city.City}
            </ListItem>
        );

        if (!this.props.cities.length && !this.props.fail) {
            return (
              <ul>
                  <li className="error">
                      Не найдено
                  </li>
              </ul>
            );
        }

        if (this.props.fail) {
            return (
              <ul>
                  <li className="error">
                      Что-то пошло не так. Проверьте соединение с интернетом и попробуйте еще раз
                  </li>
                  <li
                    ref={(li) => {
                      this.updateRequest = li;
                  }}
                    onClick={() => this.props.fetchData()}
                  >Обновить</li>
              </ul>
            );
        }

        return <ul>{cities}</ul>;
    }
}

export default List;