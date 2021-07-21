import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

export default function Nav(props) {
  const { tabValue, handleChange } = props;

  return (
    <AppBar position="static" color="default" className="appBar" component="nav">
      <Tabs
        className="tabs"
        value={tabValue}
        onChange={(e, value) => handleChange({ 
          tabValue: value,
          selectedBook: '',
          selectedDiv: '',
          selectedNum: '',
          multipleEditionResults: null
        })}
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
  )
}
