import React, {Component} from 'react'
import kladr from './kladr.json'

//let cities = kladr.slice(1, 10);

const ListItem = (props) => {
    return (+props.idx === props.focusedId) ?
        <li><b>{props.children}</b></li> :
        <li><i>{props.children}</i></li>
};

const List = (props) => {
    if (!props.children.length) {
        return <ul>
            <li>Не найдено</li>
        </ul>;
    }

    return <ul>{props.children}</ul>;
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
        fetch('http://localhost:3006/kladr.json').then((response) => {
            this.setState({
                preload: true
            });
            return response.json();
        }).then((myBlob) => {
            this.setState({
                cities: myBlob.Cities,
                preload: false
            });
        });


        this.positionMenu();

        let data;
        //fetch('http://localhost:3000/Cities').then((res) => {response = res.json()});
        //'http://localhost:3006/kladr.json'


        window.onresize = () => this.positionMenu();

        this.textInput.addEventListener('input', (e) => {
            const reg = new RegExp(e.target.value, 'i');
            const citiesList = this.state.cities.filter((city, idx) => reg.test(city.City));

            console.log(citiesList);

            //if (citiesList.length) {
            this.setState({
                cities: citiesList,
                listVisible: true,
                focusedElementId: 0,
                error: false
            });
            //}


        }, true);

        this.textInput.onblur = () => {
            if (!this.state.cities.length) {
                this.setState({
                    listVisible: false,
                    error: true
                });
            }
        };

        this.textInput.onfocus = () => {
            // const xhr = new XMLHttpRequest();
            //
            // xhr.open('GET', 'http://localhost:3006/kladr.json', true);
            //
            // this.setState({
            //     preload: true
            // });
            //
            // xhr.onload = function() {
            //     data = this.responseText;
            //     console.log('data', this);
            //     const dataCities = JSON.parse(data).Cities;
            //     this.setState({
            //         cities: dataCities,
            //         preload: false
            //     });
            // };
            //
            // xhr.send();
            //
            // requestData();

            // fetch('http://localhost:3006/kladr.json').then((response) => {
            //     this.setState({
            //         preload: true
            //     });
            //     return response.json();
            // }).then((myBlob) => {
            //     console.log('myBlob', myBlob);
            //     this.setState({
            //         cities: myBlob.Cities,
            //         preload: false
            //     });
            // });

            this.setState({
                listVisible: true
            });
        };

        this.textInput.addEventListener('keydown', (e) => {
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
            }

            if (e.keyCode === 13) {
                e.target.value = this.state.cities[this.state.focusedElementId].City;
                this.setState({
                    listVisible: false
                });
                this.nextInput.focus();
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

    stopPageScroll() {
        document.body.classList.add('no-scroll');
    }

    startPageScroll() {
        document.body.classList.remove('no-scroll');
    }

    positionMenu() {
        console.log('positionMenu');

        if ((document.documentElement.clientHeight - this.textInput.getBoundingClientRect().bottom) < 200) {
            console.log('1', this.selectMenu);
            this.selectMenu.classList.add('top');
        } else {
            console.log('2', this.selectMenu);
            this.selectMenu.classList.remove('top');
        }
    }

    render() {
        let cities = this.state.cities.map(
            (city, idx) => <ListItem key={idx} idx={idx} focusedId={this.state.focusedElementId}>{city.City}</ListItem>
        );

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
                        <p className="error-helper"></p>
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
                        <List id={this.state.focusedElementId}>
                            {cities}
                        </List>
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
