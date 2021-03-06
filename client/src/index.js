/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Project from "layouts/Project.jsx";
import Verification from "layouts/Verification.jsx";
import Protector from "./utils/Protector";
import Portal from 'layouts/Portal';

import "assets/css/material-dashboard-react.css?v=1.9.0";

const hist = createBrowserHistory();



ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/project/:pid" render={(props) => {
        return <Protector {...props} component={Project} />
      }} />
      <Route path="/portal" render={(props) => {
        return <Protector {...props} component={Portal} />
      }} />
      <Route path="/verification" component={Verification} />
      <Redirect from="/" to="/portal" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
