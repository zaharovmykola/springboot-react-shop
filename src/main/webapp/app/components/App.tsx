import React, {Component} from 'react'
import './style.css'
import {
    Router,
    Route,
    NavLink
} from 'react-router-dom'
import {CSSTransition} from 'react-transition-group'
import {inject, observer} from 'mobx-react'
import {reaction} from 'mobx'
import history from '../history'
import {
    AppBar, Button,
    Container, Grid,
    Icon,
    IconButton,
    Modal,
    Toolbar,
    Typography,
    WithStyles,
    withStyles
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import {UserStore} from '../stores/UserStore'
import {RouterStore} from '../stores/RouterStore'
import AppBarCollapse from "../components/common/AppBarCollapse"
import {CommonStore} from "../stores/CommonStore"
import {CartStore} from "../stores/CartStore"

interface IProps extends WithStyles<typeof styles> {
    routerStore: RouterStore,
    userStore: UserStore,
    commonStore: CommonStore,
    cartStore: CartStore
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
            maxWidth: '1300px',
            '& .page': {
                position: 'static'
            }
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
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        modalContent: {
            /* position: 'absolute',
            top: `5%`,
            left: `5%`, */
            /* alignItems: 'center',
            justifyContent: 'center', */
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        cartModalContent: {
            /* position: 'absolute',
            top: `40%`,
            left: `40%`, */
            /* alignItems: 'center',
            justifyContent: 'center', */
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        closeButton: {
            cursor: 'pointer',
            float: 'right',
            marginTop: '-80px',
            marginRight: '-25px',
        }
    })

@inject('routerStore', 'userStore', 'commonStore', 'cartStore')
@observer
class App extends Component<IProps, IState> {

    componentDidMount() {
        this.props.userStore.check()
    }

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
                // и загружаем данные корзины пользователя user
                this.props.cartStore.fetchCartItems()
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

    handleErrorModalClose = (e) => {
        this.props.commonStore.setError(null)
    }

    handleCartItemPlus = (e, productId) => {
        this.props.cartStore.addToCart(productId, () => {
        })
    }

    handleCartItemMinus = (e, productId) => {
        this.props.cartStore.minusToCart(productId, () => {
        })
    }

    handleCartItemDelete = (e, productId) => {
        this.props.cartStore.deleteToCart(productId, () => {
        })
    }

    handleCartModalClose = (e) => {
        this.props.cartStore.setCartVisibility(false)
    }

    render() {
        const {routes} = this.props.routerStore
        // получаем через пропс из обертки withStyles(styles) весь набор классов стилей,
        // который будет доступен из константы classes
        const {classes} = this.props
        const {cartItems} = this.props.cartStore
        return <Router history={history}>
            <div className={classes.root}>
                <AppBar position='sticky' className={classes.navBar}>
                    <Toolbar>
                        <Typography variant='h6' className={classes.title}>
                            ReactSPA
                        </Typography>
                        <AppBarCollapse routes={routes}/>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="sm" className={classes.container}>
                    {routes.map(({path, Component}) => (
                        <Route key={path} exact path={path}>
                            {({match}) => (
                                <CSSTransition
                                    in={match != null}
                                    timeout={300}
                                    classNames='page'
                                    unmountOnExit
                                >
                                    <div className='page'>
                                        <Component/>
                                    </div>
                                </CSSTransition>
                            )}
                        </Route>
                    ))}
                </Container>
                <Modal
                    open={!!this.props.commonStore.error}
                    onClose={this.handleErrorModalClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    className={classes.modal}
                >
                    <div className={classes.modalContent}>
                        {this.props.commonStore.error}
                    </div>
                </Modal>
                <Modal
                    open={!!this.props.cartStore.cartShown}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    className={classes.modal}
                >
                    <div className={classes.cartModalContent}>
                        <div id="simple-modal-title">
                            <h2>Shopping Cart</h2>
                            <IconButton
                                onClick={this.handleCartModalClose}
                                className={classes.closeButton}>
                                <Icon>close</Icon>
                            </IconButton>
                        </div>
                        <div id="simple-modal-description">
                            {this.props.cartStore.cartItemsCount > 0 ? (
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>name</th>
                                        <th>price</th>
                                        <th>quantity</th>
                                        <th>total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cartItems.map(item => {
                                        return (
                                            <tr>
                                                <td scope="row">{item.name}</td>
                                                <td>{item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>{(item.price * item.quantity).toFixed(2)}</td>
                                                <td>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={3}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    this.handleCartItemPlus(e, item.productId)
                                                                }}>
                                                                <Icon>exposure_plus_1</Icon>
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    this.handleCartItemMinus(e, item.productId)
                                                                }}>
                                                                <Icon>exposure_neg_1</Icon>
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <Button
                                                                onClick={(e) => {
                                                                    this.handleCartItemDelete(e, item.productId)
                                                                }}>
                                                                <Icon>clear</Icon>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                        <td>
                                            <strong>
                                                Total
                                            </strong>
                                        </td>
                                        <td>
                                            <strong>
                                                {this.props.cartStore.cartItemsTotalPrice}
                                            </strong>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <span>Your cart is empty</span>
                            )}
                        </div>
                    </div>
                </Modal>
            </div>
        </Router>
    }
}

export default withStyles(styles)(App)