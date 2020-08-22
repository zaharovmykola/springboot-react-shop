import React, { Component } from 'react'
import {Card, CardTitle, Col, Icon, Row} from "react-materialize"
import { NavLink } from 'react-router-dom'

class Dashboard extends Component {
    render () {
        return <Row>
            <Col
                s={12}
                m={4}
                l={4}
                xl={4}
            >
                <Card
                    actions={[
                        <NavLink
                            key={'/admin/categories'}
                            as={NavLink}
                            to={'/admin/categories'}
                        >
                            Go
                        </NavLink>
                    ]}
                    closeIcon={<Icon>close</Icon>}
                    header={
                        <CardTitle image="images/category-tree.jpg">Categories</CardTitle>
                    }
                    horizontal
                    revealIcon={<Icon>more_vert</Icon>}
                >
                    Product Categories
                </Card>
            </Col>
            <Col
                s={12}
                m={4}
                l={4}
                xl={4}
            >
                <Card
                    actions={[
                        <NavLink
                            key={'/admin/products'}
                            as={NavLink}
                            to={'/admin/products'}
                        >
                            Go
                        </NavLink>
                    ]}
                    closeIcon={<Icon>close</Icon>}
                    header={
                        <CardTitle image="images/goods.jpg">Goods</CardTitle>
                    }
                    horizontal
                    revealIcon={<Icon>more_vert</Icon>}
                >
                    Goods List
                </Card>
            </Col>
        </Row>
    }
}

export default Dashboard