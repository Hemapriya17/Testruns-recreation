import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NotificationSettings from "./Settings/NotificationSettings"
import ProfileSettings from "./Settings/ProfileSettings"
import RoleManagement from "./Settings/RoleManagement"
import UserManagement from "./Settings/UserManagement"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function Settings() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "100%" }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
        >
        {/* <Typography>Settings</Typography> */}
        <Tab label="User Management" {...a11yProps(0)} />
        <Tab label="Profile Settings" {...a11yProps(1)} />
        <Tab label="Role Management" {...a11yProps(2)} />
        <Tab label="Notification Settings" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <UserManagement/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProfileSettings/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RoleManagement/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <NotificationSettings/>
      </TabPanel>
    </Box>
  );
}
