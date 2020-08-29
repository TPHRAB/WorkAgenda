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

import Login from 'views/Verification/Login';
import Register from 'views/Verification/Register';
import BugReport from 'views/BugReport/BugReport'
import BugReportIcon from '@material-ui/icons/BugReport';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Dashboard from 'views/Dashboard/Dashboard';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Schedule from 'views/Schedule/Schedule'
import GroupIcon from '@material-ui/icons/Group';
import Users from 'views/Users/Users';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: DashboardIcon,
    component: Dashboard,
    layout: '/project'
  },
  {
    path: "/bugreport",
    name: "Bug Report",
    icon: BugReportIcon,
    component: BugReport,
    layout: "/project"
  },
  {
    path: "/schedule",
    name: "Schedule",
    icon: DateRangeIcon,
    component: Schedule,
    layout: "/project"
  },
  {
    path: "/users",
    name: "Users",
    icon: GroupIcon,
    component: Users,
    layout: "/project"
  },
  {
    path: '',
    name: 'Portal',
    icon: ArrowBackIosIcon,
    layout: "/portal",
  }
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

export { dashboardRoutes, verificationRoutes };