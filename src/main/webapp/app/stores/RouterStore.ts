import {action, observable} from "mobx"
import Home from "../components/pages/Home";
import Shopping from "../components/pages/Shopping";
import SignIn from "../components/pages/SignIn";
import SignUp from "../components/pages/SignUp";

class RouterStore {

    // список моделей роутов для гостя
    private anonymousRoutes: Array<object> = [
        { path: '/', name: 'Home', Component: Home },
        { path: '/shopping', name: 'Shopping', Component: Shopping },
        { path: '/signin', name: 'Sign in', Component: SignIn },
        { path: '/signup', name: 'Sign up', Component: SignUp }
    ]

    // список моделей роутов для аунтентифицированного пользователя
    private loggedRoutes: Array<object> = [
        { path: '/', name: 'Home', Component: Home },
        { path: '/shopping', name: 'Shopping', Component: Shopping },
        { path: '/auth:out', name: 'Sign out', Component: Home }
    ]

    // наблюдаемый текущий список роутов
    // (по умолчнию - для гостя)
    @observable routes: Array<object> = this.anonymousRoutes

    // установить в качестве текущего список роутов для гостя
    @action setAnonymousRoutes() {
        this.routes = this.anonymousRoutes
    }

    // установить в качестве текущего список роутов для аунтентифицированного пользователя
    @action setLoggedRoutes() {
        this.routes = this.loggedRoutes
    }
}

export default new RouterStore()