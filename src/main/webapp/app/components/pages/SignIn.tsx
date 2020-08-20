import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import {Button, Card, Col, Icon, Row, TextInput} from "react-materialize"
import {inject, observer} from "mobx-react"
import {reaction} from "mobx"

@inject("commonStore", "userStore", "routerStore")
@withRouter
@observer
class SignIn extends Component {
    componentWillUnmount() {
        this.props.userStore.reset()
    }

    // обработчик события изменения значения в поле
    // ввода имени пользователя
    handleUserNameChange = e => {
        // установка свойства состояния "имя пользователя"
        // (читаем из аргументов события атрибут value поля ввода,
        // для коротого обрабатывается событие)
        this.props.userStore.setUserName(e.target.value)
    }

    handlePasswordChange = e => {
        this.props.userStore.setPassword(e.target.value)
    }

    handleSubmitForm = e => {
        // предотвращаем отправку данных формы на сервер браузером
        // и перезагрузку страницы
        e.preventDefault()
        // вызываем в хранилище действие входа в учетную запись
        this.props.userStore.login()
    }

    // установка обработчика события изменения значения
    // в свойстве userStore.user хранилища -
    // задано первым аргументом функции reaction;
    // второй аргумент - функция, которая будет выполнена
    // в ответ на изменения свойства userStore.user,
    // при этом функция -второй аргумент получает в качестве своего аргумента
    // данные, которые изменились (новую версию)
    userReaction = reaction(
        () => this.props.userStore.user, // следим за свойством user
        (user) => {
            // при изменении значения свойства user
            if (user) {
                // если user установлен -
                // выполняем переход на раздел "Главная"
                this.props.history.replace("/")
                // и меняем текущий список моделей роутов
                // - на список моделей роутов для вошедшего пользователя
                this.props.routerStore.setLoggedRoutes()
            } else {
                // если пользователь не установлен -
                // выполняем переход на раздел "Вход"
                this.props.history.replace("/signin")
                // и меняем текущий список моделей роутов
                // - на список моделей роутов для пользователя-гостя
                this.props.routerStore.setAnonymousRoutes()
            }
        }
    )
    render () {
        const { loading } = this.props.commonStore
        const { userName, password } = this.props.userStore
        return (
            <Row>
                <Col
                    s={12}
                >
                    <Card
                        className="grey lighten-2"
                        closeIcon={<Icon>close</Icon>}
                        title="Sign In"
                    >
                        <Row>
                            <Col
                                s={12}
                            >
                                <form>
                                    <Row>
                                        <TextInput
                                            s={12}
                                            label='Login'
                                            validate
                                            value={userName}
                                            onChange={this.handleUserNameChange}
                                        />
                                    </Row>
                                    <Row>
                                        <TextInput
                                            s={12}
                                            label='Password'
                                            validate
                                            value={password}
                                            onChange={this.handlePasswordChange}
                                        />
                                    </Row>
                                    <Row>
                                        <Button
                                            node="button"
                                            waves="light"
                                            disabled={loading}
                                            onClick={this.handleSubmitForm}
                                        >
                                            Submit
                                            <Icon right>
                                                send
                                            </Icon>
                                        </Button>
                                    </Row>
                                </form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        )
    }
}

export default SignIn