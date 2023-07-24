<template>
	<div class="bg-[#cbedd5] m-4 mt-8 p-4 rounded-lg shadow-md flex-1">
		<div class="flex flex-col justify-center items-start mb-4">
			<div class="flex flex-row justify-start items-center mb-4">
				<span class="material-icons text-4xl mr-4">person_add</span>
				<span class="m-2 text-2xl">Create A User</span>
			</div>
			<p class="bg-red-600 text-slate-50 mb-4 p-2 pl-4 pr-4 rounded-sm" v-if="isError == true">{{ errorMsg }}</p>
            <p class="bg-green-600 text-slate-50 mb-4 p-2 pl-4 pr-4 rounded-sm" v-if="isSuccess == true">{{ successMsg }}</p>
			<form @submit.prevent="createUser" class="ml-4 mt-2">
				<div class="mb-4">
					<span class="text-xl text-slate-600">General Info</span>
				</div>
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="name" class="text-slate-600 bg-[#cbedd5]"> Userame: </label>
					<input type="text" name="username" v-model="newUsername" id="name" class="rounded-md ml-4 p-2">
				</div>
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="desc" class="text-slate-600 bg-[#cbedd5]">Password: </label>
					<input type="password" name="password" v-model="newPasswd" id="desc" class="rounded-md ml-4 p-2">
				</div>
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="role" class="text-slate-600 bg-[#cbedd5]">Role: </label>
					<select v-model="newRole" name="role" id="role" class="p-2 ml-4 rounded-lg bg-white">
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</div>

				<input type="submit" value="Create" class="p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">

			</form>
		</div>
	</div>
</template>

<script setup>

import { ref, onMounted, computed, watch } from "vue";

const newUsername = ref("");
const newPasswd = ref("");
const newRole = ref("user");
const isSuccess = ref(false);
const isError = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const emitParent = defineEmits(['refreshUsers']);

const createUser = () => {

	isError.value = false
    isSuccess.value = false

    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': import.meta.env.VITE_API_ENDPOINT,
'ngrok-skip-browser-warning': true,
			'Authorization': 'Bearer ' + localStorage.getItem('usersession'),
        },
        body: 'username=' + newUsername.value + '&password=' + newPasswd.value + '&role=' + newRole.value,
    }
    fetch(import.meta.env.VITE_API_ENDPOINT + '/admin/user/create/', settings)
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
            successMsg.value = "User successfully registered."
			emitParent('refreshUsers');
        })
        .catch(err => console.error(err))

};

</script>

<style>
.loader {
	border: 16px solid #f3f3f3;
	/* Light grey */
	border-top: 16px solid #62B6B7;
	border-radius: 50%;
	min-width: 40px;
	max-width: 120px;
	min-height: 40px;
	height: auto;
	margin: auto;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>