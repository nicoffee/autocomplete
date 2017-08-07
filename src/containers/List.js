import React, {Component} from 'react'
import ListItem from './../components/ListItem'

class List extends Component {

    render() {
        if (this.props.fail) {
            return (
              <ul>
                  <li className="error">
                      Что-то пошло не так. Проверьте соединение с интернетом и попробуйте еще раз
                  </li>
                  <li onMouseDown={() => this.props.fetchData()}>Обновить</li>
              </ul>
            );
        }

        if (!this.props.cities.length && !this.props.fail) {
            return (
              <ul>
                  <li className="error">
                      Не найдено
                  </li>
              </ul>
            );
        }

        let cities = this.props.cities.map(
          (city, idx) => {
              if (this.props.id === idx) {
                  return <ListItem
                    key={idx}
                    idx={idx}
                    focusedId={this.props.id}
                    onMouseDown={this.props.onMouseDown}
                    listRef={this.props.listRef}
                  >
                      {city.City}
                  </ListItem>
              }

              return <ListItem
                key={idx}
                idx={idx}
                focusedId={this.props.id}
                onMouseDown={this.props.onMouseDown}
              >
                  {city.City}
              </ListItem>
          }
        );

        return <ul>{cities}</ul>;
    }
}

export default List;