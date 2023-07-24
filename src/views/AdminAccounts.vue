<template>
	<main id="accounts-page">
		<h1 class="text-4xl font-bold">Account Management</h1>

		<div class="invisible md:visible flex flex-row md:mt-8 md:p-4">
			<div @click="showCreateUser = showCreateUser ? false : true"
				class="p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
				<span class="material-icons text-2xl mr-4">add</span>
				<span class="text-xl">Create new user...</span>
			</div>
		</div>
		<div class="visible md:invisible flex flex-row mt-8 p-4 md:w-0 md:h-0 md:p-0 md:m-0">
			<div @click="showCreateUser = showCreateUser ? false : true"
				class="p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
				<span class="material-icons text-2xl mr-4">add</span>
				<span class="text-xl">New...</span>
			</div>
		</div>

		<Transition>
			<CreateUser v-if="showCreateUser" @refresh-users="updateUsers"/>
		</Transition>

		<div class="mt-8 p-4 bg-[#cbedd5] rounded-lg shadow-md flex-auto">
			<div class="flex flex-row justify-start items-center mb-4">
				<span class="material-icons text-4xl mr-4">people</span>
				<span class="text-2xl pr-4">All Users</span>
			</div>
			<div v-for="user in users">
				<div class="p-3 pl-4 pr-4 bg-[#62B6B7] rounded-lg w-full mb-1 flex flex-row items content-between cursor-pointer">
					<span class="text-lg text-slate-50">{{ user.username }}</span>
					<div class="text-slate-50 ml-auto">
						<span @click="editUser(user.username)" class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-yellow-200">edit</span>
						<span @click="deleteUser(user.username)" class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-red-400">delete</span>
						<span
							class="text-3xl text-slate-50 ml-auto material-icons transition-all active:rotate-180">expand_more</span>
					</div>
				</div>
				<div v-if="isEditing == user.username" class="p-3 pl-4 pr-4 bg-green-300 rounded-lg w-full mb-1 flex flex-col items"></div>
			</div>
		</div>

	</main>
</template>

<script setup>

import { ref, onMounted } from "vue";
import  CreateUser from '../components/CreateUser.vue'

const showCreateUser = ref(false);
const users = ref([]);
const isEditing = ref();

const updateUsers = () => {
	const settings = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Access-Control-Allow-Origin': import.meta.env.VITE_API_ENDPOINT,
'ngrok-skip-browser-warning': true,
			'Authorization': 'Bearer ' + localStorage.getItem('usersession')
		},
	}
	fetch(import.meta.env.VITE_API_ENDPOINT + '/users/', settings)
		.then(res => res.json())
		.then(res => {
			users.value = res;
		})
}

const editUser = (user) => {
	if (user !== isEditing.value) {
		isEditing.value = user;
	} else {
		isEditing.value = "";
	}
};

const deleteUser = (user) => {
	if (confirm("Are you sure you want to delete this user? --> " + user)) {
		const settings = {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Access-Control-Allow-Origin': import.meta.env.VITE_API_ENDPOINT,
'ngrok-skip-browser-warning': true,
			'Authorization': 'Bearer ' + localStorage.getItem('usersession')
		},
	}
	fetch(import.meta.env.VITE_API_ENDPOINT + '/admin/user/' + user, settings)
		.then(res => res.json())
		.then(res => {
			alert("User successfully deleted.")
			updateUsers()
		})
	}
}

onMounted(updateUsers);

</script>

<style>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>