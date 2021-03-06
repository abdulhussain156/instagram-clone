import './App.css';
import React, { useState, useEffect } from 'react';
import logo from "./logo.png";
import Post from './Post';
import { db ,auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, SetOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          console.log(authUser);
          setUser(authUser);
        }
        else {
          setUser(null);
        }
    })
    
    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName:username,
        })
        setOpen(false);
      })
      .catch((error) => alert(error.message))
    
  }
  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    
    SetOpenSignIn(false);
  }
      
  return (
    
    <div className="app">
      
      
      {/* I want to have*/}
      
        <Modal
          open={open}
          onClose={()=>setOpen(false)}          
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerImage"
                src={logo}
                alt=""
              />
              </center> 
              <Input
                placeholder="username" 
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
              <Input
                placeholder="email" 
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
                placeholder="passwrod" 
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
              <Button type="submit" onClick={signUp}>Sign Up</Button>
                    
            </form>
          </div>
      </Modal>
      <Modal
          open={openSignIn}
          onClose={()=>SetOpenSignIn(false)}          
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerImage"
                src={logo}
                alt=""
              />
              </center> 
              <Input
                placeholder="email" 
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
                placeholder="passwrod" 
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
              <Button type="submit" onClick={signIn}>Sign In</Button>
                    
            </form>
          </div>
        </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src={logo}
          alt="" />
        {user ? (
        <Button onClick={()=>auth.signOut()}>Log Out</Button>
      ) : (
          <div className="app__loginContainer">
          <Button onClick={()=>SetOpenSignIn(true)}>Sign In</Button>
          <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
        
      )}
      </div>

      
      <div className="app__posts">
      {
        posts.map(({ id, post }) => (
          <Post key={id} postId={id} user={user} caption={post.caption} imageUrl={post.imageUrl} username={post.username} />
        ))
        }
      </div>

      <div>
            <InstagramEmbed 
              url='https://www.instagram.com/p/Bs2WYR2DS0N/'
              maxWidth={1000}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
            </div>
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ) : (
          <h3>Sorry. You need to login</h3>
      )}
    </div>
    
  );
}

export default App;
