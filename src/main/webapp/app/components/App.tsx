import React, { Component } from 'react'
// import {Container, Icon, Navbar, NavItem, Toast} from 'react-materialize'
// import 'materialize-css/dist/css/materialize.min.css'
// import 'materialize-css/dist/js/materialize.min'
import './style.css'
import {
    Router,
    Route,
    NavLink
} from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import {inject, observer} from "mobx-react"
import {reaction} from "mobx"
import history from '../history'
import {AppBar, Container, IconButton, Toolbar, Typography, WithStyles, withStyles} from "@material-ui/core"
import MenuIcon from '@material-ui/icons/Menu'
// import {CommonStore} from "app/stores/CommonStore";
import {UserStore} from "app/stores/UserStore";
import {RouterStore} from "app/stores/RouterStore";

interface IProps extends WithStyles<typeof styles> {
    routerStore: RouterStore,
    userStore: UserStore
}

interface IState {
}

const styles = theme =>
    ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    })

@inject("routerStore", "userStore")
@observer
class App extends Component<IProps, IState> {
    // установка обработчика события изменения значения
    // в свойстве userStore.user хранилища -
    // задано первым аргументом функции reaction;
    // второй аргумент - функция, которая будет выполнена
    // в ответ на изменения свойства userStore.user,
    // при этом функция -второй аргумент - получает в качестве своего аргумента
    // данные, которые изменились (новую версию)
    userReaction = reaction(
        () => this.props.userStore.user, // следим за свойством user
        (user) => {
            // при изменении значения свойства user
            if (user) {
                // если user установлен -
                // выполняем переход на раздел "Главная"
                history.replace("/")

                if (user.roleName === 'ROLE_ADMIN') {
                    // ... и меняем текущий список моделей роутов
                    // - на список моделей роутов для вошедшего пользователя-администратора,
                    // если в модели пользователя, полученной с сервера указано имя роли
                    // ROLE_ADMIN
                    this.props.routerStore.setAdminRoutes()
                } else {
                    // ... и меняем текущий список моделей роутов
                    // - на список моделей роутов для вошедшего пользователя
                    this.props.routerStore.setLoggedRoutes()
                }
            } else {
                // если пользователь не установлен -
                // выполняем переход на раздел "Вход"
                history.replace("/signin")
                // и меняем текущий список моделей роутов
                // - на список моделей роутов для пользователя-гостя
                this.props.routerStore.setAnonymousRoutes()
            }
        }
    )
    render () {
        const { routes } = this.props.routerStore
        const { classes } = this.props
        return <Router history={history}>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            ReactSPA
                        </Typography>
                        {routes.map(route => {
                            /* выводим на панель навигации ссылки только на те разделы сайта,
                            * в имени модели роута которых не встречается шаблон:
                            * слово Dashboard + один или более символов латинского алфавита
                            * в верхнем или нижнем регистре
                            * (так пользователь администратор увилит ссылку на главную страницу админпанели,
                            * но не увидит лишние ссылки на разделы админпанели)*/
                            if(!/^Dashboard[A-z]+$/.test(route.name)) {
                                return <NavLink
                                    key={route.path}
                                    as={NavLink}
                                    to={route.path}
                                    activeClassName="active"
                                    exact

                                >
                                    {route.name}
                                </NavLink>
                            } else {
                                return ''
                            }
                        })}
                    </Toolbar>
                </AppBar>
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

export default withStyles(styles)(App)