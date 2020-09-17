import React, { createContext } from 'react';
import { Redirect } from 'react-router-dom';
// core
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

let ProtectorContext = createContext();

class Protector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authFailed: false,
      showMessage: false,
      message: '',
      color: null,
      username: null
    };
  }

  componentDidMount() {
    fetch('/api/logged-in-username')
      .then(res => res.text())
      .then(username => {
        if (username) {
          this.setState({...this.state, username, loading: false});
        } else {
          this.setState({...this.state, loading: false, authFailed: true});
        }
      })
  }

  showPopupMessage = (message, color) => {
    // close the popup message first and then reopen it up
    this.setState({ showMessage: false, ...this.state });
    setTimeout(() => {
      this.setState({
        ...this.state,
        showMessage: true,
        message,
        color
      });
    }, 100);
  };


  render() {
    if (this.state.loading) {
      return null;
    } else if (this.state.authFailed) {
      return <Redirect to="/verification" />
    } else {
      return (
        <ProtectorContext.Provider value={{
          showPopupMessage: this.showPopupMessage,
          username: this.state.username
        }}>
          <Snackbar
            place="br"
            color={this.state.color}
            icon={AddAlert}
            message={this.state.message}
            open={this.state.showMessage}
            closeNotification={() => this.setState({...this.state, showMessage: false})}
            close
          />
          <this.props.component {...this.props} />
        </ProtectorContext.Provider>
      )
    }
  }
}

export { Protector as default, ProtectorContext };