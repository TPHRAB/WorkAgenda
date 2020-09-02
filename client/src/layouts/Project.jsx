import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import Button from "components/CustomButtons/Button.js";

import { dashboardRoutes } from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

let ps;

const switchRoutes = (setMessage) => {
  return (
    <Switch>
      {dashboardRoutes.map((item, key) => {
        if (item.layout === "/project") {
          return (
            <Route
              path={item.layout + '/:pid' + item.path}
              key={key}
              render={(props) => {
                return <item.component {...props} setMessage={setMessage} />
              }}
            />
          );
        }
        return null;
      })}
    </Switch>
  )
};

const useStyles = makeStyles(styles);

export default function Project(props) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      <div>
        <Snackbar
          place="br"
          color="danger"
          icon={AddAlert}
          message={message}
          open={message !== ''}
          closeNotification={() => setMessage('')}
          close
        />
      </div>
      <Sidebar
        basePath={`/project/${props.match.params.pid}`}
        routes={dashboardRoutes}
        logoText={"Creative Tim"}
        logo={logo}
        image={bgImage}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color='blue'
        {...props}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={dashboardRoutes}
          handleDrawerToggle={handleDrawerToggle}
          {...props}
        />
        <div className={classes.content}>
          <div className={classes.container}>{switchRoutes(setMessage)}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
