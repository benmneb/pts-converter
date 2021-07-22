import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

import { useSelector } from 'react-redux';

import { TabContainer, Results, Search, Select, About } from '../components';

export default function Main() {
  const tabValue = useSelector((state) => state.navTab);

  return (
    <Card className="tabsWrapper" component="main">
      {tabValue === 0 && (
        <TabContainer index={0} value={tabValue}>
          <Typography paragraph component="h2">
            Please type or copy & paste the PTS reference you want to convert.
          </Typography>
          <Search />
          <Results />
        </TabContainer>
      )}
      {tabValue === 1 && (
        <TabContainer index={1} value={tabValue}>
          <Typography paragraph component="h2">
            Please select the PTS reference you want to convert.
          </Typography>
          <Select />
          <Results />
        </TabContainer>
      )}
      {tabValue === 2 && (
        <TabContainer index={2} value={tabValue}>
          <About />
        </TabContainer>
      )}
    </Card>
  );
}
