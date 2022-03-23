import { atom } from 'recoil'

export const createExperienceFormPageAtom = atom({
    key: 'createExperienceFormPageState',
    default: 0,
});

export const createExperienceFormValuesAtom = atom({
    key: 'createExperienceFormValuesState',
    default: {
        type: '',
        location: '',
        language: '',
        category: '',
    },
});