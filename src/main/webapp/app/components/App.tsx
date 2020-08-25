import React, { Component } from 'react'
import {Container, Icon, Navbar, NavItem, Toast} from 'react-materialize'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min'
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

@inject("routerStore", "userStore")
@observer
class App extends Component {
    // установка обработчика события изменения значения
    // в свойстве userStore.user хранилища -
    // задано первым аргументом функции reaction;
    // второй аргумент - функция, которая будет выполнена
    // в ответ на изменения свойства userStore.user,
    // при этом функция -второй аргумент -  получает в качестве своего аргумента
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
        return <Router history={history}>
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