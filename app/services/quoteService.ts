const API_BASE_URL = 'https://dsa-basic-api.onrender.com';

export interface Quote {
    id: string;
    text: string;
    author: string;
    tags: string[];
}

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export const quoteService = {
    
    async getAllQuotes(token?: string): Promise<ApiResponse<Quote[]>> {
        const response = await fetch(`${API_BASE_URL}/quotes`, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        });
        return response.json();
    },

    async getRandomQuote(): Promise<ApiResponse<Quote>> {
        const response = await fetch(`${API_BASE_URL}/quotes/random`);
        return response.json();
    },

    async getQuoteById(id: string): Promise<ApiResponse<Quote>> {
        const response = await fetch(`${API_BASE_URL}/quotes/${id}`);
        return response.json();
    },

    async createQuote(quote: Omit<Quote, 'id'>, token?: string): Promise<ApiResponse<Quote>> {
        const response = await fetch(`${API_BASE_URL}/quotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(quote),
        });
        return response.json();
    },

    async updateQuote(id: string, quote: Partial<Quote>, token?: string): Promise<ApiResponse<Quote>> {
        const response = await fetch(`${API_BASE_URL}/quotes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(quote),
        });
        return response.json();
    },

    async deleteQuote(id: string, token?: string): Promise<ApiResponse<void>> {
        const response = await fetch(`${API_BASE_URL}/quotes/${id}`, {
            method: 'DELETE',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        });
        return response.json();
    },
}; 