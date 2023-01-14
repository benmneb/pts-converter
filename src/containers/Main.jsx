import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import SwipeableViews from 'react-swipeable-views';

import { About, Results, Search, Select, TabContainer } from '../components';
import { useAcklytics } from '../hooks/useAcklytics';
import { useStore } from '../state';

export default function Main() {
  const tabValue = useStore((state) => state.navTab);

  const setNavTab = useStore((state) => state.setNavTab);

  useAcklytics(tabValue);

  return (
    <main className="tabsWrapper">
      <Card elevation={3}>
        <SwipeableViews
          index={tabValue}
          onChangeIndex={(value) => setNavTab(value)}
        >
          <TabContainer index={0} value={tabValue}>
            <Typography paragraph component="h2">
              Please type or copy & paste the PTS reference you want to convert.
            </Typography>
            <Search />
          </TabContainer>
          <TabContainer index={1} value={tabValue}>
            <Typography paragraph component="h2">
              Please select the PTS reference you want to convert.
            </Typography>
            <Select />
          </TabContainer>
          <TabContainer index={2} value={tabValue}>
            <About />
          </TabContainer>
        </SwipeableViews>
      </Card>
      <Results />
    </main>
  );
}
