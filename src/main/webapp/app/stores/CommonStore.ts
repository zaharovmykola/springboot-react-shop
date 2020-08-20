import {action, observable} from "mobx"

class CommonStore {

    @observable loading: Boolean = true
    @observable error: String = "hello error"

    @action setLoading(loading) {
        this.loading = loading
    }

    @action setError(error) {
        this.error = error
    }

    @action clearError() {
        this.error = null
    }
}
export default new CommonStore()