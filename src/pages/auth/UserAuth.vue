<template>
    <div>
        <base-dialog :show="!!error" title="An Error Occured!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <base-dialog :show="isLoading" title="Authenticating..." fixed>
            <base-spinner></base-spinner>
        </base-dialog>
        <base-card>
            <form @submit.prevent="submitForm">
                <div class="form-control">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model.trim="email">
                </div>
                <div class="form-control">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model.trim="password">
                </div>
                <p v-if="!formIsValid">Please enter a valid email and password (Must be atleast 6 characters long).</p>
                <base-button>{{ submitBtnCaption }}</base-button>
                <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchModeBtnCaption }}</base-button>
            </form>
        </base-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                password: '',
                formIsValid: true,
                mode: 'login',
                isLoading: false,
                error: null,
            } 
        },
        computed: {
            submitBtnCaption() {
                if (this.mode == 'signup'){
                    return 'signup';
                } else {
                    return 'login';
                }
            },
            switchModeBtnCaption() {
                if (this.mode == 'signup') {
                    return 'login instead';
                } else {
                    return 'signup instead';
                }
            }
        },
        methods: {
            async submitForm() {
                this.formIsValid = true;
                if(this.email === '' || !this.email.includes('@') || this.password.length < 6 ){
                    this.formIsValid = false;
                    return
                }
                const actionPayload = {
                    email: this.email,
                    password: this.password
                }

                this.isLoading = true;
                try {
                    if (this.mode === 'login') {
                        await this.$store.dispatch('auth/login', actionPayload);
                    } else {
                        await this.$store.dispatch('auth/signup', actionPayload);
                    }
                    const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
                    this.$router.replace(redirectUrl);
                } catch (err){
                    this.error = err.message || 'Failed to authenticate, try again later.';
                }
                this.isLoading = false;
            },
            switchAuthMode() {
                console.log("runs")
                // Do something
                if (this.mode == 'login'){
                    this.mode = 'signup';
                } else {
                    this.mode = 'login';
                }
            },
            handleError() {
                this.error = null;
            }
        }
    }
</script>

<style scoped>
    form {
        margin: 1rem;
        padding: 1rem;
    }

    .form-control {
        margin: 0.5rem 0;
    }

    label {
        font-weight: bold;
        margin-bottom: 0.5rem;
        display: block;
    }

    input,
    textarea {
        display: block;
        width: 100%;
        font: inherit;
        border: 1px solid #ccc;
        padding: 0.15rem;
    }

    input:focus,
    textarea:focus {
        border-color: #3d008d;
        background-color: #faf6ff;
        outline: none;
    }
</style>