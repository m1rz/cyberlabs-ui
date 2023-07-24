<template>
	<main id="Home-page">
		<h1 class="text-4xl font-bold">Welcome, {{ currentUser.username }}</h1>
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
				<Machine v-for="machine in match_machines" :machine="machine" :show-controls="true" />
				<Template v-for="template in match_templates" :template="template" />
			</div>
		</Transition>


		<div class="flex flex-row mb-4">
			<!-- Machine Templates -->
			<div class="mt-8 p-4 bg-[#cbedd5] rounded-lg shadow-md flex-auto">
				<div class="flex flex-row justify-start items-center mb-4">
					<span class="material-icons text-4xl mr-4">display_settings</span>
					<span class="text-2xl pr-4">Recommended Machine Templates</span>
				</div>
				<Template v-for="template in machine_templates" :template="template" />
			</div>

			<!-- Active Machines -->
			<div class="bg-[#cbedd5] m-4 mt-8 p-4 rounded-lg shadow-md flex-1">
				<div class="flex flex-row justify-start items-center mb-4">
					<span class="material-icons text-4xl mr-4">monitor</span>
					<span class="text-2xl pr-4">Active Machines</span>
				</div>
				<Machine v-for="machine in active_machines" :machine="machine" />
			</div>
		</div>

	</main>
</template>

<script setup>

import { ref, onMounted, computed, watch, inject } from "vue";
import { currentUserSymbol } from "../symbols";
import { reconnect } from "../sock.js";
import { useStore } from "vuex";
import debounce from "lodash.debounce";
import Template from "../components/Template.vue";
import Machine from "../components/Machine.vue";

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

const { currentUser } = inject(currentUserSymbol);
const searchText = ref("");
const searchLoading = ref(false);

const active_machines = computed(() => store.state.machinesList)
const machine_templates = computed(() => store.state.templatesList)
const match_machines = computed(() => store.state.machinesList.filter(searchQuery));
const match_templates = computed(() => store.state.templatesList.filter(searchQuery));
const searchList = computed(() => [].concat(match_machines, match_templates));
/* const searchListLength = computed(() => Object.values(searchList)[0].length); */

/* const statusLightSet = (status) => {
	switch (status.toLowerCase()) {
		case "running":
			return "#10B981";
		case "stopped":
			return "#EF4444";
		default:
			return "#6B7280";
	}
};

const statusLightbinding = (status) => {
	const bg_color = statusLightSet(status);
	return {
		"visibility": "visible",
		"padding": "0.625rem",
		"marginRight": "1rem",
		"borderRadius": "9999px",
		"borderWidth": "1px",
		"backgroundColor": bg_color,
		"@media (min-width: 768px)": {
			"visibility": "visible"
		}
	};
}; */

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

const connectMachine = (vmid) => {
/* 	const settings = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Access-Control-Allow-Origin': import.meta.env.VITE_API_ENDPOINT,
			'ngrok-skip-browser-warning': true,
			'Authorization': 'Bearer ' + localStorage.getItem('usersession')
		},
	}
	fetch(import.meta.env.VITE_API_ENDPOINT + '/connect?vmid=' + vmid, settings)
		.then(res => res.json())
		.then(res => {
			if ('ticket' in res) { */
				/* window.open(import.meta.env.VITE_API_ENDPOINT + "/proxmox/?console=kvm&novnc=1&vmid=101&vmname=server&node=proxmox&resize=off", '_blank') */
				/* window.open(import.meta.env.VITE_API_ENDPOINT + "/proxmox/?console=kvm&novnc=1&node=proxmox&resize=1&vmid=" + vmid + "&path=api2/json/nodes/proxmox/qemu/" + vmid + "/vncwebsocket/port/" + res["port"] + "/vncticket/" + res["ticket"], '_blank') */
				/* window.open(import.meta.env.VITE_API_ENDPOINT + "/vnc.html?autoconnect=1&host=" + import.meta.env.VITE_API_ENDPOINT.split("/").pop() + "&port=" + res['port'] + "&path=" + encodeURIComponent("api2/json/nodes/proxmox/qemu/" + vmid + "/vncwebsocket/port/" + res["port"] + "/vncticket/" + res["ticket"]), '_blank')
				window.open(import.meta.env.VITE_API_ENDPOINT + '/cookies'); */
/* 			}
		})
		.catch(err => {
			console.error(err)
		}) */
	window.open(import.meta.env.VITE_API_ENDPOINT + '/connect2?vmid=' + vmid + '&username=' + currentUser.value.username, '_blank')
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