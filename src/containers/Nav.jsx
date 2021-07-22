import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useSelector, useDispatch } from 'react-redux';

import { setNavTab } from '../state';

export default function Nav(props) {
  const dispatch = useDispatch();

  const tabValue = useSelector((state) => state.navTab);

  return (
    <AppBar
      position="static"
      color="default"
      className="appBar"
      component="nav"
    >
      <Tabs
        className="tabs"
        value={tabValue}
        onChange={(e, value) => dispatch(setNavTab(value))}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        centered
      >
        <Tab label="Search" />
        <Tab label="Select" />
        <Tab label="About" />
      </Tabs>
    </AppBar>
  );
}
