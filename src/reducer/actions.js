import Constants from '../helpers/Constants';

export const setStores = (value) => {
    return {
        type: Constants.reducerAction.setStores,
        value
    }
};
