import React, { Component } from 'react'
// import './App.css'
import InputBar from './components/input_bar'
import UserDetail from './components/user_detail'
import ActionList from './components/action_list'
import Sheet from './components/sheet'
import ActiveUser from './components/active_user'
import firebase from './helpers/firebase'

// const firestore = firebase.firestore();

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: null
      // firestore: []
    }
  };

  // testFirestore() {
  //   return (
  //     firestore.doc('users/001').get().then(doc => {
  //       if (doc.exists) {
  //         let data = Object.entries(doc.data()).map(([key, value]) => {
  //           return <li key={key}>{key} : {value}</li>
  //         })
  //         this.setState({ firestore: data })
  //       } else {
  //         console.log('no document')
  //       }
  //     }).catch(error => {
  //       console.log("Error getting:", error)
  //     }
  //       )
  //   )
  // }

  currentUser(id) {
    firebase.database().ref(`user${id}`).on('value', (snapshot) => {
      this.setState({ currentUser: snapshot.val() })
    })
  };

  render() {
    return (
      <div className='app'>
        <header>
          <div className='header'>
            <div><h1>BoardVille In-Store Application</h1></div>
            <div className='sheet'>
              <Sheet currentUser={this.state.currentUser} />
            </div>
          </div>
        </header>
        <div className='container'>

          <div className='active-user'>
            <ActiveUser onCurrentUserChange={id => this.currentUser(id)} />
          </div>

          <div className='input-bar'>
            <InputBar onCurrentUserChange={id => this.currentUser(id)} />
          </div>

          <div className='user-detail'>
            <UserDetail currentUser={this.state.currentUser} />
            {/* <div className='wrapper'>
              <button onClick={() => this.testFirestore()}>Firestore</button>
              {this.state.firestore}
            </div> */}
          </div>

          <div className='action-list'>
            <ActionList currentUser={this.state.currentUser} />
          </div>

        </div>
      </div>
    )
  }
};

export default App
