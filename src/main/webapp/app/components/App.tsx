import React, { Component } from 'react'
import {Container, Icon, Navbar, NavItem, Toast} from 'react-materialize'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min'
import './style.css'
import {
    BrowserRouter as Router,
    Route,
    NavLink
} from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import Home from "./pages/Home";
import Shopping from "./pages/Shopping";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const routes = [
    { path: '/', name: 'Home', Component: Home },
    { path: '/shopping', name: 'Shopping', Component: Shopping },
    { path: '/signin', name: 'SignIn', Component: SignIn },
    { path: '/signup', name: 'Register', Component: SignUp },
]

class App extends Component {
    render () {
        return <Router basename='/eCommerceShop'>
            <div>
                <Navbar
                    alignLinks="right"
                    menuIcon={<Icon>menu</Icon>}
                    brand={<a className="brand-logo" href="#">ReactSPA</a>}
                    id="mobile-nav"
                    options={{
                        draggable: true,
                        edge: 'left',
                        inDuration: 250,
                        onCloseEnd: null,
                        onCloseStart: null,
                        onOpenEnd: null,
                        onOpenStart: null,
                        outDuration: 200,
                        preventScrolling: true
                    }}
                >
                    {routes.map(route => (
                        <NavLink
                            key={route.path}
                            as={NavLink}
                            to={route.path}
                            activeClassName="active"
                            exact
                        >
                            {route.name}
                        </NavLink>
                    ))}
                </Navbar>
                <Container>
                    {routes.map(({ path, Component }) => (
                        <Route key={path} exact path={path}>
                            {({ match }) => (
                                <CSSTransition
                                    in={match != null}
                                    timeout={300}
                                    classNames="page"
                                    unmountOnExit
                                >
                                    <div className="page">
                                        <Component />
                                    </div>
                                </CSSTransition>
                            )}
                        </Route>
                    ))}
                </Container>
            </div>
        </Router>
    }
}

export default App