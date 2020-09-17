import React, { useContext } from "react";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import EnhancedTable from "components/EnhancedTable/EnhancedTable";
import Button from "components/CustomButtons/Button.js";
import NewProject from "components/NewProject/NewProject";
import { ProtectorContext } from 'utils/Protector';
import { dashboardRoutes } from "routes.js";
// css
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
// utils
import moment from 'moment';

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

const dateCells = {
  start_date: 'sDate',
  end_date: 'eDate',
  default: 'end_date'
};

const status = ['ACTIVE', 'COMPLETED']

const createStatusCell = (code) => {
  let color;
  switch (code) {
    case 0:
      color = 'green';
      break;
    case 1:
      color = 'grey';
      break;
  }
  return <span style={{color}}>{status[code]}</span>;
}

const createBugCell = (open, closed) => {
  return <span><span style={{color: 'red'}}>{open}</span> / <span style={{color: 'grey'}}>{closed}</span></span>;
}

export default function Portal({ history, ...rest }) {
  // context
  const { username, showPopupMessage } = useContext(ProtectorContext);
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [activeCount, setActiveCount] = React.useState(0);
  const [completedCount, setCompletedCount] = React.useState(0);
  const [ownedByMeCount, setOwnedByMeCount] = React.useState(0);

  // functions
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
    fetch('/api/get-projects')
      .then(res => res.json())
      .then(json => {
        let active = 0;
        let ownedByMe = 0;
        json.forEach(p => {
          if (p['status'] === 0)
            active++;
          if (p['owner'] === username)
            ownedByMe++;
          p['status'] = createStatusCell(p['status']);
          p['bugs'] = createBugCell(p['bugs'][0], p['bugs'][1]);
          let startDate = moment(p['start_date']);
          p['start_date'] = startDate.format('MM-DD-YYYY');
          p[dateCells['start_date']] = startDate;

          let endDate = moment(p['end_date']);
          p['end_date'] = endDate.format('MM-DD-YYYY');
          p[dateCells['end_date']] = endDate;
        });
        setRows(json);

        // set message bar
        setOwnedByMeCount(ownedByMe);
        setActiveCount(active);
        setCompletedCount(json.length - active)
      })
      .catch(error => 
        showPopupMessage(error.message, 'danger')
      );
  }, [])

  const handleClick = (pid) => {
    history.push(`/project/${pid}/dashboard`);
  };

  return (
    <div ref={mainPanel}>
      <NewProject popupOpen={popupOpen} setPopupOpen={setPopupOpen} />
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
            <Chip label={<b style={{ color: 'green' }}>Active: {activeCount}</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
            <Chip label={<b style={{ color: 'grey' }}>Completed: {completedCount}</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 5px'}} />
            <Chip label={<b style={{ color: '#ff9966' }}>Owned by me: {ownedByMeCount}</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 5px'}}/>
            
          </span>
          <Button type="button" color="info" onClick={() => setPopupOpen(true)}>New Project</Button>
        </div>
        <EnhancedTable headCells={headCells} rows={rows} idColumn='pid' handleClick={handleClick} dateCells={dateCells} />
      </div>
      <Footer />
    </div>
  );
}