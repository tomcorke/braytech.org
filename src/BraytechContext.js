import React from 'react';

export default React.createContext({
  theme: {
    selected: 'light-mode',
    setFn: () => {}
  }
});
