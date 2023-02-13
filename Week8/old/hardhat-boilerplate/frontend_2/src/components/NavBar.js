import React from "react";
import Account from "./Account";

import { Navbar, Container, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

function NavBar() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand
            href="/"
            style={{
              color: "#E18715",
              fontWeight: "700",
            }}
          >
            CommitNFT
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              activeKey={window.location.pathname}
              className="me-auto"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/Mint">Mint</Nav.Link>
              <Nav.Link href="/Redeem">Redeem</Nav.Link>
            </Nav>
            <Account />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
