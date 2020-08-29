import React, {Component} from 'react'
import {
	Button,
	Col,
	Icon,
	Row,
	Select,
	SideNav,
	Table,
	TextInput
} from 'react-materialize'
import {inject, observer} from 'mobx-react'
import Resizer from 'react-image-file-resizer'

@inject('commonStore', 'productStore', 'categoryStore')
@observer
class DashboardProducts extends Component {

	componentDidMount() {
		this.props.categoryStore.fetchCategories()
		this.props.productStore.fetchProducts()
	}

	///////////////////////////////////////////////////////////////
	// пробую с обработчиком
	handleProductDelete = (e, productId) => {
		e.preventDefault()
		this.props.productStore.deleteProduct(productId)
	}
	///////////////////////////////////////////////////////////////

	handleProductTitleChange = e => {
		this.props.productStore.setProductTitle(e.target.value)
	}

	handleProductDescriptionChange = e => {
		this.props.productStore.setProductDescription(e.target.value)
	}

	handleProductCategoryChange = e => {
		this.props.productStore.setProductCategory(e.target.value)
	}

	handleProductImageChange = e => {
		const file = e.target.files[0];
		this.resizeFile(file).then(image => {
			console.log(image)
			this.props.productStore.setProductImage(image)
		})
	}

	handleSubmitForm = e => {
		// предотвращаем отправку данных формы на сервер браузером
		// и перезагрузку страницы
		e.preventDefault()
		this.props.productStore.add()
	}

	resizeFile = (file) => new Promise(resolve => {
		Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0,
			uri => {
				resolve(uri);
			},
			'base64'
		);
	})

	render() {
		const {loading} = this.props.commonStore
		const {products} = this.props.productStore
		const {categories} = this.props.categoryStore
		return <Row>
			<h2>Products</h2>
			<SideNav
				id='productFormSideNav'
				options={{
					draggable: true
				}}
				trigger={
					<Button
						tooltip='Add a new product'
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
							<Col s={12}>
								<TextInput
									id='title'
									label={'product title'}
									validate
									onChange={this.handleProductTitleChange}
								/>
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<TextInput
									id='description'
									label={'product description'}
									validate
									onChange={this.handleProductDescriptionChange}
								/>
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<Select
									id='category-select'
									multiple={false}
									onChange={this.handleProductCategoryChange}
									options={{
										classes: '',
										dropdownOptions: {
											alignment: 'left',
											autoTrigger: true,
											closeOnClick: true,
											constrainWidth: true,
											coverTrigger: true,
											hover: true,
											inDuration: 150,
											onCloseEnd: null,
											onCloseStart: null,
											onOpenEnd: null,
											onOpenStart: null,
											outDuration: 250
										}
									}}
									value=''
								>
									<option
										disabled
										value=''
									>
										Category
									</option>
									{categories.map(category => {
										/* выводим на панель навигации список категорий*/
										return (
											<option
												value={category.id}
											>
												{category.name}
											</option>
										)
									})}
								</Select>
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<TextInput
									id="productImageInput"
									label="Image"
									type="file"
									onChange={this.handleProductImageChange}
									key={'productImageInput'}
								/>
							</Col>
							<Col s={12} key={'productImagePreview'}>
								<img id="productImagePreview" className="responsive-img" src={this.props.productStore.currentProductImage}></img>
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
					<th data-field='title'>Name</th>
					<th data-field='description'>Description</th>
					<th data-field='quantity'>Quantity</th>
					<th data-field='price'>Price</th>
				</tr>
				</thead>
				<tbody>
				{products.map(product => {
					/* выводим на панель навигации список категорий*/
					return (
						<tr>
							<td>{product.id}</td>
							<td>{product.title}</td>
							<td>{product.description}</td>
							<td>{product.quantity}</td>
							<td>{product.price}</td>
							<td>
								<div data-product-id={product.id}>
									<Button
										node='button'
										waves='light'>
										<Icon>edit</Icon>
									</Button>
									<Button
										node='button'
										waves='light'
										onClick={ e => {
											this.handleProductDelete(e, product.id)
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

export default DashboardProducts