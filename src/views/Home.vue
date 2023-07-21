<template>
	<main id="Home-page">
		<h1 class="text-4xl font-bold">Home</h1>
		<div class="mt-8 p-4 bg-[#cbedd5] rounded-lg shadow-md">
			<input v-model="searchText" type="text" class="p-2 rounded-lg w-full" placeholder="Type to search...">
		</div>
		<Transition>
			<div v-if="searchText !== ''" class="mt-8 p-4 bg-[#cbedd5] rounded-lg shadow-md flex-auto">
				<div class="flex flex-row justify-start items-center mb-4">
					<span class="material-icons text-4xl mr-4">search</span>
					<span class="text-2xl pr-4">Search Results</span>
				</div>
				<!-- <span v-if="searchListLength <= 0">Empty</span> -->
				<div v-for="machine in match_machines">
					<div
						class="p-3 pl-4 pr-4 bg-[#62B6B7] rounded-lg w-full mb-1 flex flex-row items content-between cursor-pointer">
						<span class="text-lg text-slate-50">{{ machine.name }}</span>
						<span @click="viewMachine(machine.name)"
							class="text-lg text-slate-50 ml-auto material-icons">expand_more</span>
					</div>
					<div v-if="isViewingMachine == machine.name"
						class="p-3 pl-4 pr-4 bg-green-300 rounded-lg w-full mb-1 flex flex-col items">
						<p class="mb-2">{{ machine.desc }}</p>
						<div
							class="p-2 pl-4 pr-4 ml-auto text-slate-50 bg-[#62B6B7] inline-flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
							<span class="material-icons text-2xl mr-4">lan</span>
							<span>Connect...</span>
						</div>
					</div>
				</div>
				<div v-for="template in match_templates">
					<div
						class="p-3 pl-4 pr-4 bg-[#62B6B7] rounded-lg w-full mb-1 flex flex-row items content-between cursor-pointer">
						<span class="text-lg text-slate-50">{{ template.name }}</span>
						<span @click="viewTemplate(template.name)"
						class="text-lg text-slate-50 ml-auto material-icons transition active:rotate-180">expand_more</span>
					</div>
					<div v-if="isViewing == template.name"
					class="p-3 pl-4 pr-4 bg-green-300 rounded-lg w-full mb-1 flex flex-col items">
					<p class="mb-2">{{ template.description }}</p>
					<div
						class="p-2 pl-4 pr-4 ml-auto text-slate-50 bg-[#62B6B7] inline-flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
						<span class="material-icons text-2xl mr-4">add</span>
						<span>Create VM From Template...</span>
					</div>
				</div>
				</div>
			</div>
		</Transition>


		<div class="flex flex-row mb-4">
			<!-- Machine Templates -->
			<div class="mt-8 p-4 bg-[#cbedd5] rounded-lg shadow-md flex-auto">
				<div class="flex flex-row justify-start items-center mb-4">
					<span class="material-icons text-4xl mr-4">display_settings</span>
					<span class="text-2xl pr-4">Recommended Machine Templates</span>
				</div>
				<div v-for="template in machine_templates">
					<div
						class="p-3 pl-4 pr-4 bg-[#62B6B7] rounded-lg w-full mb-1 flex flex-row items content-between cursor-pointer">
						<span class="text-lg text-slate-50">{{ template.name }}</span>
						<span @click="viewTemplate(template.name)"
							class="text-lg text-slate-50 ml-auto material-icons transition active:rotate-180">expand_more</span>
					</div>
					<div v-if="isViewing == template.name"
						class="p-3 pl-4 pr-4 bg-green-300 rounded-lg w-full mb-1 flex flex-col items">
						<p class="mb-2">{{ template.desc }}</p>
						<div
							class="p-2 pl-4 pr-4 ml-auto text-slate-50 bg-[#62B6B7] inline-flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
							<span class="material-icons text-2xl mr-4">add</span>
							<span>Create VM From Template...</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Active Machines -->
			<div class="bg-[#cbedd5] m-4 mt-8 p-4 rounded-lg shadow-md flex-1">
				<div class="flex flex-row justify-start items-center mb-4">
					<span class="material-icons text-4xl mr-4">monitor</span>
					<span class="text-2xl pr-4">Active Machines</span>
				</div>
				<div v-for="machine in active_machines">
					<div
						class="p-3 pl-4 pr-4 bg-[#62B6B7] rounded-lg w-full mb-1 flex flex-row items-center content-between cursor-pointer">
						<!-- <div class="rounded-full mr-4 bg-green-500"></div> -->
						<span class="text-lg text-slate-50">{{ machine.name }}</span>
						<span @click="viewMachine(machine.name)"
							class="text-lg text-slate-50 ml-auto material-icons">expand_more</span>
					</div>
					<div v-if="isViewingMachine == machine.name"
						class="p-3 pl-4 pr-4 bg-green-300 rounded-lg w-full mb-1 flex flex-col items">
						<p class="mb-2">{{ machine.desc }}</p>
						<div
							class="p-2 pl-4 pr-4 ml-auto text-slate-50 bg-[#62B6B7] inline-flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
							<span class="material-icons text-2xl mr-4">lan</span>
							<span>Connect...</span>
						</div>
					</div>
				</div>
			</div>
		</div>

	</main>
</template>

<script setup>

import { ref, onMounted, computed, watch } from "vue";
import { reconnect } from "../sock.js";
import { useStore } from "vuex";
import debounce from "lodash.debounce";

/*onMounted(() => {
	socket.connect({
		//access_token: localStorage.getItem('usersession')
	})
})*/

onMounted(function () {
	//socket.connect()
	reconnect()
})

const store = useStore();

const isViewing = ref("");
const isViewingMachine = ref("");
const searchText = ref("");
const searchLoading = ref(false);

const active_machines = computed(() => store.state.machinesList)

const machine_templates = computed(() => store.state.templatesList)

const match_machines = computed(() => store.state.machinesList.filter(searchQuery));
const match_templates = computed(() => store.state.templatesList.filter(searchQuery));
const searchList = computed(() => [].concat(match_machines, match_templates));
/* const searchListLength = computed(() => Object.values(searchList)[0].length); */
const viewTemplate = (template) => {
	if (template !== isViewing.value) {
		isViewing.value = template;
	} else {
		isViewing.value = "";
	}
};

const viewMachine = (machine) => {
	if (machine !== isViewingMachine.value) {
		isViewingMachine.value = machine;
	} else {
		isViewingMachine.value = "";
	}
}

const searchQuery = (query) => {
	const available = [];
	if (query instanceof Object) {
		if (query.constructor === Array) {
			for (const q of query) {
				const res = searchQuery(q);
				available.push(res);
			}
		} else if (query.constructor === Object) {
			for (const q of Object.values(query)) {
				const res = searchQuery(q);
				available.push(res);
			}
		}
	} else {
		if (query.toString().toLowerCase().includes(searchText.value)) {
			available.push(true);
		} else {
			available.push(false);
		}
	}
	const result = available.reduce((first, next) => {
		if (first || next) {
			return true;
		} else {
			return false;
		}
	}, false)
	return result;
}

const searchObjects = (searchString) => {
	if (searchString.length > 0) {
		searchLoading.value = true;
		console.log(searchString);
	}
}

watch(searchList, () => { searchLoading.value = false; })

watch(searchText, debounce(() => {
	searchObjects(searchText.value);
}, 500));

/*const active_machines = computed(() => get_active_machines())

const get_active_machines = async() => {
	const settings = {
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('usersession')
		}
	}
	var result
	const response = await fetch(import.meta.env.VITE_API_ENDPOINT + '/machines/', settings)
	const data = await response.json()
	console.log(data)
	return data
}*/

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