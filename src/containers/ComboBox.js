import React, {Component} from 'react'
import List from './List'
import axios from 'axios';

class ComboBox extends Component {
    constructor() {
        super();

        this.fetchData = (regexp = / /) => {
            this.setState({
                preload: true,
                listVisible: false
            });
            axios.get('kladr.json')
              .then((res) => {
                  let filteredCities = res.data.Cities.filter((city, idx) => regexp.test(city.City));
                  this.setState({
                      cities: filteredCities,
                      preload: true,
                      listVisible: !this.state.error,
                      focusedElementId: 0,
                      failedRequest: false,
                      error: false
                  });
                  setTimeout(() => {
                      this.setState({
                          preload: false
                      })
                  }, 1000)
              })
              .catch((e) => {
                  this.setState({
                      failedRequest: true,
                      listVisible: true
                  });
                  setTimeout(() => {
                      this.setState({
                          preload: false
                      })
                  }, 1000)
              });
        };

        this.state = {
            cities: [],
            listVisible: false,
            focusedElementId: -1,
            error: false,
            preload: false,
            failedRequest: false
        };
    }

    componentDidMount() {
        this.positionMenu();
        window.onresize = () => this.positionMenu();

        this.textInput.oninput = (e) => {
            const regexp = new RegExp(e.target.value, 'i');
            this.fetchData(regexp);
        };

        this.textInput.onfocus = (e) => {
            if (this.state.focusedElementId) {
                this.textInput.select();
            }

            if (!this.state.cities.length) {
                this.fetchData();
            } else {
                this.setState({
                    listVisible: true
                });
            }

            if (this.listItem) {
                this.selectMenu.scrollTop = this.listItem.offsetTop;
            }
        };

        this.textInput.onblur = (e) => {
            if (!this.state.cities.length && !this.state.preload) {
                this.setState({
                    error: true,
                });
            } else {
                if (e.target.value === this.state.cities[0].City) {
                    e.target.value = this.state.cities[this.state.focusedElementId].City;
                    this.setState({
                        error: true,
                        focusedElementId: 1
                    });
                }
            }

            this.setState({
                listVisible: false
            })
        };

        this.textInput.onkeydown = (e) => {
            switch (e.keyCode) {
                case 40:
                    if (this.state.focusedElementId < this.state.cities.length - 1) {
                        this.setState({
                            focusedElementId: this.state.focusedElementId + 1
                        });
                    }
                    break;
                case 38:
                    if (this.state.focusedElementId > 0) {
                        this.setState({
                            focusedElementId: this.state.focusedElementId - 1
                        });
                    }
                    break;
                case 27:
                    this.setState({
                        listVisible: false
                    });
                    break;
                case 13:
                    if (!this.state.preload) {
                        this.setState({
                            listVisible: false
                        });

                        if (this.state.cities.length) {
                            e.target.value = this.state.cities[this.state.focusedElementId].City;
                            this.nextInput.focus();
                        }
                    }
                    break;
                default:
                    break;
            }
        };
    }

    toggleList() {
        this.setState({
            listVisible: !this.state.listVisible
        })
    }

    handleClick(e, idx) {
        this.textInput.value = e.target.innerHTML;
        this.setState({
            focusedElementId: idx,
            error: false
        });
    }

    positionMenu() {
        if ((document.documentElement.clientHeight - this.textInput.getBoundingClientRect().bottom) < 200) {
            this.selectMenu.classList.add('top');
        } else {
            this.selectMenu.classList.remove('top');
        }
    }

    render() {
        return (
          <div className="form-wrapper">
              <div className="autocomplete">
                  <div className={"input-wrapper " + ((this.state.error && !this.state.failedRequest) ? 'error' : '')}>
                      <input
                        placeholder="Введите или выберите из списка"
                        ref={(input) => {
                            this.textInput = input;
                        }}
                        type="text"
                      />
                      <p className="input-box__error-message">
                          Выберите значение из списка
                      </p>
                      <div className={'input-wrapper__controls ' + ((this.state.preload) ? 'preload' : '')}>
                          <button
                            className="controls__toggle"
                            onClick={this.toggleList.bind(this)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20.308" height="20.309"
                                   viewBox="0 0 404.308 404.309">
                                  <path d="M0 101.08h404.308l-202.157 202.149-202.151-202.149z"/>
                              </svg>
                          </button>
                          <div className="controls__loader"/>
                      </div>
                  </div>
                  <div
                    className="list-wrapper"
                    ref={(div) => {
                        this.selectMenu = div;
                    }}
                    style={
                        {display: (this.state.listVisible) ? 'block' : 'none'}
                    }>
                      <List
                        id={this.state.focusedElementId}
                        cities={this.state.cities}
                        onMouseDown={this.handleClick.bind(this)}
                        listVisible={this.state.listVisible}
                        fail={this.state.failedRequest}
                        fetchData={this.fetchData}
                        listRef={item => this.listItem = item}
                        preload={this.state.preload}
                      />
                  </div>
              </div>
              <input
                ref={(input) => {
                    this.nextInput = input;
                }}
                placeholder="Еще один input для тестирования"
                type="text"
              />
          </div>
        );
    }
}

export default ComboBox
