import axios from "axios";


export const getAuthToken = () => {
    return window.localStorage.getItem('auth_token');
};

export const getTen = () => {
    return window.localStorage.getItem('ten');
};

export const getUsername = () => {
    return window.localStorage.getItem('username');
};

export const getEmail = () => {
    return window.localStorage.getItem('email');
};

export const getRole = () => {
    return window.localStorage.getItem('role');
};

export const getGiohang = () => {
    return window.localStorage.getItem('giohang');
};

export const setAuthHeader = (token) => {
    window.localStorage.setItem('auth_token', token);
};

export const setTen = (username) => {
    window.localStorage.setItem('ten', username);
};

export const setUsername = (username) => {
    return window.localStorage.setItem('username', username);
};

export const setEmail = (username) => {
    window.localStorage.setItem('email', username);
};

export const setRole = (role) => {
    window.localStorage.setItem('role', role);
};

export const setGiohang = (role) => {
    window.localStorage.setItem('giohang', role);
};

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const request = (method, url, data) => {

    let headers = {};
    if (getAuthToken() !== "null") {
        headers = {'Authorization': `Bearer ${getAuthToken()}`};
        // console.log(headers);
    }

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data,
    });
};