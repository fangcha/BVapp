import React, { Component } from 'react'
import firebase, { calculate } from '../helpers/firebase'

var drinks = [
    'Coke : 20',
    'Sprite : 20',
    'Ginger Ale : 20',
]

var hrRegular = {
    '1 Hr.' : '50',
    '1.5 Hr.' : '70',
    '2 Hr.' : '90',
    '2.5 Hr.' : '105',
    '3 Hr.' : '120',
    '3.5 Hr.' : '135',
    '4 Hr.+' : '150',
    'After Midnight' : '40'
}

class ActionList extends Component {
    constructor(props) {
        super(props)
        this.state = { input: '' }

        this.onItemClick = this.onItemClick.bind(this)
        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onEnable = this.onEnable.bind(this)
        this.onDisable = this.onDisable.bind(this)
    }

    startTimer() {
        let startTime = new Date(Date.now())
        let Ref = firebase.database().ref(`user${this.props.currentUser.id}`)
        let dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        Ref.update({
            startTime: `${startTime.toLocaleDateString('en-GB', dateOptions)} -- ${startTime.toLocaleTimeString()}`,
            startMs: startTime.getTime()
        })
    };

    stopTimer() {
        let stopTime = new Date(Date.now())
        let Ref = firebase.database().ref(`user${this.props.currentUser.id}`)
        let startTimeRef = Ref.child('startMs')
        let dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
        startTimeRef.once('value')
            .then(snapshot => {
                let start = snapshot.val()
                let total = stopTime.getTime() - start
                return total
            })
            .then(total => {
                let extra = parseInt(this.props.currentUser.extra, 10)
                let totalmins = (Math.floor((total / 1000) / 60)) + extra
                let h = Math.floor(totalmins / 60)
                let m = totalmins % 60
                Ref.update({
                    stopTime: `${stopTime.toLocaleDateString('en-GB', dateOptions)} -- ${stopTime.toLocaleTimeString()}`,
                    totalTime: `${h} Hr. ${m} Min.`
                })
            })
    };

    onItemClick(value, node) {
        if (!this.props.currentUser) {
            window.alert('Input User!')
            return null
        }
        
        let Ref = firebase.database().ref(`user${this.props.currentUser.id}`)
        Ref.child(`${node}Items`).push(value)
        Ref.child(`${node}Items`).once('value')
            .then(snapshot => calculate(snapshot))
            .then(totalCost => { Ref.update({ [node]: totalCost }) })
            .catch(() => {
                console.log(`No ${node}`)
                Ref.update({ [node]: 0 })
            })
    }

    onInputChange(event) {
        this.setState({ input: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault()
        firebase.database().ref(`user${this.props.currentUser.id}`).update({ extra: this.state.input })
    }

    onEnable() {
        let id = this.props.currentUser.id
        firebase.database().ref('active').update({ [id]: this.props.currentUser.id })
        firebase.database().ref(`user${this.props.currentUser.id}`).update({ active: 'yes' })
    }

    onDisable() {
        let id = this.props.currentUser.id
        if (this.props.currentUser.startTime !== 0 || this.props.currentUser.food !==0 || this.props.currentUser.hr !==0) {
            var r = window.confirm(`There are Items!\nAre you sure you want to Disable?`)
            if (r === true) {
                firebase.database().ref('active').child(id).remove()
                firebase.database().ref(`user${this.props.currentUser.id}`).child('active').remove()
            }
        } else {
            firebase.database().ref('active').child(id).remove()
            firebase.database().ref(`user${this.props.currentUser.id}`).child('active').remove()
        }
    }

    render() {
        const drinksList = drinks.map((value, i) => {
            return <button key={i+1} onClick={() => this.onItemClick(value, 'food')}>
                {value.substr(0, value.indexOf(':'))}
            </button>
        })
        const hrRegularList = Object.entries(hrRegular).map(([key,value], i) => {
            return <button key={i+1} onClick={() => this.onItemClick(`${key} : ${value}`, 'hr')}>
                {key}
            </button>
        })
        return (
            <div>
                {this.props.currentUser ?
                    this.props.currentUser.active ? (
                        <div>
                            <div className='timer'>
                                <button onClick={this.startTimer}> Start Timer </button>
                                <button onClick={this.stopTimer}> Stop Timer </button>
                                <form onSubmit={this.handleSubmit}>
                                    <input autoComplete='off'
                                        type='number'
                                        name='extra-time'
                                        id='extra'
                                        placeholder='Extra Time'
                                        value={this.state.input}
                                        onChange={this.onInputChange} />
                                </form>
                            </div>
                            <div>
                                {drinksList}
                                {hrRegularList}
                            </div>
                            <div>
                                <button onClick={this.onDisable}> Disable </button>
                            </div>
                        </div>) :
                        <div>
                            <button onClick={this.onEnable}>
                                Enable</button>
                        </div>
                    : null}
            </div>
        )
    }
}

export default ActionList