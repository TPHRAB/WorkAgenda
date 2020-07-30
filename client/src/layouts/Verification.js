import React from 'react';
import { useForm } from 'react-hook-form';

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

// css
import '../assets/css/verification.css'

export default function Login() {
        const { register, handleSubmit } = useForm();
        const onSubmit = data => console.log(data);
        return (
            <div id="login-form">
                <div id="card">
                    <h3 id="title"><strong>Sign-In</strong></h3>
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
                </div>
            </div>
        )
}