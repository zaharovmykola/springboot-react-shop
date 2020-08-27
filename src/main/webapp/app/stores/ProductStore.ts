import {action, observable} from 'mobx'
import Product from '../models/ProductModel'
import commonStore from './CommonStore'
import User from 'app/models/UserModel';

class ProductStore {

	private HTTP_STATUS_CREATED: number = 201

	@observable currentProduct: Product = new Product()

	@observable products: Array<Product> = []

	@action setProductTitle(title: string) {
		this.currentProduct.title = title
	}

	@action setProductCategory(categoryId: number) {
		this.currentProduct.categoryId = categoryId
	}

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
				'categoryId': this.currentProduct.categoryId
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
}
export default new ProductStore()