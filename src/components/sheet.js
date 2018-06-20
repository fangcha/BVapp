import React, { Component } from 'react'
import config from '../helpers/config'
import firebase from '../helpers/firebase'

var gapi = window.gapi

class Sheet extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isSignedIn: false
    }

    this.handleSignInClick = this.handleSignInClick.bind(this)
    this.handleSignOutClick = this.handleSignOutClick.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.updateSigninStatus = this.updateSigninStatus.bind(this)
    this.write = this.write.bind(this)
    this.onWrite = this.onWrite.bind(this)
  }

  componentWillMount() {
    // Loads the client library and the auth2 library together for efficiency.
    // Loading the auth2 library is optional here since `gapi.client.init` function will load
    // it if not already loaded. Loading it upfront can save one network request.
    gapi.load("client:auth2", this.initClient);
  }

  initClient = () => {
    // Initialize the client with API key and Sheets API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    gapi.client.init({
      apiKey: config.apiKey,
      discoveryDocs: config.discoveryDocs,
      clientId: config.clientId,
      scope: 'https://www.googleapis.com/auth/spreadsheets'
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  };

  updateSigninStatus(isSignedIn) {
    // When signin status changes, this function is called.
    if (isSignedIn) {
      this.setState({ isSignedIn: true })
    }
  }

  handleSignInClick(event) {
    // Ideally the button should only show up after gapi.client.init finishes, so that this
    // handler won't be called before OAuth is initialized.
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    this.setState({ isSignedIn: false })
  }

  handleSaveClick() {
    if (this.props.currentUser.food === 0 && this.props.currentUser.hr === 0) {
      window.alert('No Items to Save!')
    } else {
      let date = new Date(Date.now())
      date = date.toLocaleDateString('en-GB')
      let id = this.props.currentUser.id
      let hr = this.props.currentUser.hr
      let game = ''
      let food = this.props.currentUser.food
      let total = hr + food
      if (this.props.currentUser.foodItems) {
        var foodItems = Object.entries(this.props.currentUser.foodItems).map(([key, value]) => { return value }).join(', ')
      } else { 
        foodItems = ''
      }
      let value = [
        [date, id, hr, game, food, total, foodItems]
      ]
      this.write(value, this.onWrite)
    }
  }

  write(value, callback) {
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: 'Sheet1',
      majorDimension: 'ROWS',
      valueInputOption: 'RAW',
      values: value
    }).then(callback);
  }

  onWrite() {
    let id = this.props.currentUser.id
    firebase.database().ref(`user${id}`).set({
      id: this.props.currentUser.id,
      startMs: 0,
      startTime: 0,
      stopTime: 0,
      extra: 0,
      food: 0,
      hr: 0,
      totalTime: '0 Hr. 0 Min.'
    })
    firebase.database().ref('active').child(id).remove()
    window.alert('Save Successful!')


  }


  render() {
    return (
      <div>
        {this.state.isSignedIn ?
          (<button onClick={this.handleSignOutClick}>Sign Out</button>) :
          (<button onClick={this.handleSignInClick}>Sign In</button>)
        }
        {this.props.currentUser && this.state.isSignedIn && this.props.currentUser.active ?
          (<button onClick={this.handleSaveClick}>Save</button>) : null}
      </div>
    );
  }
}

export default Sheet;