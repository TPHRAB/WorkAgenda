import React from 'react';

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

import { useForm } from 'react-hook-form';

function Login(props) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (!data.username || !data.password) {
      props.setMessage('Username and password cannot be empty');
    } else {
      let params = new FormData();
      params.append('username', data.username);
      params.append('password', data.password);
      let result = await fetch('/api/login', {method: 'POST', body: params});
      if (result.ok) {
        props.history.push('/admin');
      } else {
        result = await result.json();
        props.setMessage(result.error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 id="title"><strong>Sign-In</strong></h3>
      <Grid align="center">
          <GridItem xs={12} sm={12} md={11}>
              <CustomInput
                  labelText="Username"
                  formControlProps={{
                      fullWidth: true
                  }}
                  inputProps={{
                      name: "username",
                      inputRef: register
                  }}
              />
          </GridItem>
          <GridItem xs={12} sm={12} md={11}>
              <CustomInput
                  labelText="Password"
                  formControlProps={{
                      fullWidth: true
                  }}
                  inputProps={{
                      name: "password",
                      inputRef: register,
                      type: "password"
                  }}
              />
          </GridItem>
          <Button color="primary" type="submit" id="submit-button">Continue</Button>
          <span id="register-prompt">
            Doesn't have an account? <a href="/verification/register">Register one</a>
          </span>
      </Grid>
    </form>
  )
}

export default Login;