import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config'
import facebook from './images/facebook.png'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      picture: {
        data: {}
      }
    }
  }

  componentDidMount() {
    // Load the required SDK asynchronously for facebook, google and linkedin
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: config.facebook,
        cookie: true,  // enable cookies to allow the server to access the session
        xfbml: true,  // parse social plugins on this page
        version: 'v3.0' // use version 3.0
      });
    };
    
    const _this = this
    window.onload = function () {
      _this.checkLoginState()
    }
    
  }

  facebookLogin = () => {
    window.FB.login(
      function (resp) {
        this.statusChangeCallback(resp);
      }.bind(this), { scope: 'email, public_profile' });
  }

  checkLoginState() {
    // alert("Checking Login Status")
    console.log("Checking login status...........");

    window.FB.getLoginStatus(function (response) {
      // alert("FB Callback")
      console.log("----------->")
      console.log(response)
      this.statusChangeCallback(response);
    }.bind(this));
  }

  statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      // alert("Connected to facebook. Retriving user from fb");
      // Logged into your app and Facebook.
      this.fetchDataFacebook();
    } else if (response.status === 'not_authorized') {
      console.log('Import error', 'Authorize app to import data', 'error')
    } else {
      console.log('Import error', 'Error occured while importing data', 'error')
    }
  }

  fetchDataFacebook = () => {
    console.log('Welcome!  Fetching your information.... ');
    const _this = this
    window.FB.api('/me?fields=picture,email,name', function (user) {
      console.log(user);
      console.log('Successful login from facebook : ' + user.name);
      alert('Successful login for: ' + user.name);
      _this.setState({
        ...user
      })
    });
  }


  render() {
    const { picture: { data } } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <img src={facebook} title="facebook login" alt="facebook" onClick={() => this.facebookLogin()} />
        <h1>{this.state.name}</h1>
        <h1>{this.state.email}</h1>
        <img src={data.url} />
      </div>
    );
  }
}

export default App;
