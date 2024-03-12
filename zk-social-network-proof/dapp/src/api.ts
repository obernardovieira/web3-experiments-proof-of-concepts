import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 3000
});

function postRequestActivityCheck(data: {
    socialNetwork: string,
    username: string,
    signature: string,
    address: `0x${string}`
}) {
    return instance.post<{ status: true, buildIdentifier: { random: string, dateNow: string } }>('/activity-check', data);
}

export { postRequestActivityCheck };
