// import React from 'react';

export const Globals = {
  key: {
    braytech: process.env.REACT_APP_BRAYTECH_API_KEY,
    bungie: process.env.REACT_APP_BUNGIE_API_KEY
  },
  url: {
    braytech: "https://api.braytech.org",
    bungie: "https://www.bungie.net"
  },
  routes: {
    standard: ['character-select', 'pride', 'credits', 'settings', 'tools']
  }
}

export const isProfileRoute = (pathname) => {
  return pathname !== '/' && !Globals.routes.standard.includes(pathname.split('/')[1]) ? true : false;
}

export default Globals;