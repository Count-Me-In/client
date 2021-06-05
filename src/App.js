import React, { useEffect, useState } from 'react';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import classes from './App.module.css';
import Login from './components/Login/Login'
import AppBar from "@material-ui/core/AppBar";
import { Menu, Typography } from 'antd';
import { Toolbar } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import HomePage from './components/HomePage/HomePage';
import Bidding from './components/Bidding/Bidding';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import PlanArrival from './components/PlanArrival/PlanArrival';
import ManageEmployeePoints from './components/ManageEmployeePoints/ManageEmployeePoints';
import Restrictions from './components/Restrictions/Restrictions';
import Axios from 'axios';
import { API_URL, TOKEN } from './Config/config';
import 'antd/dist/antd.css';
import SubMenu from 'antd/lib/menu/SubMenu';

const theme = createMuiTheme({
  typography: {
    fontFamily: "Segoe UI",
  },
  palette: {
    primary: {
      light: "#6abba7",
      main: "#4d79ff",
      dark: "#307766",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffffff",
      main: "#a8abab",
      dark: "#b2b2b2",
      contrastText: "#000",
    },
  },
});


function App() {
  const [tab, setTab] = useState();
  const [openMenu, setOpen] = useState(false);
  const [currPoints, setCurrPoints] = useState(undefined);//TODO: ask from server
  const [currPercents, setCurrPercents] = useState();//TODO: ask from server
  const [anchorEl, setAnchorEl] = useState(null);
  // const [userAuth, setAuth] = useState()
  const [isManager, setIsManager] = React.useState(false);
  const anchorRef = React.useRef(null);

  // useEffect(() => {
  const userAuth = localStorage.getItem('auth');

  if (userAuth) {
    Axios.defaults.headers.common["Authorization"] = userAuth
  }

  //   setAuth(userAuth);
  // }, [])

  const handleToggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleCloseMenu = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleMenuSelection = (event) => {
    handleCloseMenu(event);
    // setTab(3);
  }
  const handleCloseInfo = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar className={classes.header} color='inherit' position="static">
          <Toolbar className={classes.navbar}>
            <div className={classes.titleContainer}>
              <Typography.Title level={3}>Count Me In The Office!</Typography.Title>
            </div>
            {!userAuth &&
              <div>
                <Button className={classes.Info} data-testid="InfoBtn" aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
                  info
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleCloseInfo}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Typography data-testid="infoBtnText" className={classes.typography}>
                    Welcome to Count Me In The Office!
                    באתר זה תוכלו להרשם להרצאות המתקיימות הסמסטר בצורה היברידית והמערכת תחשב ותבחר מי יורשה להכנס לשיעור הפרונטלי בצורה הוגנת. הינך מקבל סך נקודות שבועיות אשר מצטברות משבוע לשבוע. עלייך לחלק את הנקודות שברשותך בין הקורסים הנמצאים במערכת השעות שלך. החלוקה תעשה בעזרת חלוקת אחוזים. ברשותך 100% אותם תוכל לחלק בין הקורסים השונים. שים לב כי החלוקה נתונה לשיקול דעתך, אינך חייב לחלק את כל האחוזים ואינך חייב לחלק אחוזים לכל קורס. לאחר מכן המערכת תשקלל את בחירות כל התלמידים ותבחר מי ייכנס לכל שיעור. את חלוקת האחוזים תוכל לשנות באופן דינאמי בלשונית biding.
    את מערכת השעות והשיבוצים לשבועיים הקרובים תוכל לראות בלשונית schedule כאשר השיעורים אליהם הצלחת להיכנס יסומנו בירוק, ואלה שלא יסומנו באפור. שים לב שכל חלוקת אחוזים רלוונטית לשבוע השלישי.</Typography>
                </Popover>
              </div>
            }
            {userAuth &&
              <div className={classes.navbarChild}>
                <div className={classes.biddindData}>
                  {currPoints !== undefined ? <label><strong>points: {currPoints}</strong></label> : null}
                  {currPercents ? <label><strong>Percents: {currPercents}%</strong></label> : null}
                </div>
                <Menu theme='light' style={{  borderBottom: 'unset', fontSize: '20px', fontWeight: 'normal' }} onClick={(e) => setTab(e.key)} selectedKeys={[tab]} mode="horizontal">
                  <Menu.Item key="Schedule">
                    <Link to="/Home" className={!userAuth || tab != 1 ? classes.link : classes.clickedLink} data-testid="scheduleLink">
                      {/* <h3> */}
                        Schedule
                      {/* </h3> */}
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="Bidding" >
                    <Link to="/bidding" className={!userAuth || tab != 2 ? classes.link : classes.clickedLink} data-testid="biddingLink">
                      {/* <h3> */}
                        Bidding
                        {/* </h3> */}
                    </Link>
                  </Menu.Item>
                  <SubMenu key="Manager Panel" data-testid="managerPanelLink" style={!isManager ? { display: 'none' } : {}} disabled={!isManager} title="Manager Panel">
                    <Menu.Item key="employeesPoints">
                      <Link to="/employeesPoints">
                        Employees points
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="restriction">
                      <Link to="/restriction" >
                        Days restriction
                      </Link>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="logout">
                    <Link data-testid="logoutBtn" onClick={() => {
                      localStorage.setItem('auth', '')
                      setIsManager(false);
                    }} to="/" className={classes.logout}>
                      log out
                    </Link>
                  </Menu.Item>
                </Menu>
              </div>
            }
          </Toolbar>
        </AppBar >
        <Switch>
          <PrivateRoute path="/home">
            <HomePage isManager={isManager} setIsManager={setIsManager} />
          </PrivateRoute>
          <PrivateRoute path="/bidding">
            <Bidding updatePercents={(p) => { setCurrPercents(p) }} />
          </PrivateRoute>
          <Route path="/login">
            <Login onLogin={() => {
              setTab('Schedule')
              Axios.get(`${API_URL}/employees/employeePoints`).then(({ data }) => {
                setCurrPoints(data)
              })
            }} />
          </Route>

          <PrivateRoute isManager={isManager} path="/employeesPoints">
            <ManageEmployeePoints />
          </PrivateRoute>

          <PrivateRoute isManager={isManager} path="/restriction">
            <Restrictions />
          </PrivateRoute>
          <Route path="/">
            <Redirect
              to={{
                pathname: "/login",
              }}
            />
            <Login />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider >
  );
}

function PrivateRoute({ children, isManager }) {
  return (
    <Route
      render={({ location }) =>
        !localStorage.getItem('auth') ?
          (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          ) : isManager === undefined || isManager ?
            (children) :
            (
              <Redirect
                to={{
                  pathname: "/home",
                }}
              />
            )
      }
    />
  );
}

export default App;
