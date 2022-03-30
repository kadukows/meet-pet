import axios from 'axios';
import { Color } from '../colors/colorSlice';
import { IRequestMaker } from './IRequestMaker';

const DjangoRequestMaker: IRequestMaker = {
    getToken: async (username, password) => {
        interface TokenResponse {
            token: string;
        }

        try {
            const res = await axios.post<TokenResponse>('/api/get_token/', {
                username,
                password,
            });

            return res.data.token;
        } catch (e: any) {}

        return null;
    },

    getUser: async (token) => {
        interface UserResponse {
            username: string;
            first_name: string;
            last_name: string;
            email: string;
            profile: {
                user_prefs: null | {
                    has_garden: boolean;
                    location: string;
                };

                shelter_prefs: null | {
                    location: string;
                };
            };
        }

        try {
            const res = await axios.get<UserResponse>(
                '/api/user/me/',
                makeAuthHeader(token)
            );

            return {
                username: res.data.username,
                email: res.data.email,
                full_name: res.data.first_name.concat(' ', res.data.last_name),
            };
        } catch (e: any) {}

        return null;
    },

    getColors: async (token) => {
        try {
            const res = await axios.get<Color[]>(
                '/api/colors/',
                makeAuthHeader(token)
            );
            return res.data;
        } catch (e) {}

        return null;
    },
};

const makeAuthHeader = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export { DjangoRequestMaker };
