import * as React from 'react'

const MarkerContext = React.createContext(
  {
  _lat: 37.575712,
  _long: 126.976801,
  handleChange: () => {}
  }
);

export default MarkerContext
