import React, { Component } from 'react'
import './style.css'
import {
    Router,
    Route,
    NavLink
} from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import {inject, observer} from 'mobx-react'
import {reaction} from 'mobx'
import history from '../history'
import {AppBar, Container, IconButton, Modal, Toolbar, Typography, WithStyles, withStyles} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import {UserStore} from '../stores/UserStore';
import {RouterStore} from '../stores/RouterStore';
import AppBarCollapse from "../components/common/AppBarCollapse";
import {CommonStore} from "../stores/CommonStore";

interface IProps extends WithStyles<typeof styles> {
    routerStore: RouterStore,
    userStore: UserStore,
    commonStore: CommonStore
}

interface IState {
}

// получаем готовые стили темы material-ui
const styles = theme =>
    ({
        // объявление пользовательского класса стиля
        // (для корневого компонента разметки текущего компонента)
        root: {
            // атрибут класса стиля
            flexGrow: 1,
        },
        container: {
            maxWidth: 970
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        navBar: {
            color: '#fff',
            backgroundColor: '#ee6e73',
        },
        modalContent: {
            position: 'absolute',
            top: `5%`,
            left: `5%`,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        }
    })

@inject('routerStore', 'userStore', 'commonStore')
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
                // выполняем переход на раздел 'Главная'
                history.replace('/')

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
                // выполняем переход на раздел 'Вход'
                history.replace('/signin')
                // и меняем текущий список моделей роутов
                // - на список моделей роутов для пользователя-гостя
                this.props.routerStore.setAnonymousRoutes()
            }
        }
    )

    handleModalClose = (e) => {
        this.props.commonStore.setError(null)
    }

    render () {
        const { routes } = this.props.routerStore
        // получаем через пропс из обертки withStyles(styles) весь набор классов стилей,
        // который будет доступен из константы classes
        const { classes } = this.props
        return <Router history={history}>
            <div className={classes.root}>
                <AppBar position='static' className={classes.navBar}>
                    <Toolbar>
                        <Typography variant='h6' className={classes.title}>
                            ReactSPA
                        </Typography>
                        <AppBarCollapse routes={routes} />
                    </Toolbar>
                </AppBar>
                <Container fixed className={classes.container}>
                    {routes.map(({ path, Component }) => (
                        <Route key={path} exact path={path}>
                            {({ match }) => (
                                <CSSTransition
                                    in={match != null}
                                    timeout={300}
                                    classNames='page'
                                    unmountOnExit
                                >
                                    <div className='page'>
                                        <Component />
                                    </div>
                                </CSSTransition>
                            )}
                        </Route>
                    ))}
                </Container>
                <Modal
                    open={ !!this.props.commonStore.error }
                    onClose={ this.handleModalClose }
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className={classes.modalContent}>
                        {this.props.commonStore.error}
                    </div>
                </Modal>
            </div>
        </Router>
    }
}

export default withStyles(styles)(App)