import React from 'react';

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

import { useForm } from 'react-hook-form';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
      let params = new FormData();
      params.append('username', data.username);
      params.append('password', data.password);
      fetch('/login', {method: 'POST', body: params, credentials: 'include'});
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                      inputRef: register
                  }}
              />
          </GridItem>
          <Button color="primary" type="submit" id="login-button">Continue</Button>
      </Grid>
    </form>
  )
}