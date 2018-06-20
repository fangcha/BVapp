import React, { Component } from 'react'
import firebase from '../helpers/firebase'

class ActiveUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: []
        }
        this.onIdClick = this.onIdClick.bind(this)
    };
    componentDidMount() {
        firebase.database().ref('active').orderByValue().on('value', snapshot => {
            let id = []
            snapshot.val() && Object.entries(snapshot.val()).map(([key, value]) => id.push(value))
            this.setState({ id: id })
        })
    }

    onIdClick (id) {
        this.props.onCurrentUserChange(id)
    }
    render() {
        const activeUser = this.state.id.map((id, i) => {
            return (
                    <button key={i+1} onClick={() => this.onIdClick(id)}> {id} </button>
            )
        })
        var style = {
            textAlign: 'center'
        }
        return (
            <div>
                <div style={style}><h2>Active Users</h2></div>
                <div className='active-btn'>{activeUser}</div>
            </div>
        )
    }

};

export default ActiveUser