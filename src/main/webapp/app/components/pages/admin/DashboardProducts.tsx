import React, { Component } from 'react'
import {Button, Card, CardTitle, Col, Icon, Row, SideNav, SideNavItem, Table, TextInput} from "react-materialize"
import { NavLink } from 'react-router-dom'
import {inject, observer} from "mobx-react"

@inject("commonStore", "productStore")
@observer
class DashboardProducts extends Component {
    componentDidMount() {
        this.props.productStore.fetchProducts()
    }

    handleProductNameChange = e => {
        this.props.productStore.setProductName(e.target.value)
    }

    handleSubmitForm = e => {
        // предотвращаем отправку данных формы на сервер браузером
        // и перезагрузку страницы
        e.preventDefault()
        this.props.productStore.add()
    }

    render () {
        const { loading } = this.props.commonStore
        const { products } = this.props.productStore

        return <Row>
            <h2>Products</h2>
            <SideNav
                id='productFormSideNav'
                options={{
                    draggable: true
                }}
                trigger={
                    <Button
                        tooltip="Add a new product"
                        tooltipOptions={{
                            position: 'top'
                        }}
                        icon={<Icon>add</Icon>}
                    />
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
                                    label={'product name'}
                                    validate
                                    onChange={this.handleProductNameChange}
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
                        </Row>
                    </form>
                </Col>
            </SideNav>
            <Table>
                <thead>
                <tr>
                    <th data-field="id">ID</th>
                    <th data-field="name">Name</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => {
                    /* выводим на панель навигации список категорий*/
                    return (
                        <tr>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>
                                <div data-product-id={product.id}>
                                    <Button
                                        node="button"
                                        waves="light">
                                        <Icon>edit</Icon>
                                    </Button>
                                    <Button
                                        node="button"
                                        waves="light">
                                        <Icon>delete</Icon>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )

                })}
                </tbody>
            </Table>
        </Row>
    }
}

export default DashboardProducts