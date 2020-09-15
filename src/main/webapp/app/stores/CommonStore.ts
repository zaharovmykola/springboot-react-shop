import {action, observable} from "mobx"

class CommonStore {

    @observable loading: boolean = false
    @observable error: string = null

    @action setLoading(loading: boolean): void {
        this.loading = loading
    }

    @action setError(error: string): void {
        this.error = error
    }

    @action clearError(): void {
        this.error = null
    }
}
export {CommonStore}
export default new CommonStore()