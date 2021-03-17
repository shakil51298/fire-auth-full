import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';

//initilize
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}


function App() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    photo: '',
    email: '',
    error: ''
  })
  const GoogleProvider = new firebase.auth.GoogleAuthProvider();
  //handler 
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(GoogleProvider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signInUSer = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          error: ''
        }
        setUser(signInUSer)
      })
      .catch((error) => {
        // var errorCode = error.code;
        var errorMessage = error.message;
        // var email = error.email;
        // var credential = error.credential;
        console.log(errorMessage);
      });
  }
  // handler sign out
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(() => {
        const signOutUser = {
          isSignIn: false,
          name: '',
          email: '',
          photo: '',
        }
        setUser(signOutUser)
      })
      .catch(err => {
        console.log(err);
      })
  }
  //handler for input form value
  const handleOnBlur = (e) => {
    let isFeildValid;
    if (e.target.name === "email") {
      isFeildValid = /\S+@\S+\.\S+/.test(e.target.value)
    }
    if (e.target.name === "password") {
      const passLenght = e.target.value.length > 6;
      const isPassValid = /\d{1}/.test(e.target.value)
      isFeildValid = passLenght && isPassValid;
    }
    if (e.target.name === "name") {
      isFeildValid = e.target.value;
    }
    if (isFeildValid) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }

  const handleSubmit = (e) => {
    // console.log(user);
    if (newUser && user.email && user.password) {
      // console.log('logging in');
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          // var user = res.user;
          const newUserInfo = { ...user }
          newUserInfo.success = true;
          newUserInfo.error = "";
          updateUserName(user.name)
          setUser(newUserInfo)
          console.log(res);
        })
        .catch(error => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message
          newUserInfo.success = false
          setUser(newUserInfo)
        });
    }
    if (!newUser && user.email && user.password) {

      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user }
          newUserInfo.success = true;
          newUserInfo.error = "";
          console.log(res);
          setUser(newUserInfo)
        })
        .catch((error) => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message
          newUserInfo.success = false
          setUser(newUserInfo)
        });
      console.log('shakil khan');
    }
    e.preventDefault();

  }
  const updateUserName = name => {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name,
    })
    .then(res =>{
        console.log("Name Updated successfully");
    }).catch( error => {
      console.log(error);
    });
    console.log(name);
  }
  return (
    <div className="container mt-5">
      <div className="text-center">
        {
          user.isSignIn ? <button className="btn btn-primary" onClick={handleSignOut}> Sign Out</button> :
            <button className="btn btn-primary" onClick={handleSignIn}> Sign In</button>
        }
      </div>

      {
        user.isSignIn && <div>
          <p>wellcome {user.name}</p>
          <p > {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h4 className="mt-3">Our own Authentication</h4>
      {/* error message */}
      <p className="" style={{ color: 'red' }}>{user.error}</p>

      {
        user.success && <p className="" style={{ color: 'green' }}>
          user{newUser ? " created" : " SIgn in"} succesfully</p>
      }

      {/* form */}
      <form className="container mt-5" onSubmit={handleSubmit}>
        <div className="mb-3 form-check">
          <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" for="exampleCheck1">New User Sign Up</label>
        </div>
        <div className="mb-3 ">
          {
            newUser && <span>
              <label className="from-label" htmlFor="">Name</label>
              <input type="name" onBlur={handleOnBlur} className="form-control" name="name" id="" required />
            </span>
          }
          <label className="from-label" htmlFor="">Email Address</label>
          <input type="email" onBlur={handleOnBlur} className="form-control" name="email" id="" required />
          <div className="form-text">
            We'll never share your email
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="" required>Password</label>
            <input className='form-control' onBlur={handleOnBlur} name="password" type="password" />
          </div>
          <div className="mb-3 form-check">
            <button type="submit" class="btn btn-primary">{newUser ? " Sign up" : " Sign in"}</button>
            <button type="reset" class="btn btn-primary ml-2">Reset</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
