import { makeAutoObservable, toJS } from "mobx";
import axios from 'axios';
import api, { API_URL } from "./api";

class ResourceStore {
    resources = [];

    constructor() { makeAutoObservable(this); }
    setResources(resources) { this.resources = resources; }

    async updateResources() {
        try {
            const res = await api.get('/resource')
            this.setResources(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    async getResources() {
        try {
            return toJS(this.resources);
        } catch (e) {
            console.log(e);
        }
    }

}

export default new ResourceStore()
