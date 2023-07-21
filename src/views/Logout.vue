<template>
    <h1 class="text-4xl font-bold m-4">Logging out...</h1>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { clearState, socket } from "../sock.js";

const router = useRouter()

onMounted(() => {
    const settings = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
'ngrok-skip-browser-warning': true,
            'Authorization': 'Bearer ' + localStorage.getItem('usersession'),
        },
    }
    fetch(import.meta.env.VITE_API_ENDPOINT + '/logout/', settings)
        .catch(err => console.error(err))
    localStorage.removeItem('usersession')
    clearState()
    //socket.disconnect()
    setTimeout(() => router.push('/login'), 500)
})


</script>