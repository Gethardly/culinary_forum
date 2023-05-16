import React, { PropsWithChildren, ReactNode } from 'react';
import AppToolbar from './AppToolbar/AppToolbar';
import { Box, Container, CssBaseline } from '@mui/material';

interface Props extends PropsWithChildren {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <AppToolbar />
      <Box component="main">
        <Container maxWidth={false}>{children}</Container>
      </Box>
    </>
  );
};

export default Layout;
