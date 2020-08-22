import {action, observable} from "mobx"
import Category from '../models/CategoryModel'
import commonStore from './CommonStore'
import User from "app/models/UserModel";

class CategoryStore {

    private httpStatusOk: number = 200

    @observable currentCategory: Category = new Category()

    @observable categories: Array<Category> = []

    @action setCategoryName(name: string) {
        this.currentCategory.name = name
    }

    @action fetchCategories() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch('api/categories',{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    this.categories = responseModel.data
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


}