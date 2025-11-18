"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpiralApiClient = void 0;
class SpiralApiClient {
    constructor(baseUrl = 'https://api.spiralid.com') {
        this.baseUrl = baseUrl;
    }
    setAuthToken(token) {
        this.authToken = token;
    }
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        return headers;
    }
    async handleResponse(response) {
        if (!response.ok) {
            let error;
            try {
                error = await response.json();
            }
            catch {
                error = {
                    message: response.statusText,
                    code: `HTTP_${response.status}`,
                };
            }
            throw new Error(error.message);
        }
        return response.json();
    }
    async getSpirals() {
        const response = await fetch(`${this.baseUrl}/api/spirals`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }
    async getSpiral(spiralId) {
        const response = await fetch(`${this.baseUrl}/api/spirals/${spiralId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }
    async createSpiral(options) {
        const response = await fetch(`${this.baseUrl}/api/spirals`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(options),
        });
        return this.handleResponse(response);
    }
    async updateSpiral(spiralId, metadata) {
        const response = await fetch(`${this.baseUrl}/api/spirals/${spiralId}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({ metadata }),
        });
        return this.handleResponse(response);
    }
    async deleteSpiral(spiralId) {
        const response = await fetch(`${this.baseUrl}/api/spirals/${spiralId}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to delete spiral');
        }
    }
    async getUserProfile(address) {
        const response = await fetch(`${this.baseUrl}/api/users/${address}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }
}
exports.SpiralApiClient = SpiralApiClient;
