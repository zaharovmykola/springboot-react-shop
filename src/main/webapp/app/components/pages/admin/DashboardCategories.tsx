import React, { Component } from 'react'
import {Button, Card, CardTitle, Col, Icon, Row, SideNav, SideNavItem, Table, TextInput} from 'react-materialize'
import { NavLink } from 'react-router-dom'
import {inject, observer} from 'mobx-react'

@inject('commonStore', 'categoryStore')
@observer
class DashboardCategories extends Component {

	componentDidMount() {
		this.props.categoryStore.fetchCategories()
	}

	handleCategoryNameChange = e => {
		this.props.categoryStore.setCategoryName(e.target.value)
	}
	///////////////////////////////////////////////////////////////
	// пробую с обработчиком
	handleCategoryDelete = (e, categoryId) => {
		e.preventDefault()
		this.props.categoryStore.deleteCategory(categoryId)
	}
	///////////////////////////////////////////////////////////////
	handleSubmitForm = e => {
		// предотвращаем отправку данных формы на сервер браузером
		// и перезагрузку страницы
		e.preventDefault()
		this.props.categoryStore.add()
	}

	render () {
		const { loading } = this.props.commonStore
		const { categories } = this.props.categoryStore
		// const { currentCategory } = this.props.categoryStore
		// const categoryName = currentCategory.name
		return <Row>
			<h2>Categories</h2>
			<SideNav
				id='categoryFormSideNav'
				options={{
					draggable: true
				}}
				trigger={
					<Button
						tooltip='Add a new category'
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
									id='name'
									label={'category name'}
									validate
									onChange={this.handleCategoryNameChange}
								/>
							</Col>
						</Row>
						<Row>
							<Button
								node='button'
								waves='light'
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
					<th data-field='id'>ID</th>
					<th data-field='name'>Name</th>
				</tr>
				</thead>
				<tbody>
				{categories.map(category => {
					/* выводим на панель навигации список категорий*/
					return (
						<tr>
							<td>{category.id}</td>
							<td>{category.name}</td>
							<td>
								<div data-category-id={category.id}>
									<Button
										node='button'
										waves='light'>
										<Icon>edit</Icon>
									</Button>
									<Button
										node='button'
										waves='light'
										onClick={ e => {
											this.handleCategoryDelete(e, category.id)
										}}>
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

export default DashboardCategories