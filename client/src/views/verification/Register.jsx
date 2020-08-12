import React from 'react';

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

import { useForm } from 'react-hook-form';

function Register(props) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (!data.username || !data.password || !data.firstName || !data.lastName) {
      props.setMessage('Please fill in all the fields');
    } else {
      let params = new FormData();
      params.append('username', data.username);
      params.append('password', data.password);
      params.append('firstName', data.firstName);
      params.append('lastName', data.lastName);
      let result = await fetch('/api/register', {method: 'POST', body: params});
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
      <h3 id="title"><strong>New Account</strong></h3>
      <Grid align="center">
        <Grid container justify="space-around">
          <GridItem xs={12} sm={12} md={5}>
            <CustomInput
              labelText="First name"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                  name: "firstName",
                  inputRef: register
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={5}>
            <CustomInput
              labelText="Last name"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                name: "lastName",
                inputRef: register
              }}
            />
          </GridItem>
        </Grid>
        <GridItem xs={12} sm={12} md={11}>
          <CustomInput
            labelText="Username (4+ characters)"
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
            labelText="Password (4+ characters)"
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
        <Button color="primary" type="submit" id="submit-button">Register</Button>
      </Grid>
    </form>
  )
}

export default Register;