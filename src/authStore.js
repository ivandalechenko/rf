import { makeAutoObservable } from "mobx";
import axios from 'axios';
import api, { API_URL } from "./api";

class AuthStore {
    isAuth = false;
    lastUserUpdate = null; // Поле для хранения времени последнего обновления пользователя
    isLoading = false;
    afkFarm = 0;

    setUser(user) {
        // console.log('Движ');
        this.user = user;
        this.afkFarm = user.autoFarmed;
        this.lastUserUpdate = Date.now(); // Записываем текущее время при обновлении пользователя
        this.startIdleTimeout(); // Запускаем таймаут для проверки бездействия
    }

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setLoader(bool) {
        this.isLoading = bool;
    }



    async login(tgUserId) {
        try {
            const response = await api.post('/user/login', { tgId: tgUserId })
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e);
        }
    }

    async logout() {
        try {
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
            await api.post('/user/logout');
        } catch (e) {
            console.log(e);
        }
    }

    async checkAuth() {
        try {
            const response = await axios.get(`${API_URL}user/refresh`, { withCredentials: true })
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e);
            this.logout()
        }
    }

    async updateUser() {

        const response = await api.get('/user/me')
        this.setUser(response.data)
    }

    startIdleTimeout() {
        // Запускаем таймаут для проверки бездействия пользователя
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
        }
        this.idleTimeout = setTimeout(async () => {
            // console.log('Давно не было движа, обновляюсь');
            // await this.updateUser()
        }, 5 * 1000);
    }
}

export default new AuthStore();