import * as React from 'react';
import {useContext} from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link} from 'react-router-dom';
import Logo from '../image/logo.png';
import {auth, logOut} from '../backend/config';
import {useSelector} from "react-redux";
import AuthContext from "../Contexts/Auth";
import {Icon} from "@mui/material";

const pages = [
  {
  name: "Home",
  path: "/"
  },
  {
  name: "Lieux",
  path: "/lieux"
  },
];

const authRoutes = [
  {
    name: "Créer un compte",
    path: '/register'
  },
  {
    name: "Connexion",
    path: '/login'
  },
];

const userRoutes = [
  {
    name: "Profil",
    path: '/'
  }
];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const authState = useSelector(state => state.authReducer)
  const authCtx = useContext(AuthContext)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div>
    <AppBar position="sticky" sx={{ top: '200px' }} >
      <Container>
        <Toolbar disableGutters>
          <Typography
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
            <Link to="/" >
              <img style={{ height: 'auto', width: '150px' }} src={Logo} alt={Logo} />
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}

              >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
              >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" >
                      <Link style={{ color: 'black' }} to={page.path} >{page.name}</Link>
                    </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
            <Link to="/" >
              <img style={{ height: 'auto', width: '150px', maxWidth: '100%' }} src={Logo} alt={Logo} />
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
              key={page.name}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link style={{ color: 'black' }}to={page.path} > {page.name}</Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {authCtx.isAuthenticated && (
              <>
                <Box display="flex" alignItems={"center"}>
                  <Button
                    sx={{color: "text.primary"}}
                    onClick={handleOpenUserMenu}
                    startIcon={(
                      <Icon>person</Icon>
                    )}
                  >
                    {authState.email}
                  </Button>
                </Box>

                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userRoutes.map((s) => (
                    <Link to={s.path} key={s.path}>
                      <MenuItem sx={{color: "text.primary"}} key={s.name} onClick={handleCloseNavMenu}>
                        {s.name}
                      </MenuItem>
                    </Link>
                  ))}
                  <MenuItem onClick={logOut} >
                    Déconnexion
                  </MenuItem>
                  </Menu>
              </>
            )}

            {(!authCtx.isAuthenticated) && authRoutes.map((a, index) => (
              <Link to={a.path} key={a.path}>
                <Button
                  key={a.path}
                  sx={{ color: "text.primary", ...(index + 1 === authRoutes.length) && { ml: 1 }}}
                >
                  {a.name}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
      </AppBar>
    </div>
  );
};
export default ResponsiveAppBar;
