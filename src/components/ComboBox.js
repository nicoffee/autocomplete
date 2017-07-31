import React, {Component} from 'react'

const ListItem = (props) => {
    return (+props.idx === props.focusedId) ?
        <li className="focused" onClick={props.onClick}>
            {props.children}
        </li> : <li onClick={props.onClick}>
            {props.children}
        </li>
};

class List extends Component {
    constructor(props) {
        super(props);
    }

    handleClick(e) {
        console.log('click', e);
    }

    render() {
        let cities = this.props.cities.map(
            (city, idx) =>
                <ListItem
                    key={idx}
                    idx={idx}
                    focusedId={this.props.id}
                    onClick={(e) => this.handleClick}
                >
                    {city.City}
                </ListItem>
        );

        if (!this.props.cities.length) {
            return (
                <ul>
                    <li className="">Не найдено</li>
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
            preload: false
        };
    }

    componentDidMount() {
        this.positionMenu();
        window.onresize = () => this.positionMenu();

        this.textInput.oninput = (e) => {
            const reg = new RegExp(e.target.value, 'i');

            fetch('http://localhost:3006/kladr.json').then((response) => {
                this.setState({
                    preload: true
                });
                return response.json();
            }).then((myBlob) => {
                let filtredCities = myBlob.Cities.filter((city, idx) => reg.test(city.City));

                this.setState({
                    cities: filtredCities,
                    preload: false,
                    listVisible: true,
                    focusedElementId: 0,
                    error: false
                });
            });
        };

        this.textInput.onblur = (e) => {
            if (!this.state.cities.length) {
                this.setState({
                    listVisible: false,
                    error: true
                });
            }



            console.log('this.state.cities', );

            if (e.target.value === this.state.cities[0].City) {
                e.target.value = this.state.cities[this.state.focusedElementId].City;
            }

            //e.target.value = this.state.cities[this.state.focusedElementId].City;
        };

        this.textInput.onfocus = (e) => {
            const reg = new RegExp(e.target.value, 'i');

            fetch('http://localhost:3006/kladr.json').then((response) => {
                this.setState({
                    preload: true
                });
                return response.json();
            }).then((myBlob) => {
                let filteredCities = myBlob.Cities.filter((city, idx) => reg.test(city.City));

                this.setState({
                    cities: filteredCities,
                    preload: false,
                    listVisible: true,
                    focusedElementId: 0,
                    error: false
                });
            });
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
                    this.setState({
                        listVisible: false
                    });

                    if (this.state.cities.length) {
                        e.target.value = this.state.cities[this.state.focusedElementId].City;
                        this.nextInput.focus();
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
