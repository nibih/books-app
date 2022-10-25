import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
function Navigation() {
  return (
    <Navbar bg='dark' variant='dark' sticky='top'>
      <Container>
        <Nav
          className='
            d-flex
            justify-content-between
            align-items-center
            w-100
            py-1
          '
        >
          <Nav.Link href='/'>Home</Nav.Link>
          {/* fav */}
          <Nav.Link href='/favorites'>Favorites</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
export default Navigation;
