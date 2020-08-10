import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { verificationRoutes } from 'routes'
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
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
              <Switch>
                {verificationRoutes.map((prop, key) => {
                  if (prop.layout === "/verification") {
                    return (
                      <Route
                        path={prop.layout + prop.path}
                        key={key}
                        render={(props) => <prop.component {...props} setMessage={this.setMessage}/>} 
                      />
                    );
                  }
                  return null;
                })}
                <Redirect from="/verification" to="/verification/login" />
              </Switch>
              {message}
            </div>
          </div>
        </div>
    );
  }
}