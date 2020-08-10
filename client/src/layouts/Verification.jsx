import React from 'react';
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Login from '../views/Login'


// css
import '../assets/css/verification.css';

export default class Verification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null
    }
  }

  setMessage = (message) => {
    this.setState({ message });
  }

  render() {
    let message;
    if (this.state.message) {
      message = <SnackbarContent
                  message={this.state.message} 
                  close
                  color="danger" 
                  onClick={() => {
                    this.setState({ message: null })}
                  }
                />
    }
    return (
        <div id="background">
          <div id="mask">
            <div id="card">
                <Login setMessage={this.setMessage}/>
                {message}
            </div>
          </div>
        </div>
    );
  }
}