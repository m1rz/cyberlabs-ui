<template>
    <div class="app flex flex-col w-full h-screen">
        <h1 class="text-4xl font-bold m-8">Login or Register</h1>
        <form @submit.prevent="doLogin" class="flex flex-col m-auto bg-[#cbedd5] p-8 justify-center rounded-lg">
            <p class="bg-red-600 text-slate-50 mb-4 p-2 pl-4 pr-4" v-if="isError == true">{{ errorMsg }}</p>
            <p class="bg-green-600 text-slate-50 mb-4 p-2 pl-4 pr-4" v-if="isSuccess == true">{{ successMsg }}</p>
            <label for="username" class="text-lg">Username</label>
            <input type="text" name="username" v-model="username" class="rounded-lg mt-2 mb-8 p-2 w-80">
            <label for="password" class="text-lg">Password</label>
            <input type="password" name="password" v-model="password" class="rounded-lg mt-2 mb-8 p-2 w-80">
            <div class="flex flex-row items-end">
                <input type="button" value="Register" @click="doRegister"
                    class="bg-[#4ade80] p-2 pl-4 pr-4 ml-auto rounded-lg text-slate-50 cursor-pointer">
                <input type="submit" value="Login"
                    class="bg-[#4ade80] p-2 pl-4 pr-4 ml-4 rounded-lg text-slate-50 cursor-pointer">
            </div>


        </form>
    </div>
</template>

<script setup>

import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter()

const username = ref("")
const password = ref("")
const errorMsg = ref("")
const successMsg = ref("")
const isError = ref(false)
const isSuccess = ref(false)

const doLogin = () => {

    isError.value = false
    isSuccess.value = false

    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': import.meta.env.VITE_API_ENDPOINT,
            'ngrok-skip-browser-warning': true,
        },
        body: 'username=' + username.value + '&password=' + password.value,
    }

    fetch(import.meta.env.VITE_API_ENDPOINT + '/login/', settings)
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                isError.value = true
                errorMsg.value = 'Username or password invalid.'
                throw new Error(errorMsg.value)
            }
        })
        .then(res => {
            //console.log(res.access_token)
            localStorage.setItem('usersession', res.access_token)


            const settings = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_API_ENDPOINT,
                    'ngrok-skip-browser-warning': true,
                    'Authorization': 'Bearer ' + localStorage.getItem('usersession')
                },
            }
            var role
            fetch(import.meta.env.VITE_API_ENDPOINT + '/user/', settings)
                .then(res => res.json())
                .then(res => {
                    role = res.role
                    console.log(role)
                    if (role !== 'admin') {
                        console.log('Unauthorized')
                        router.push('/')
                    } else if (role === 'admin') {
                        router.push('/admin')
                    }
                })

        })
        .catch(err => console.error(err))

}

const doRegister = () => {

    isError.value = false
    isSuccess.value = false

    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': import.meta.env.VITE_API_ENDPOINT,
            'ngrok-skip-browser-warning': true,
        },
        body: 'username=' + username.value + '&password=' + password.value,
    }
    fetch(import.meta.env.VITE_API_ENDPOINT + '/register/', settings)
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                isError.value = true
                errorMsg.value = 'Failed to register user.'
                throw new Error(errorMsg.value)
            }
        })
        .then(res => {
            console.log(res.userId)
            isSuccess.value = true
            successMsg.value = "User successfully registered, please login."
            setTimeout(() => router.push('/login/'), 500)

        })
        .catch(err => console.error(err))
}

</script>



