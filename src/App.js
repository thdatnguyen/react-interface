import React, { Component } from 'react';
import { without, findIndex } from 'lodash';

import './css/App.css';

import 'jquery/dist/jquery';
import 'popper.js/dist/umd/popper';
import 'bootstrap/dist/js/bootstrap';

import AddAppointments from './components/AddAppointments';
import ListAppointments from './components/ListAppointments';
import SearchAppointments from './components/SearchAppointments';

class App extends Component {
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      lastIndex: 0,
      query: ''
    };
  }

  onDeleteAppointment = apt => {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);
    this.setState({
      myAppointments: tempApts
    });
  };

  onAddAppointment = apt => {
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    });
  };

  onToggleForm = () => {
    this.setState({
      formDisplay: !this.state.formDisplay
    });
  };

  onChangeOrder = (orderBy, orderDir) => {
    this.setState({
      orderBy,
      orderDir
    });
  };

  onChangeInput = query => {
    this.setState({
      query
    });
  };

  onUpdateInfo = (name, value, id) => {
    let tempApts = [...this.state.myAppointments];
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId: id
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApts
    });
  };

  componentDidMount() {
    fetch('./data.json')
      .then(data => data.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({
            lastIndex: this.state.lastIndex + 1
          });
          return item;
        });
        this.setState({
          myAppointments: apts
        });
      });
  }

  render() {
    let order;
    let filterApts = this.state.myAppointments;
    if (this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }
    filterApts = filterApts
      .sort((a, b) => {
        if (
          a[this.state.orderBy].toLowerCase() <
          b[this.state.orderBy].toLowerCase()
        ) {
          return -1 * order;
        } else {
          return 1 * order;
        }
      })
      .filter(item => {
        return (
          item['petName']
            .toLowerCase()
            .includes(this.state.query.toLowerCase()) ||
          item['ownerName']
            .toLowerCase()
            .includes(this.state.query.toLowerCase()) ||
          item['aptNotes']
            .toLowerCase()
            .includes(this.state.query.toLowerCase())
        );
      });
    return (
      <div className="App">
        <main className="page bg-white" id="petratings">
          <div className="container">
            <div className="row">
              <div className="col-md-12 bg-white">
                <div className="container">
                  <AddAppointments
                    addAppointment={this.onAddAppointment}
                    formDisplay={this.state.formDisplay}
                    toggleForm={this.onToggleForm}
                  />
                  <SearchAppointments
                    orderBy={this.state.orderBy}
                    orderDir={this.state.orderDir}
                    query={this.state.query}
                    changeOrder={this.onChangeOrder}
                    changeInput={this.onChangeInput}
                  />
                  <ListAppointments
                    appointments={filterApts}
                    deleteAppointment={this.onDeleteAppointment}
                    updateInfo={this.onUpdateInfo}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
