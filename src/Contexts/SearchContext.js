import * as React from 'react'

const SearchContext = React.createContext({
    input: "" ,
    SearchInit: () => {}
});

export default SearchContext