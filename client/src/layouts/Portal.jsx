import React from "react";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import EnhancedTable from "components/EnhancedTable/EnhancedTable";
import Button from "components/CustomButtons/Button.js";
import NewProject from "components/NewProject/NewProject";
import Snackbar from "components/Snackbar/Snackbar.js";
// css
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import { dashboardRoutes } from "routes.js";


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

export default function Portal({ history, ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  const createProject = (data) => {
    console.log(data)
    let params = new FormData();
    params.append("name", data.name)
    params.append("start_date", data.start_date)
    params.append("end_date", data.end_date)
    params.append("overview", data.overview)
    fetch('/api/portal/create-project', { method: 'POST', body: params })
      .then(res => {
        if (res.ok) {
          setPopupOpen(false);
          data['status'] = 'ACTIVE';
          data['bugs'] = <span><span style={{color: 'red'}}>0</span> / <span style={{color: 'grey'}}>0</span></span>
          setRows([...rows, data]);
        }
      })
      .catch(err => {
        setMessage(err);
      });
  }
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
      <Snackbar
        place="br"
        color="danger"
        icon={AddAlert}
        message={message}
        open={message !== ''}
        closeNotification={() => setMessage('')}
        close
      />
      <NewProject popupOpen={popupOpen} setPopupOpen={setPopupOpen} createProject={createProject} />
      <Navbar
        routes={dashboardRoutes}
        handleDrawerToggle={handleDrawerToggle}
        {...rest}
      />
      <div className={classes.content}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span
            style={{
              fontSize: '15px',
            }}
          >
            <Chip label={<b style={{ color: 'green' }}>Active: 1</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
            <Chip label={<b style={{ color: '#568dd5' }}>Planning: 0</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
            <Chip label={<b style={{ color: 'grey' }}>Completed: 0</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 5px'}} />
            <Chip label={<b style={{ color: '#ff9966' }}>Owned by me: 1</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 5px'}}/>
            
          </span>
          <Button type="button" color="info" onClick={() => setPopupOpen(true)}>New Project</Button>
        </div>
        <EnhancedTable headCells={headCells} rows={rows} idColumn='pid' handleClick={handleClick}/>
      </div>
      <Footer />
    </div>
  );
}
