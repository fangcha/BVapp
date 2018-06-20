import firebase from 'firebase'
import 'firebase/firestore'

const config = {
  apiKey: "AIzaSyBzCjB-fL24VUMSPe4F8TIj68Gd7EuHn5M",
  authDomain: "boardville-e6586.firebaseapp.com",
  databaseURL: "https://boardville-e6586.firebaseio.com",
  projectId: "boardville-e6586",
  storageBucket: "boardville-e6586.appspot.com",
  messagingSenderId: "825725561073"
};
firebase.initializeApp(config);

export default firebase

export function calculate(snapshot) {
  let totalCost = Object.entries(snapshot.val()).map(([key, value]) => {
    let eachItem = value.substr(value.indexOf(':') + 1)
    let eachItemCost = parseInt(eachItem, 10)
    return eachItemCost
  }).reduce((a, eachItemCost) => a + eachItemCost, 0)
  return totalCost
};