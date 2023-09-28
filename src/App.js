import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile, FacebookAuthProvider  } from "firebase/auth";
import initializeAuthentication from './firebase/firebase.initialize';
import { useState } from 'react';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

initializeAuthentication();

function App() {
  const [name, setName] = useState('');
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);
 
  const auth = getAuth();

  const handleGoogleSignIn= () => {
      signInWithPopup(auth, googleProvider)
      .then(result => {
        const {displayName, email, photoURL} = result.user;
        const loggedInUser = {
          name: displayName,
          email: email, 
          photo: photoURL
        };
        setUser(loggedInUser);
     
      })
      .catch(error =>{
        console.log(error.message);
      })
  }

  const handleGithubSignIn = () => {
      signInWithPopup(auth, githubProvider)
      .then( result => {
        const {displayName, photoURL, email} = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(loggedInUser);
        
      })
  }

  const handleFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
    .then(result => {
      const { displayName, photoURL, email} = result.user;
      console.log(result.user);
      const loggedInUser = {
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(loggedInUser);
    })
  }

  const handleSignOut = () => {
      signOut(auth)
      .then( () => {
        setUser({});
      })  
  }

  const toggleLogin = e => {
    setIsLogin(e.target.checked);
  }

  const handleNameChange = e => {
    setName(e.target.value);
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password);
    if(password.length < 8){
      setError('Password Must be at least 8 characters long.');
      return;
    }
    if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
      setError('Password Must contain 2 upper case');
      return;
    }
    // if(!/(?=.*[!@#$&*])/.test(password)){
    //   setError('Password Must contain one special case');
    //   return;
    // }
    // if(!/(?=.*[0-9].*[0-9])/.test(password)){
    //   setError('Password Must contain two digits');
    //   return;
    // }
    // if(!/(?=.*[a-z].*[a-z].*[a-z])/.test(password)){
    //   setError('Password Must contain three lowercase letters');
    //   return;
    // }
    
    // isLogin ? processLogin(email, password): registerNewUser(email, password);
    if(isLogin) {
      processLogin(email, password);
    }
    else{
      registerNewUser(email, password);
    }
  }

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      console.log(user);
      setError('');
    }) 
    .catch( error => {
      setError(error.message);
    })
  }

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      console.log(user);
      setError('');
      verifyEmail();
      setUserName();
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {displayName: name})
    .then(result => {})
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then( result => {
      console.log(result);
    })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
    .then(result => {})
  }

  return (
    <div className="mx-5">
      <form onSubmit={handleRegistration}>
        <h3 className="text-primary">Please {isLogin ? 'Login' : 'Register'}</h3>

        {!isLogin && <div class="row mb-3">
    <label for="inputAddress" className="col-sm-2 col-form-label">Name</label>
    <div className="col-sm-10">
    <input type="text" onBlur={handleNameChange} className="form-control" placeholder="Your name" />
    </div> 
  </div>}

  <div className="row mb-3">
    <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-10">
      <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
    </div>
  </div>
  <div className="row mb-3">
    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-10">
      <input type="password" onBlur={handlePasswordChange} className="form-control" id="inputPassword3" required />
    </div>
  </div>
  <div className="row mb-3">
    <div className="col-sm-10 offset-sm-2">
      <div className="form-check">
        <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
        <label className="form-check-label" htmlFor="gridCheck1">
          Already Registered?
        </label>
      </div>
    </div>
  </div>
  <div className="row mb-3 text-danger">{error}</div>
  <button type="submit" className="btn btn-primary">
    {isLogin ? 'Login' : 'Register'}
    </button>
    <button type="button" onClick={handleResetPassword} className="btn btn-secondary btn-sm">Reset Password</button>

</form>
      <br /><br /><br />
      <div>----------------------------</div>
      <br /><br /><br />
       { !user.name ?
         <div>
       <button onClick={handleGoogleSignIn}>Google Sign In</button>
       <button onClick={handleGithubSignIn}>Github Sign In</button>
       <button onClick={handleFacebookSignIn}>Facebook Sign In</button>
       </div> :
       <button onClick={handleSignOut}>Sign Out</button>
       }
       <br />
       {
          user.name && <div> 
            <h2>Welcome {user.name}</h2>
            <p>I know your email address: {user.email}</p>
            <img src={user.photo} alt="" />
          </div>
       }
    </div>
  );

  }
export default App;
