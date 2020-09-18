import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import Resizer from 'react-image-file-resizer'
import {reaction} from "mobx"
import Compress from "compress.js"
import {Button, Drawer, Icon, Table, TextField, withStyles, WithStyles} from "@material-ui/core";
import {CommonStore} from "app/stores/CommonStore";
import {ProductStore} from "app/stores/ProductStore";
import {CategoryStore} from "app/stores/CategoryStore";

interface IProps extends WithStyles<typeof styles> {
	commonStore: CommonStore,
	productStore: ProductStore,
	categoryStore: CategoryStore
}

interface IState {
	// режимы формы: добавить / редактировать
	formMode: string,
	// флаг: отображать ли сейчас панель
	sidePanelVisibility: boolean
}

const styles = theme =>
	({
		title: {
			display: 'inline',
			marginRight: 15
		},
		productsTableColumnsHeader: {
			'& > th': {
				textAlign: 'left'
			}
		},
	})

@inject('commonStore', 'productStore', 'categoryStore')
@observer
class DashboardProducts extends Component<IProps, IState> {

	constructor(props) {
		super(props)
		this.state = {
			formMode: 'add',
			sidePanelVisibility: false
		}
	}

	componentDidMount() {
		//this.props.categoryStore.fetchCategories()
		this.props.productStore.fetchProducts()
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
		// разрешенный способ изменения свойств состояния компонента
		// (асинхронная отправка изменений только тех свойств состояния, которые указаны в аргументе)
		this.setState({sidePanelVisibility: open})
	}

	handleProductNameChange = e => {
		// e.preventDefault()
		// e.stopPropagation()
		this.props.productStore.setProductName(e.target.value)
	}

	handleProductAdd = (e) => {
		this.setState({formMode: 'add'})
		this.setState({sidePanelVisibility: true})
	}

	handleSubmitForm = e => {
		// предотвращаем отправку данных формы на сервер браузером
		// и перезагрузку страницы
		e.preventDefault()
		this.setState({sidePanelVisibility: false})
		if (this.state.formMode === 'add') {
			this.props.productStore.add()
		} else {
			this.setState({formMode: 'add'})
			this.props.productStore.update()
		}
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
		const { categories } = this.props.categoryStore
		const { classes } = this.props
		return <div>
			<h2 className={classes.title}>Products</h2>
			<Button
				variant='outlined'
				disabled={loading}
				onClick={this.handleProductAdd}
			>
				Add
				<Icon>
					add
				</Icon>
			</Button>
			<Drawer
				open={ this.state.sidePanelVisibility } onClose={this.toggleDrawer(false)}>
				<form>
					<div>
						<TextField
							id="name"
							label={'product name'}
							value={this.props.productStore.currentProduct.title}
							onChange={this.handleProductNameChange}
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
			<Table>
				<thead>
				<tr className={classes.productsTableColumnsHeader}>
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

export default withStyles(styles) (DashboardProducts)