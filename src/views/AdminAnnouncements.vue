<template>
	<main id="adm-announce-page">
		<h1 class="mb-4 text-4xl font-bold">Announcements</h1>
		<p class="bg-red-600 text-slate-50 mb-4 p-2 pl-4 pr-4 rounded-sm" v-if="isError == true">{{ errorMsg }}</p>
            <p class="bg-green-600 text-slate-50 mb-4 p-2 pl-4 pr-4 rounded-sm" v-if="isSuccess == true">{{ successMsg }}</p>
		<form @submit.prevent="makeAnnouncement" class="mt-8 p-4 bg-[#cbedd5] rounded-lg shadow-md">
			<input type="text" v-model="announcement" class="p-2 rounded-lg w-full" placeholder="Type your announcement here...">
			<input type="submit" value="Announce" class="mt-4 p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
		</form>
	</main>
</template>

<script setup>

import { ref } from 'vue';


const announcement = ref("");
const isSuccess = ref(false);
const isError = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const makeAnnouncement = () => {

	const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': import.meta.env.VITE_API_ENDPOINT,
'ngrok-skip-browser-warning': true,
			'Authorization': 'Bearer ' + localStorage.getItem('usersession'),
        },
        body: 'msg=' + announcement.value,
    }
    fetch(import.meta.env.VITE_API_ENDPOINT + '/announce/', settings)
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                isError.value = true
                errorMsg.value = 'Failed to announce.'
                throw new Error(errorMsg.value)
            }
        })
        .then(res => {
            isSuccess.value = true
            successMsg.value = "Success"
        })
        .catch(err => console.error(err))

};

</script>