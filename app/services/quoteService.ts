// const API_BASE_URL = 'https://dsa-basic-api.onrender.com';
const API_BASE_URL = 'http://localhost:3000';

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
    async getAllQuotes(): Promise<ApiResponse<Quote[]>> {
        const response = await fetch(`${API_BASE_URL}/quotes`);
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

    async createQuote(quote: Omit<Quote, 'id'>): Promise<ApiResponse<Quote>> {
        const response = await fetch(`${API_BASE_URL}/quotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quote),
        });
        return response.json();
    },

    async updateQuote(id: string, quote: Partial<Quote>): Promise<ApiResponse<Quote>> {
        const response = await fetch(`${API_BASE_URL}/quotes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quote),
        });
        return response.json();
    },

    async deleteQuote(id: string): Promise<ApiResponse<void>> {
        const response = await fetch(`${API_BASE_URL}/quotes/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },
}; 