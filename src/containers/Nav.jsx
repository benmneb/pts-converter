import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useStore } from '../state';

export default function Nav() {
  const tabValue = useStore((state) => state.navTab);

  const setNavTab = useStore((state) => state.setNavTab);

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
        onChange={(e, value) => setNavTab(value)}
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
