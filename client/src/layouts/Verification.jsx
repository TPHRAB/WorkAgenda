import React from 'react';
import { useForm } from 'react-hook-form';
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
    return (
        <div id="verification">
            <div id="card">
                <Login setMessage={this.setMessage}/>
                <div id="message">{this.state.message}</div>
            </div>
        </div>
    );
  }
}