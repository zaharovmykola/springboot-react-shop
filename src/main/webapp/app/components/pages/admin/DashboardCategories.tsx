import React, { Component } from 'react'
import {Button, Card, CardTitle, Col, Icon, Row, SideNav, SideNavItem, TextInput} from "react-materialize"
import { NavLink } from 'react-router-dom'
import {inject, observer} from "mobx-react"

@inject("commonStore", "categoryStore")
@observer
class DashboardCategories extends Component {
    handleSubmitForm = e => {
        // предотвращаем отправку данных формы на сервер браузером
        // и перезагрузку страницы
        e.preventDefault()
        // this.props.userStore.login()
    }
    //////////////////////////////////////////////////////////////
    // как я понимаю мы здесь просто записали категории в массив categories
    componentDidMount() {
        this.props.categoryStore.fetchCategories()
    }
    //////////////////////////////////////////////////////////////
    render () {
        const { loading } = this.props.commonStore
        return <Row>
            <SideNav
                id='categoryFormSideNav'
                options={{
                    draggable: true
                }}
                trigger={
                    <Button icon={<Icon>add</Icon>}/>
                }
            >
                <Col
                    s={12}
                >
                    <form>
                        <Row>
                            <Col s={12} >
                                <TextInput
                                    id="name"
                                    label={'category name'}
                                    validate
                                />
                            </Col>
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
                            <button className="btn waves-effect waves-light" type="submit" name="action">
                                Submit
                                <i className="material-icons right">send</i>
                            </button>
                        </Row>
                    </form>
                </Col>
            </SideNav>
            {/* TODO Добавьте верхнюю и нижнюю части таблицы категорий, а между ними сгенерируйте из списка моделей набор строк таблицы */}
            //////////////////////////////////////////////////////////////
            // а здесь как я понимаю мы должны их просто вывести на екрна при переходе на вкладку

            const { categories } = this.props.categoryStore
            categories.fetchCategories()
            {categories.map(category => {
                /* выводим на панель навигации список категорий*/
                return <NavLink
                    activeClassName="active"
                    exact
                >
                <Row>
                    <Col>
                        {category.id}
                    </Col>
                    <Col>
                        {category.name}
                    </Col>
                </Row>
                </NavLink>

            })}

            //////////////////////////////////////////////////////////////
        </Row>
    }
}

export default DashboardCategories