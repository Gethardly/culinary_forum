import React, { PropsWithChildren, ReactNode } from 'react';
import AppToolbar from './AppToolbar/AppToolbar';
import { Box, Container, CssBaseline } from '@mui/material';
import { useAppSelector } from '../app/hooks';
import { hideAppBar, selectAppBar } from './AppToolbar/AppToolBarSlice';

interface Props extends PropsWithChildren {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  hideAppBar(false);
  const hideAppbar = useAppSelector(selectAppBar);
  return (
    <>
      <CssBaseline />
      {hideAppbar ? '' : <AppToolbar />}
      <Box component="main">
        <Container maxWidth={false}>{children}</Container>
      </Box>
    </>
  );
};

export default Layout;
