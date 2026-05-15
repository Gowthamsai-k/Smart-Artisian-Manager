import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogin, IconAnalyze } from '@tabler/icons-react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getIsLoggedIn,
  removeUser,
} from '../../redux/slices/User';
import classes from './HeaderMegaMenu.module.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/Product', label: 'Product' },
  { to: '/Payments', label: 'Payments' }
];

export default function HeaderMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const isLoggedIn = useSelector(getIsLoggedIn);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(removeUser());
    closeDrawer();
  };

  const navItems = navLinks.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      className={({ isActive }) =>
        `${classes.link} ${isActive ? classes.activeLink : ''}`
      }
      onClick={closeDrawer}
    >
      {link.label}
    </NavLink>
  ));

  return (
    <Box pb={0}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" px="md">
          <Group gap="xs" component={Link} to="/" style={{ textDecoration: 'none' }}>
            <IconAnalyze color="#556B2F" size={28} stroke={2} />
            <Text fw={900} size="xl" c="#556B2F" style={{ letterSpacing: '-1px' }}>
              ArtisanFlow
            </Text>
          </Group>

          <Group h="100%" gap={0} visibleFrom="sm">
            {isLoggedIn && navItems}
          </Group>

          <Group visibleFrom="sm">
            {isLoggedIn ? (
              <Button variant="default" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button
                variant="filled"
                color="#556B2F"
                component={Link}
                to="/login"
                leftSection={<IconLogin size={18} />}
              >
                Log in
              </Button>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          {isLoggedIn && (
            <Box className={classes.drawerLinks} px="md">
              {navItems}
            </Box>
          )}
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {isLoggedIn ? (
              <Button fullWidth onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button component={Link} to="/login" fullWidth onClick={closeDrawer} color="#556B2F">
                Login
              </Button>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
