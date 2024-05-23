export default {
    setUser(state, payload){
        state.token = payload.tokenId;
        state.userId = payload.userId;
    }
};