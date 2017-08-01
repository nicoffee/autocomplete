import React, {Component} from 'react'

const ListItem = (props) => {
    return (+props.idx === props.focusedId) ?
        <li
            className="focused"
            onClick={ (e) => props.onClick(e, props.idx) }
        >
            {props.children}
        </li> :
        <li onClick={ (e) => props.onClick(e, props.idx) }>
            {props.children}
        </li>
};

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
                    <li className="">Не найдено</li>
                </ul>
            );
        }

        if (this.props.fail) {
            return (
              <ul>
                  <li className="">Что-то пошло не так. Проверьте соединение с интернетом и попробуйте еще раз</li>
                  <li>Обновить</li>
              </ul>
            );
        }

        return <ul>{cities}</ul>;
    }
}

class ComboBox extends Component {
    constructor() {
        super();

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
        let cities = [];
        this.positionMenu();
        window.onresize = () => this.positionMenu();

        const request = (regexp) => {
            fetch('http://localhost:3006/kladr12.json').then((response) => {
                this.setState({
                    preload: true
                });
                return response.json();
            }).then((myBlob) => {
                let filtredCities = myBlob.Cities.filter((city, idx) => regexp.test(city.City));

                this.setState({
                    cities: filtredCities,
                    preload: false,
                    listVisible: true,
                    focusedElementId: 0,
                    error: false
                });
            }).catch((e) => {
                console.log('err');

                this.setState({
                    failedRequest: true,
                    preload: false
                });
            });
        };

        // fetch('http://localhost:3006/kladr1.json').then((response) => {
        //     setTimeout(this.setState({
        //         preload: true
        //     }), 1000);
        //
        //     return response.json();
        // }).then((myBlob) => {
        //     // let filteredCities = myBlob.Cities.filter((city, idx) => reg.test(city.City));
        //
        //     cities = myBlob.Cities;
        //
        //     setTimeout(() => {
        //         this.setState({
        //         cities: cities,
        //         preload: false,
        //     })}, 1000);
        // });

        this.textInput.oninput = (e) => {
            console.log(e);

            const regexp = new RegExp(e.target.value, 'i');
            request(regexp);

            // this.setState({
            //     cities: cities.filter((city, idx) => reg.test(city.City))
            // });

            // fetch('http://localhost:3006/kladr12.json').then((response) => {
            //     this.setState({
            //         preload: true
            //     });
            //     return response.json();
            // }).then((myBlob) => {
            //     let filtredCities = myBlob.Cities.filter((city, idx) => reg.test(city.City));
            //
            //     this.setState({
            //         cities: filtredCities,
            //         preload: false,
            //         listVisible: true,
            //         focusedElementId: 0,
            //         error: false
            //     });
            // }).catch(() => {
            //     this.setState({
            //         failedRequest: true,
            //     });
            // });
        };

        this.textInput.onfocus = (e) => {
            const regexp = new RegExp(e.target.value, 'i');
            request(regexp);

            // this.setState({
            //     cities: this.state.cities.filter((city, idx) => reg.test(city.City)),
            //     focusedElementId: 0,
            //     listVisible: true,
            //     error: false
            // });

            // fetch('http://localhost:3006/kladr.json').then((response) => {
            //     setTimeout(this.setState({
            //         preload: true
            //     }), 1000);
            //
            //     return response.json();
            // }).then((myBlob) => {
            //     console.log('myBlob.Cities', myBlob.Cities);
            //
            //     let filteredCities = myBlob.Cities.filter((city, idx) => reg.test(city.City));
            //
            //     console.log('filteredCities', filteredCities);
            //
            //     setTimeout(() => {this.setState({
            //         cities: filteredCities,
            //         preload: false,
            //         listVisible: true,
            //         focusedElementId: 0,
            //         error: false
            //     })}, 1000);
            // }).catch(function() {
            //     this.setState({
            //         failedRequest: true,
            //     });
            // });
        };

        this.textInput.onblur = (e) => {
            if (!this.state.cities.length) {
                this.setState({
                    error: true,
                });
            } else {
                if (e.target.value === this.state.cities[0].City) {
                    e.target.value = this.state.cities[this.state.focusedElementId].City;
                }
            }

            setTimeout(() => this.setState({
                listVisible: false
            }), 100);
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
            }
        };
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

    handleClick(e, idx) {
        this.textInput.value = e.target.innerHTML
        this.setState({
            focusedElementId: idx
        });
    }

    stopPageScroll() {
        document.body.classList.add('no-scroll');
    }

    startPageScroll() {
        document.body.classList.remove('no-scroll');
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
                    <div
                        className={"input-wrapper " + ((this.state.error) ? 'error' : '')}
                    >
                        <input
                            placeholder="Введите или выберите из списка"
                            ref={(input) => {
                                this.textInput = input;
                            }}

                            type="text"
                        />
                        <p className="error-helper">
                            Выберите значение из списка ниже
                        </p>
                        <div className={'input-wrapper__state ' + ((this.state.preload) ? 'preload' : '')}>
                            <button
                                className="select__toggle"
                                onClick={this.toggleList.bind(this)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20.308" height="20.309"
                                     viewBox="0 0 404.308 404.309">
                                    <path d="M0 101.08h404.308l-202.157 202.149-202.151-202.149z"/>
                                </svg>
                            </button>
                            <div className="loader"></div>
                        </div>
                    </div>
                    <div
                        ref={(div) => {
                            this.selectMenu = div;
                        }}
                        onMouseOver={this.stopPageScroll}
                        onMouseLeave={this.startPageScroll}
                        className="select__menu"
                        style={
                            {display: (this.state.listVisible) ? 'block' : 'none'}
                        }
                    >
                        <List
                            id={this.state.focusedElementId}
                            cities={this.state.cities}
                            onClick={this.handleClick.bind(this)}
                            fail={this.state.failedRequest}
                        />
                    </div>
                </div>
                <input
                    ref={(input) => {
                        this.nextInput = input;
                    }}
                    type="text"
                />
            </div>
        );
    }
}

export default ComboBox
