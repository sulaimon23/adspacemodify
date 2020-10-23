import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/performance";
import { ExpansionPanel } from "@material-ui/core";
import "firebase/storage";
require("firebase/firestore");
require("firebase/analytics");

let db,storage, perf;
export const init = () => {
  let config = {
    apiKey: "AIzaSyAov3mPXQIHFI652WciZwe9Wfdi3GqaozQ",
    authDomain: "adspaceprod-11ddc.firebaseapp.com",
    databaseURL: "https://adspaceprod-11ddc.firebaseio.com",
    projectId: "adspaceprod-11ddc",
    storageBucket: "adspaceprod-11ddc.appspot.com",
    messagingSenderId: "990438097586",
    appId: "1:990438097586:web:0953a720d3c8b9cd0fbfab",
    measurementId: "G-VL1FELTFRL",
  };
  firebase.initializeApp(config);
  db = firebase.firestore();
  storage = firebase.storage();
  perf = firebase.performance();
  firebase.analytics();
};

export const getDb = () => {
  return db;
};
export const Storage = () => {
  return storage;
};

export const firebaseObject = () => {
  return firebase;
};

export const getTimestamp = (date) => {
  if (date) return firebase.firestore.Timestamp.fromDate(date);
  else return firebase.firestore.Timestamp.fromDate(new Date());
};

export const getDocumentId = () => {
  return firebase.firestore.FieldPath.documentId();
};


export const getAuth = () => {
  return firebase.auth();
};

export const userLogin = async (email, password) => {
  try {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return { err: null, user };
  } catch (e) {
    console.log(e);
    return { err: e, user: null };
  }
};

export const userLogout = async () => {
  await firebase.auth().signOut();
};

export const createUser = async (email, password) => {
  try {
    let user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    return { err: null, user };
  } catch (e) {
    console.log(e);
    return { err: e, user: null };
  }
};
