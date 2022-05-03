import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CardLieux from "../../composants/CardLieux";

//Import les services
import { LieuService } from "../../Services/LieuService";

import SearchContext from "../../Contexts/SearchContext";

function List() {
  const [lieux, setLieux] = useState([]);

  //Get places
  useEffect(() => {
    LieuService.getAll()
      .then((res) => {
        setLieux(res);
      })
      .catch((e) => console.log(e));
  }, []);

  const { input } = useContext(SearchContext);

  return (
    <Grid container spacing={2}>
      {lieux
        .filter((val) => {
          return val.title.toLowerCase().includes(input.toLowerCase());
        })
        .map((val, index) => {
          return (
            <Grid item md={4} xs={6}>
              <CardLieux lieu={val} key={index} images={val.images[0]} />
            </Grid>
          );
        })}
    </Grid>
  );
}

function Lieux() {
  const [search, setSearch] = useState("");

  const SearchInit = useCallback((event) => {
    setSearch(event.target.value);
  });

  const value = useMemo(() => {
    return {
      input: search,
      SearchInit,
    };
  });

  return (
    <div>
      <Container sx={{ mt: 10 }}>
        <SearchContext.Provider value={value}>
          <Search />
          <List />
        </SearchContext.Provider>
      </Container>
    </div>
  );
}

function Search() {
  const { SearchInit } = useContext(SearchContext);

  return (
    <Paper
      component="div"
      sx={{
        p: "2px 4px",
        m: " 0 auto 100px auto",
        display: "flex",
        alignItems: "center",
        width: "800px",
        maxWidth: "100%",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Rechercher un lieu"
        inputProps={{ "aria-label": "Rechercher un lieu" }}
        onChange={SearchInit}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default Lieux;
