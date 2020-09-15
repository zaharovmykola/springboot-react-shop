import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import {inject, observer} from "mobx-react"
import Category from '../../../models/CategoryModel'
import {reaction} from 'mobx'
import {CategoryStore} from "app/stores/CategoryStore";
import {CommonStore} from "app/stores/CommonStore";
import {Button, Drawer, Icon, Table, TextField} from "@material-ui/core";

interface IProps {
	commonStore: CommonStore,
	categoryStore: CategoryStore
}

interface IState {
	formMode: string,
	sidePanelVisibility: boolean
}

@inject("commonStore", "categoryStore")
@observer
class DashboardCategories extends Component<IProps, IState> {

	constructor(props) {
		super(props)
		this.state = {
			formMode: 'add',
			sidePanelVisibility: false
		}
	}

	componentDidMount() {
		/* document.getElementById('categoryFormSideNav')
            .style
            .transform = 'translateX(0%)' */
		this.props.categoryStore.fetchCategories()
	}

	toggleDrawer = (open: boolean) => (
		event: React.KeyboardEvent | React.MouseEvent,
	) => {
		if (
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}
		this.setState({sidePanelVisibility: open})
	}

	handleCategoryNameChange = e => {
		// e.preventDefault()
		// e.stopPropagation()
		this.props.categoryStore.setCategoryName(e.target.value)
	}

	handleCategoryEdit = (e, categoryId) => {
		this.setState({formMode: 'edit'})
		this.setState({sidePanelVisibility: true})
		/* console.log(document.getElementById('categoryFormSideNav'))
        document.getElementById('categoryFormSideNav')
            .style
            .transform = 'translateX(105%)'
        console.log(document.getElementById('categoryFormSideNav')) */
		const currentCategory =
			this.props.categoryStore.categories.find(c => c.id === categoryId)
		this.props.categoryStore.setCurrentCategory(currentCategory)
	}

	handleSubmitForm = e => {
		// предотвращаем отправку данных формы на сервер браузером
		// и перезагрузку страницы
		e.preventDefault()
		this.setState({sidePanelVisibility: false})
		if (this.state.formMode === 'add') {
			this.props.categoryStore.add()
		} else {
			this.setState({formMode: 'add'})
			this.props.categoryStore.update()
		}
	}

	/* currentCategoryChanged = reaction(
        () => this.props.categoryStore.currentCategory.name,
        (currentCategoryName) => {
            console.log(currentCategoryName)
            M.updateTextFields()
            console.log(document.getElementById('categoryFormSideNav'))
            document.getElementById('categoryFormSideNav')
                .style
                .transform = 'translateX(105%)'
            console.log(document.getElementById('categoryFormSideNav'))
        }
    ) */

	render () {
		const { loading } = this.props.commonStore
		const { categories } = this.props.categoryStore
		/* const { currentCategory } =
            this.props.categoryStore.currentCategory */
		return <div>
			<h2>Categories</h2>
			<Drawer
				open={ this.state.sidePanelVisibility } onClose={this.toggleDrawer(false)}>
				<form>
					<div>
						<TextField
							id="name"
							label={'category name'}
							value={this.props.categoryStore.currentCategory.name}
							onChange={this.handleCategoryNameChange}
						/>
					</div>
					<div>
						<Button
							disabled={loading}
							onClick={this.handleSubmitForm}
						>
							Submit
							<Icon>
								send
							</Icon>
						</Button>
					</div>
				</form>
			</Drawer>
			{/*<SideNav
                id='categoryFormSideNav'
                options={{
                    onCloseStart: (e) => {
                        console.log(e)
                    }
                }}
                trigger={
                    <Button
                        tooltip="Add a new category"
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
                                    label={'category name'}
                                    validate
                                    value={this.props.categoryStore.currentCategory.name}
                                    onChange={this.handleCategoryNameChange}
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
            </SideNav>*/}
			<Table>
				<thead>
				<tr>
					<th data-field="id">ID</th>
					<th data-field="name">Name</th>
				</tr>
				</thead>
				<tbody>
				{categories.map(category => {
					return (
						<tr>
							<td>{category.id}</td>
							<td>{category.name}</td>
							<td>
								<div data-category-id={category.id}>
									<Button
										onClick={(e) => {
											this.handleCategoryEdit(e, category.id)
										}}>
										<Icon>edit</Icon>
									</Button>
									<Button>
										<Icon>delete</Icon>
									</Button>
								</div>
							</td>
						</tr>
					)
				})}
				</tbody>
			</Table>
		</div>
	}
}

export default DashboardCategories