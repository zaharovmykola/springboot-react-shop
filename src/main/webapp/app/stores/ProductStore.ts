import {action, observable} from 'mobx'
import Product from '../models/ProductModel'
import commonStore from './CommonStore'
import Category from "app/models/CategoryModel";

class ProductStore {

	private HTTP_STATUS_OK: number = 200
	private HTTP_STATUS_CREATED: number = 201

	@observable currentProduct: Product = new Product()

	@observable products: Array<Product> = []

	@observable currentProductImage: string

	@observable currentProductId: BigInteger = null

	@action setProductTitle(title: string) {
		this.currentProduct.title = title
	}

	@action setProductCategory(categoryId: number) {
		this.currentProduct.categoryId = categoryId
	}

	@action setCurrentProduct(product: Product) {
		this.currentProduct = product
	}

	@action setProductName(name: string) {
		this.currentProduct.title = name
	}

	@action setCurrentProductId(id: BigInteger) {
		this.currentProductId = id
	}

	@action setProductDescription(description: string){
		this.currentProduct.description = description
	}

	@action setProductImage(image: string){
		this.currentProduct.image = image
		this.currentProductImage = image
	}
	// пробую с екшн
	///////////////////////////////////////////////////////////////
	@action deleteProduct() {
		commonStore.clearError()
		commonStore.setLoading(true)
		fetch('/eCommerceShop/api/products/' + this.currentProductId,{
			method: 'DELETE'
		}).then((response) => {
			return response.json()
		}).then(responseModel => {
			if (responseModel) {
				if (responseModel.status === 'success') {
					this.fetchProducts()
					this.setCurrentProductId(null)
				} else if (responseModel.status === 'fail') {
					commonStore.setError(responseModel.message)
				}
			}
		}).catch((error) => {
			commonStore.setError(error.message)
			throw error
		}).finally(action(() => {
			commonStore.setLoading(false)
		}))
	}
	///////////////////////////////////////////////////////////////

	@action fetchProducts() {
		commonStore.clearError()
		commonStore.setLoading(true)
		fetch('/eCommerceShop/api/products', {
			method: 'GET'
		}).then((response) => {
			return response.json()
		}).then(responseModel => {
			if (responseModel) {
				if (responseModel.status === 'success') {
					// полученный объект модели может содержать
					// свойства, значения которых закодированы из UTF-8 в ASCII,
					// поэтому производим полное раскодирование:
					// ts-object конвертируем в json-string (stringify),
					// декодируем (decodeURIComponent)
					// json-string конвертируем в  ts-object (parse)
					this.products =
						JSON.parse(
							decodeURIComponent(
								JSON.stringify(responseModel.data)
									.replace(/(%2E)/ig, '%20')
							)
						)
				} else if (responseModel.status === 'fail') {
					commonStore.setError(responseModel.message)
				}
			}
		}).catch((error) => {
			commonStore.setError(error.message)
			throw error
		}).finally(action(() => {
			commonStore.setLoading(false)
		}))
	}

	@action add () {
		commonStore.clearError()
		commonStore.setLoading(true)
		fetch('/eCommerceShop/api/products', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				'title': encodeURIComponent(this.currentProduct.title),
				'description': encodeURIComponent(this.currentProduct.description),
				'categoryId': this.currentProduct.categoryId,
				'image': this.currentProduct.image
			})
		}).then((response) => {
			return response.status
		}).then(responseStatusCode => {
			if (responseStatusCode) {
				if (responseStatusCode === this.HTTP_STATUS_CREATED) {
					this.fetchProducts()
					this.setProductTitle('')
				}
			}
		}).catch((error) => {
			commonStore.setError(error.message)
			throw error
		}).finally(action(() => {
			commonStore.setLoading(false)
		}))
	}

	@action update () {
		commonStore.clearError()
		commonStore.setLoading(true)
		fetch(`/eCommerceShop/api/products/${this.currentProduct.id}`,{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({'name': encodeURIComponent(this.currentProduct.title)})
		}).then((response) => {
			return response.status
		}).then(responseStatusCode => {
			if (responseStatusCode) {
				if (responseStatusCode === this.HTTP_STATUS_OK) {
					this.fetchProducts()
					this.setProductTitle('')
					this.setCurrentProduct(new Product())
				}
			}
		}).catch((error) => {
			commonStore.setError(error.message)
			throw error
		}).finally(action(() => {
			commonStore.setLoading(false)
		}))
	}

}
export {ProductStore}
export default new ProductStore()