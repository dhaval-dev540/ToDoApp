import Constants from '../helpers/Constants';

const initialState = {
    stores: { toDoArray: [] },
    toDoArray: []
};

export default function lookup(state = initialState, action) {
    const { type, value } = action;
    switch (type) {

        case Constants.reducerAction.setStores:
            return { ...state, ...value };

        default:
            return state;
    }
}
