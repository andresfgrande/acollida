import {createStore} from "vuex";
import rootMutations from "./mutations";
import rootActions from "./actions";
import rootGetters from "./getters";
import authModule from "./modules/auth/index";

const store = createStore({
    modules: {
        auth: authModule
    },
    state(){
        return{
            isLoggedIn: false,
        }
    },
    mutations: rootMutations,
    actions: rootActions,
    getters:  rootGetters
});

export default store;