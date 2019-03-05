import React, { Component } from 'react';
import { without } from 'lodash';

import './css/App.css';

import AddAppointments from './components/AddAppointments';
import ListAppointments from './components/ListAppointments';
import SearchAppointments from './components/SearchAppointments';

class App extends Component {
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      lastIndex: 0,
      formDisplay: false
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
                  <SearchAppointments />
                  <ListAppointments
                    appointments={this.state.myAppointments}
                    deleteAppointment={this.onDeleteAppointment}
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
