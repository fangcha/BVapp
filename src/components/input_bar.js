import React, { Component } from 'react';
// import firebase from '../firebase'

class InputBar extends Component {
    constructor (props) {
    super (props)
    this.state = {id : ''}
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
    // this.onCreateUser = this.onCreateUser.bind(this)
    }

    render () {
        return (
            <div>
            <form onSubmit={this.handleSubmit}>
                <input autoFocus 
                autoComplete ='off'
                type='text' 
                name='id' 
                placeholder='Customer ID' 
                value={this.state.id}
                onChange={this.onInputChange}
                onClick={this.onFocus} />
            </form>
            {/* <button onClick={() => this.onCreateUser(this.state.id)}>Create User</button> */}
            </div>
        )
    }
    handleSubmit(event) {
        event.preventDefault()
        this.props.onCurrentUserChange(this.state.id)
        this.setState({ id : this.state.id })
    };
    onInputChange(event) {
        this.setState({ id : event.target.value }) 
    };

    onFocus() {
        this.setState({ id : '' })
    };

    // onCreateUser(id) {
    //     firebase.database().ref(`user${id}`).set({
    //         id : id,
    //         startMs : 111,
    //         startTime : 'Click Start Timer',
    //         stopTime : 'Click Stop Timer',
    //         total : 0,
    //         totalTime : '0 Hr. 0 Min.'
    //     })
    // }
}   
export default InputBar;