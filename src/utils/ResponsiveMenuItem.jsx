import { forwardRef } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';

export const ResponsiveMenuItem = forwardRef((props, ref) => {
  const { children, ...other } = props;

  return (
    <>
      <Hidden smUp>
        <option ref={ref} {...other}>
          {children}
        </option>
      </Hidden>
      <Hidden only="xs">
        <MenuItem ref={ref} {...other}>
          {children}
        </MenuItem>
      </Hidden>
    </>
  );
});
