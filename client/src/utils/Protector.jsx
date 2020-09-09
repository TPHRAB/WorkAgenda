import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Protector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authFailed: false
    };
  }

  componentDidMount() {
    fetch('/api/logged-in-username')
      .then(res => res.text())
      .then(username => {
        if (username) {
          this.setState({loading: false});
        } else {
          this.setState({loading: false, authFailed: true});
        }
      })
  }

  render() {
    if (this.state.loading) {
      return null;
    } else if (this.state.authFailed) {
      return <Redirect to="/verification" />
    } else {
      return <this.props.component {...this.props} />
    }
  }
}