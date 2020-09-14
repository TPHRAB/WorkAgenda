import React, { useState, useContext } from 'react';
// @material-ui
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';
// core
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { ProjectContext } from 'layouts/Project';
import 'assets/css/project-settings.css';

export default function ProjectSettings() {
  // context

  return (
    <Card>
      <CardBody>
        <GridContainer>
          <GridItem
            xs={12} sm={12} md={12}
            direction="row"
            alignItems="center"
            justify="space-around"
            container
          >
            <span className="title-field">
              <h4>Project name</h4>
            </span>
            <span className="input-field">
              <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{
                  className: "center"
                }}
              />
            </span>
          </GridItem>
          <GridItem
            xs={12} sm={12} md={12}
            direction="row"
            alignItems="center"
            justify="space-around"
            container
          >
            <span className="title-field">
              <h4>Owner</h4>
            </span>
            <span className="input-field">
              <TextField
                margin="dense"
                variant="outlined"
                inputProps={{
                  className: "center"
                }}
              />
            </span>
          </GridItem>
          <GridItem
            xs={12} sm={12} md={12}
            direction="row"
            alignItems="center"
            justify="space-around"
            container
          >
            <span className="title-field">
              <h4>Status</h4>
            </span>
            <span className="input-field">
              <TextField
                margin="dense"
                variant="outlined"
                inputProps={{
                  className: "center"
                }}
              />
            </span>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
}