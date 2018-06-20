import React from 'react'
import firebase, { calculate } from '../helpers/firebase'

const UserDetail = ({ currentUser }) => {
    if (!currentUser) {
        return <div>Input Customer ID...</div>
    }
    // Food List
    if (currentUser.foodItems) {
        var food = Object.entries(currentUser.foodItems).map(([key, value]) => {
            return <li key={key}> {value}
                <button onClick={() => {
                    let Ref = firebase.database().ref(`user${currentUser.id}`)
                    Ref.child(`foodItems/${key}`).remove()
                        .then(() => {
                            Ref.child('foodItems').once('value')
                                .then(snapshot => calculate(snapshot))
                                .then(totalCost => { Ref.update({ food: totalCost }) })
                                .catch(() => {
                                    Ref.update({ food: 0 })
                                })
                        })
                        .catch((error) => {
                            console.log('Remove Failed:' + error.message)
                        })
                }}>Remove</button>
            </li>
        })
    }
    else {
        food = 'No Food'
    };
    // End Food List

    // Play Time
    if (currentUser.hrItems) {
        var hr = Object.entries(currentUser.hrItems).map(([key, value]) => {
            return <li key={key}> {value}
                <button onClick={() => {
                    let Ref = firebase.database().ref(`user${currentUser.id}`)
                    Ref.child(`hrItems/${key}`).remove()
                        .then(() => {
                            Ref.child('hrItems').once('value')
                                .then(snapshot => calculate(snapshot))
                                .then(totalCost => { Ref.update({ hr: totalCost }) })
                                .catch(() => {
                                    Ref.update({ hr: 0 })
                                })
                        })
                        .catch((error) => {
                            console.log('Remove Failed:' + error.message)
                        })
                }}>Remove</button>
            </li>
        })
    }
    else {
        hr = 'No Hr'
    }
    // End Play Time

    return (
        <div>
            <h2> Customer ID : {currentUser.id} </h2>
            <p> Name : {currentUser.name} </p>
            <p> Start Time : {currentUser.startTime} </p>
            <p> Stop Time : {currentUser.stopTime} </p>
            <p> Extra Time : {currentUser.extra} </p>
            <p> Total Time : {currentUser.totalTime} </p>
            <ul> Play Time : {hr} </ul>
            <ul> Food : {food} </ul>
            <p> Total : {currentUser.food + currentUser.hr} Baht </p>
        </div>
    );
};

export default UserDetail