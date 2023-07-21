<template>
	<main id="settings-page">
		<h1 class="text-4xl font-bold">Settings</h1>
		<p class="bg-red-600 text-slate-50 mb-4 mt-4 p-2 pl-4 pr-4 rounded-sm" v-if="isError == true">{{ errorMsg }}</p>
		<p class="bg-green-600 text-slate-50 mb-4 mt-4 p-2 pl-4 pr-4 rounded-sm" v-if="isSuccess == true">{{ successMsg }}
		</p>
		<div class="bg-[#cbedd5] m-4 mt-8 p-4 rounded-lg shadow-md flex-1">
			<div class="flex flex-row justify-start items-center mb-4">
				<span class="material-icons text-4xl mr-4">person</span>
				<span class="text-2xl pr-4">User Settings</span>

			</div>
			<form @submit.prevent="updateUser" class="ml-4 mt-2">
				<!-- <div class="flex flex-row mb-4 justify-start items-center">
					<label for="name" class="text-slate-600 bg-[#cbedd5]"> Username: </label>
					<input type="text" name="username" v-model="newUsername" id="name" class="rounded-md ml-4 p-2">
				</div> -->
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="pass" class="text-slate-600 bg-[#cbedd5]">Old Password: </label>
					<input type="password" name="password" v-model="oldPasswd" id="pass" class="rounded-md ml-4 p-2">
				</div>
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="pass" class="text-slate-600 bg-[#cbedd5]">New Password: </label>
					<input type="password" name="password" v-model="newPasswd" id="pass" class="rounded-md ml-4 p-2">
				</div>
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="confirmPass" class="text-slate-600 bg-[#cbedd5]">Confirm New Password: </label>
					<input type="password" name="confirmPassword" v-model="confirmPasswd" id="confirmPass"
						class="rounded-md ml-4 p-2">
				</div>


				<input type="submit" value="Change Details"
					class="p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">

			</form>
		</div>
	</main>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const isSuccess = ref(false);
const isError = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const newUsername = ref("");
const oldPasswd = ref("");
const newPasswd = ref("");
const confirmPasswd = ref("");
const currentUser = ref({});

onMounted(() => {
	const settings = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Access-Control-Allow-Origin': '*',
			'ngrok-skip-browser-warning': true,
			'Authorization': 'Bearer ' + localStorage.getItem('usersession')
		},
	}
	fetch(import.meta.env.VITE_API_ENDPOINT + "/user/", settings)
		.then(res => res.json())
		.then(res => {
			currentUser.value = res;
		})
})

const updateUser = () => {
	if (newPasswd.value !== confirmPasswd.value) {
		errorMsg.value = "Passwords do not match. Please check your password.";
		isSuccess.value = false;
		isError.value = true;
	} else if (oldPasswd.value === "") {

	} else {
		const settings = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Access-Control-Allow-Origin': '*',
				'ngrok-skip-browser-warning': true,
				'Authorization': 'Bearer ' + localStorage.getItem('usersession')
			},
			body: 'oldpw=' + oldPasswd.value + '&newpw=' + newPasswd.value,
		}
		fetch(import.meta.env.VITE_API_ENDPOINT + "/user/" + currentUser.value['username'], settings)
			.then(res => res.json())
			.then(res => {
				if (res['result'] === "success") {
					successMsg.value = "Password successfully updated."
					isSuccess.value = true;
					isError.value = false;
				} else {
					errorMsg.value = "Failed to update user. Please check your credentials and try again.";
					isError.value = true;
					isSuccess.value = false;
				}
			})
			.catch(err => console.log(err))
	}
};


</script>