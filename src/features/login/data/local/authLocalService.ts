class AuthLocalService {
    setTokens(token: string, refreshToken: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    }

    getTokens(): { token: string | null; refreshToken: string | null } {
        return {
            token: localStorage.getItem('token'),
            refreshToken: localStorage.getItem('refreshToken'),
        };
    }

    clearTokens(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    // Helpers
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    hasTokens(): boolean {
        const { token, refreshToken } = this.getTokens();
        return !!token && !!refreshToken;
    }
}

export default new AuthLocalService();