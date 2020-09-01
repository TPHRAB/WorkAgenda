import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";

import { dashboardRoutes } from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import EnhancedTable from "components/EnhancedTable/EnhancedTable";
import { List } from "@material-ui/core";

let ps;

const useStyles = makeStyles(styles);

const headCells = [
  { id: 'name', label: 'PROJECT NAME', isLink: true },
  { id: 'owner', label: 'OWNER' },
  { id: 'status', label: 'STATUS' },
  { id: 'bugs', label: 'BUGS' },
  { id: 'start_date', label: 'START DATE', date: true },
  { id: 'end_date', label: 'END DATE', date: true }
];

function createData(id, name, owner, status, bugs, startDate, endDate) {
  return { id, name, owner, status, bugs, startDate, endDate };
}

const rows = [
  createData('This is a bugThis is a bugThis is a bugThis is a bugThis is a bug', 'Me', <span style={{color: 'green'}}>ACTIVE</span>, <span><span style={{color: 'red'}}>3</span> / <span style={{color: 'grey'}}>1</span></span>, '08-15-2020', '08-18-2020 04:00 PM'),
];


export default function Portal({ history, ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
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

  React.useEffect(() => {
    // fetch data from endpoint
    fetch('/api/portal/get-projects')
      .then(res => res.json())
      .then(json => {
        json.forEach(p => {
          p['status'] = <span style={{color: 'green'}}>{p['status']}</span>;
          p['bugs'] = <span><span style={{color: 'red'}}>{p['bugs'][0]}</span> / <span style={{color: 'grey'}}>{p['bugs'][1]}</span></span>
        });
        setRows(json);
      });
  }, [])

  const handleClick = (event, pid) => {
    history.push(`/project/${pid}/dashboard`);
  };

  return (
      <div ref={mainPanel}>
        <Navbar
          routes={dashboardRoutes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        <div className={classes.content}>
          <EnhancedTable headCells={headCells} rows={rows} idColumn='pid' handleClick={handleClick}/>
        </div>
        <Footer />
      </div>
  );
}
