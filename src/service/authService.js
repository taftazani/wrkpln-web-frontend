// src/authService.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://workplan-web.test/api'; // Replace with your API URL

export const login = async (emailOrUserId, password, companyCode) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: emailOrUserId.includes('@') ? emailOrUserId : '',
            user_id: !emailOrUserId.includes('@') ? emailOrUserId : '',
            password,
            company_code: companyCode
        });
        if (response.data.status === 'error') {
            throw new Error(response.data.message);
        }
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('permissions', JSON.stringify(response.data.permission)); // Store permissions
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

export const sendOtp = async () => {
    try {
        const response = await axios.post(
            `${API_URL}/send-otp`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

export const verifyOtp = async (otp) => {
    try {
        const response = await axios.post(
            `${API_URL}/verify-otp`,
            { otp },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );
        localStorage.setItem('otpVerified', 'true');
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

export const getPermissions = () => {
    return JSON.parse(localStorage.getItem('permissions')) || [];
};

export const hasPermission = (permission) => {
    const permissions = getPermissions();
    return permissions.includes(permission);
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('otpVerified');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp < Date.now() / 1000;
    } catch (error) {
        return true;
    }
};

export const isAuthenticated = () => {
    const token = getToken();
    return token && !isTokenExpired(token);
};

export const isOtpVerified = () => {
    return localStorage.getItem('otpVerified') === 'true';
};
