import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

import SwipeableViews from 'react-swipeable-views';

import { useStore } from '../state';
import { TabContainer, Results, Search, Select, About } from '../components';

export default function Main() {
  const tabValue = useStore((state) => state.navTab);

  const setNavTab = useStore((state) => state.setNavTab);

  return (
    <Card className="tabsWrapper" component="main">
      <SwipeableViews
        index={tabValue}
        onChangeIndex={(value) => setNavTab(value)}
      >
        <TabContainer index={0} value={tabValue}>
          <Typography paragraph component="h2">
            Please type or copy & paste the PTS reference you want to convert.
          </Typography>
          <Search />
          <Results />
        </TabContainer>
        <TabContainer index={1} value={tabValue}>
          <Typography paragraph component="h2">
            Please select the PTS reference you want to convert.
          </Typography>
          <Select />
          <Results />
        </TabContainer>
        <TabContainer index={2} value={tabValue}>
          <About />
        </TabContainer>
      </SwipeableViews>
    </Card>
  );
}
