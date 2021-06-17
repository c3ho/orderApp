import { Navbar, Nav } from "react-bootstrap";
import { Switch, Route, Link } from "react-router-dom";
import AddItemForm from "../../pages/addItemForm";
import Menu from "../../pages/menu";

function NavBar() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          HK Garden
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              Menu
            </Nav.Link>
            <Nav.Link as={Link} to="/addItem">
              Add Menu Item
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div>
        <Switch>
          <Route
            exact
            path="/nf"
            render={function () {
              return <p>Not found</p>;
            }}
          />
          <Route exact path="/" render={() => <Menu />} />
          <Route exact path="/addItem" render={() => <AddItemForm />} />
        </Switch>
      </div>
    </>
  );
}

export default NavBar;
