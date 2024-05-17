export default {
    requests(state, _, _2, rootGetters){
        const currentCoachId = rootGetters.userId;

        return state.requests.filter(req => req.coachId === currentCoachId);
    },
    hasRequests(_, getters){        
        return getters.requests && getters.requests.length > 0;
    }
}