import { atom } from 'recoil'

export const navbarState = atom({
    key: 'navbarState',
    default: 'Explore',
});

export const loginState = atom({
    key: 'loginState',
    default: false,
});

