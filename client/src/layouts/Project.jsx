import React, { createContext, useEffect } from "react";
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

import { dashboardRoutes } from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

let ps;

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((item, key) => {
      if (item.layout === "/project") {
        return (
          <Route
            path={item.layout + '/:pid' + item.path}
            key={key}
            component={item.component}
          />
        );
      }
      return null;
    })}
  </Switch>
);

const useStyles = makeStyles(styles);

const ProjectContext = createContext();

function Project(props) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [color, setColor] = React.useState('danger');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  const showPopupMessage = (message, color) => {
    // close the popup message first and then reopen it up
    setShowMessage(false);
    setTimeout(() => {
      setShowMessage(true);
      setMessage(message);
      setColor(color);
    }, 100);
  };

  // initialize and destroy the PerfectScrollbar plugin
  useEffect(() => {
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
    <ProjectContext.Provider value={{ pid: props.match.params.pid, showPopupMessage }}>
      <div className={classes.wrapper}>
        <div>
          <Snackbar
            place="br"
            color={color}
            icon={AddAlert}
            message={message}
            open={showMessage}
            closeNotification={() => setShowMessage(false)}
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
            <div className={classes.container}>{switchRoutes}</div>
          </div>
          <Footer />
        </div>
      </div>
    </ProjectContext.Provider>
  );
}

export { Project as default, ProjectContext };