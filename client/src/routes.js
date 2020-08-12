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
// @material-ui/icons
// core components/views for Admin layout

//   {
//     path: "/dashboard",
//     name: "Dashboard",
//     rtlName: "لوحة القيادة",
//     icon: Dashboard,
//     component: DashboardPage,
//     layout: "/admin"
//   }

import Login from 'views/verification/Login';
import Register from 'views/verification/Register';

const dashboardRoutes = [
];

const verificationRoutes = [
  {
    path: "/login",
    component: Login,
    layout: "/verification"
  },
  {
    path: "/register",
    component: Register,
    layout: "/verification"
  }
]

export {dashboardRoutes, verificationRoutes};