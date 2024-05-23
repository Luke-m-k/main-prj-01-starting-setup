let timer;

export default {
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'login'
        });
    },

    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'signup'
        });
    },

    async auth(context, payload) {
        const mode = payload.mode;
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDF6wdzJUtZAizf2FnKiONhZBDqIEiHu4w';

        if (mode === 'signup'){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDF6wdzJUtZAizf2FnKiONhZBDqIEiHu4w';
        }
        const response = await fetch (url, {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to authenticate.');
            throw error;
        }

        const expiresIn = +responseData.expiresIn * 1000;

        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', expirationDate);

        timer = setTimeout(function() {
            context.dispatch('logout');
        }, expiresIn);

        context.commit('setUser', {
            tokenId: responseData.idToken,
            userId: responseData.localId,
        })
    },

    tryLogin(context){
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        console.log(tokenExpiration);

        const expiresIn = +tokenExpiration - new Date().getTime();

        if (expiresIn < 0){
            context.dispatch('logout');
            return;
        }

        timer = setTimeout(function(){
            context.dispatch('logout');
        }, expiresIn)

        if (token && userId){
            context.commit('setUser', {
                tokenId: token,
                userId: userId,
            })
        }
    },

    logout(context){
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer);

        context.commit('setUser', {
            tokenId: null,
            userId: null,
        })
    }
};