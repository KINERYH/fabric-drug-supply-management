import { NavLink, Outlet } from "react-router-dom";
import Home from '@mui/icons-material/Home';
import ListItemButton from '@mui/joy/ListItemButton';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';



export default function NavLayout() {
  return (
    <>
      <Box component="nav" aria-label="Header" sx={{ flexGrow: 1, position: 'fixed', minWidth: '100%', zIndex: '9999', backgroundColor:'white' }}>
        <List role="menubar" orientation="horizontal" variant="outlined" sx={{ padding:'10px', gap:2 }}>
          <ListItem role="none">
            <ListItemButton role="menuitem" component="a">
              <NavLink to="/"><Home /></NavLink>
            </ListItemButton>
          </ListItem>
          <ListDivider />
          <ListItem role="none">
            <ListItemButton role="menuitem" component="a">
              <NavLink to="/home">User Home</NavLink>
            </ListItemButton>
          </ListItem>
          <ListDivider />
          <ListItem role="none">
            <ListItemButton role="menuitem" component="a">
              <NavLink to="/signup">Sign Up</NavLink>
            </ListItemButton>
          </ListItem>
          <ListDivider />
          <ListItem role="none">
            <ListItemButton role="menuitem" component="a">
              <NavLink to="/signin">Sign In</NavLink>
            </ListItemButton>
          </ListItem>
          {/* <ListItem role="none" sx={{ marginInlineStart: 'auto' }}>
            <ListItemButton
              role="menuitem"
              component="a"
              href="#horizontal-list"
              aria-label="Profile"
            >
              <Person />
            </ListItemButton>
          </ListItem> */}
        </List>
      </Box>
      <Outlet />
    </>
  );
}