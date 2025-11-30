const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'hworlplayz';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'howrldplayz@512';

export const auth = {
    validateCredentials: (username: string, password: string): boolean => {
        return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    },
};
