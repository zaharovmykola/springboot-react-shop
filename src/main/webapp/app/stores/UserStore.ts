import {action, observable} from "mobx"
import User from '../models/UserModel'
import commonStore from './CommonStore'

class UserStore {

    private HTTP_STATUS_OK: number = 200
    private HTTP_STATUS_NO_CONTENT: number = 204

    // current user
    @observable user: User = null
    // username input
    @observable userName: string = ''
    // password input
    @observable password: string = ''

    @action setUser(user: User) {
        this.user = user
    }

    @action setUserName(userName: string) {
        this.userName = userName
    }

    @action setPassword(password: string) {
        this.password = password
    }

    @action reset() {
        this.userName = ''
        this.password = ''
    }

    @action login () {
        // сброс текста возможной предыдущей ошибки
        commonStore.clearError()
        // включение анимации ожидания
        commonStore.setLoading(true)
        // const formData: FormData = new FormData()
        // formData.append('username', this.userName)
        //formData.append('password', this.password)
        // запрос на стандартную конечную точку /login
        // Spring Security Web API
        // с передачей имени и пароля пользователя для входа в учетную запись
        fetch('login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${this.userName}&password=${this.password}`
        }).then((response) => {
            // из полученного отклика сервера извлечь код статуса
            // и передать для дальнейшей обработки
            return response.status
        }).then((statusCode) => {
            // если в объекте отклика код статуса равен 200
            if (statusCode == this.HTTP_STATUS_OK) {
                // запрос на конечную точку рест-контроллера аутентификации
                // для проверки наличия веб-сеанса
                // и для получения сведений о текущем пользователе
                fetch('api/auth/user/check', {
                    method: 'GET'
                }).then((response) => {
                    // из полученного отклика сервера извлечь тело - json-string,
                    // преобразовать в json-object
                    // и передать для дальнейшей обработки
                    return response.json()
                }).then((response) => {
                    // если объект отклика сервера получен
                    if (response) {
                        if (response.status === 'success') {
                            if (response.data) {
                                this.user = new User(response.data.name)
                            }
                        } else if (response.status === 'fail') {
                            // установка в переменную хранилища сообщения об ошибке
                            commonStore.setError(response.message)
                        }
                    }
                }).catch((error) => {
                    // установка в переменную хранилища сообщения об ошибке
                    commonStore.setError(error.message)
                    // перевыброс объекта аргументов исключения
                    throw error
                })
            }
        }).catch((error) => {
            // установка в переменную хранилища сообщения об ошибке
            commonStore.setError(error.message)
            // перевыброс объекта аргументов исключения
            throw error
        }).finally(action(() => {
            // отключение анимации ожидания
            commonStore.setLoading(false)
        }))
    }

    @action logout () {
        commonStore.setLoading(true)
        fetch('logout', {
            method: 'GET'
        }).then((response) => {
            return response.status
        }).then((statusCode) => {
            if (statusCode == this.HTTP_STATUS_NO_CONTENT) {
                this.user = null
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }
}
export default new UserStore()