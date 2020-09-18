import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import Resizer from 'react-image-file-resizer'
import {reaction} from "mobx"
import Compress from "compress.js"
import {Button, Icon, Table} from "@material-ui/core";

@inject('commonStore', 'productStore', 'categoryStore')
@observer
class DashboardProducts extends Component {

	componentDidMount() {
		this.props.categoryStore.fetchCategories()
		this.props.productStore.fetchProducts()
	}

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
		const file = e.target.files[0]
		this.resizeFile(file).then(image => {
			console.log(image)
			this.props.productStore.setProductImage(image)
		})
	}

	handleProductEdit = (e, productId) => {
		this.setState({formMode: 'edit'})
		this.setState({sidePanelVisibility: true})
		const currentProduct =
			this.props.productStore.products.find(c => c.id === productId)
		this.props.productStore.setCurrentProduct(currentProduct)
	}

	handleProductDelete = (e, productId) => {
		this.props.productStore.setCurrentProductId(productId)
		this.props.productStore.deleteProduct()
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
		)
	})

	render() {
		const {loading} = this.props.commonStore
		const {products} = this.props.productStore
		const {categories} = this.props.categoryStore
		return <div>
			<h2>Products</h2>
			{/*<SideNav
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
                                />
                            </Col>
                            <Col s={12}>
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
            </SideNav>*/}
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
										onClick={(e) => {
											this.handleProductEdit(e, product.id)
										}}>
										<Icon>edit</Icon>
									</Button>
									<Button
										onClick={(e) => {
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
		</div>
	}
}

export default DashboardProducts