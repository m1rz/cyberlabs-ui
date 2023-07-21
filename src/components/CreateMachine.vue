<template>
	<div class="bg-[#cbedd5] m-4 mt-8 p-4 rounded-lg shadow-md flex-1">
		<div class="flex flex-col justify-center items-start mb-4">
			<span class="m-2 mb-4 text-2xl">Create A Machine</span>
			<p class="bg-red-600 text-slate-50 mb-4 p-2 pl-4 pr-4 rounded-sm" v-if="isError == true">{{ errorMsg }}</p>
			<p class="bg-green-600 text-slate-50 mb-4 p-2 pl-4 pr-4 rounded-sm" v-if="isSuccess == true">{{ successMsg }}
			</p>
			<form @submit.prevent="createMachine" class="ml-4 mt-2">
				<div class="mb-4">
					<span class="text-xl text-slate-600">General Info</span>
				</div>
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="name" class="text-slate-600 bg-[#cbedd5]">Machine Name: </label>
					<input type="text" name="name" v-model="machineName" id="name" class="rounded-md ml-4 p-2">
				</div>
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="desc" class="text-slate-600 bg-[#cbedd5]">Description: </label>
					<textarea name="description" v-model="machineDescription" id="desc"
						class="rounded-md ml-4 p-2"></textarea>
				</div>
				<hr>
				<div class="mb-4 mt-4">
					<span class="text-xl text-slate-600">Hardware Info</span>
				</div>
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="cores" class="text-slate-600 bg-[#cbedd5]">CPU Cores: </label>
					<input type="number" v-model="coreCount" min=1 max=32 name="cores" id="cores"
						class="rounded-md ml-4 p-2 w-16">
				</div>
				<div class="flex flex-row mb-4 justify-start items-center">
					<label for="memory" class="text-slate-600 bg-[#cbedd5]">RAM capacity: </label>
					<input type="range" min=128 max=32000 v-model="ramAmount" name="memory" id="memory"
						class="rounded-md ml-4 p-2 w-32">
					<input type="number" min=128 max=32000 :value="ramAmount" disabled class="rounded-md p-2 ml-2 w-20">
				</div>
				<hr>
				<div class="mb-4 mt-4">
					<span class="text-xl text-slate-600">Software Info</span>
				</div>
				<div class="flex flex-col">
					<label for="osVersion" class="text-slate-600 bg-[#cbedd5]">Select OS: </label>
					<select name="osVersion" id="osVersion" v-model="osVersion" class="p-2 mt-2 mb-8 rounded-lg bg-white">
						<optgroup label="Ubuntu Linux">
							<option v-for="osVer in verList" :name="osVer" :id="osVer" :value="osVer">{{ osVer }}
							</option>
						</optgroup>
					</select>

					<div class="flex flex-row">
						<div class="flex flex-col">
							<label for="searchPackages" class="text-slate-600 bg-[#cbedd5]">Choose packages to install:
							</label>
							<input type="text" name="searchPackages" v-model="searchText" id="searchPackages"
								class="p-2 mt-2 rounded-lg shadow-sm">
							<Transition>
								<div v-if="searchText.length > 0"
									class="flex flex-col p-2 h-60 bg-slate-200 rounded-sm overflow-auto">
									<div v-if="packagesLoading" class="loader"></div>
									<div v-for="pack in packageList" @click="appendPackages(pack)"
										class="p-2 hover:bg-slate-50 cursor-pointer">
										<span>{{ pack }}</span>
									</div>
								</div>
							</Transition>
						</div>
						<div class="flex flex-col ml-4">
							<span class="text-slate-600 bg-[#cbedd5]">Chosen packages: </span>
							<textarea v-model="selectedList"
								class="flex flex-col bg-slate-50 h-28 mt-2 rounded-lg shadow-sm" disabled>
							</textarea>
						</div>

					</div>

				</div>

				<input type="submit" value="Create"
					class="p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">

			</form>
		</div>
	</div>
</template>

<script setup>

import { ref, onMounted, computed, watch } from "vue";
import { socket } from "../sock.js";
import { useStore } from 'vuex';
import debounce from 'lodash.debounce';

const store = useStore();
const machineName = ref("");
const machineDescription = ref("");
const coreCount = ref(1);
const ramAmount = ref(512);
const osVersion = ref("");
const verList = computed(() => store.state.osVersions);
const packageList = computed(() => store.state.packagesList.slice(0, Math.min(100, store.state.packagesList.length)));
const packagesLoading = ref(false);
const selectedPackages = ref([]);
const searchText = ref("");
const isSuccess = ref(false);
const isError = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const selectedList = computed(() => selectedPackages.value.join('\n'));

onMounted(() => {
	if (store.state.osVersions.length < 1) {
		socket.emit("get_os_versions");
	}
});

const createMachine = () => {
	const settings = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
'ngrok-skip-browser-warning': true,
			'Authorization': 'Bearer ' + localStorage.getItem('usersession'),
		},
		body: JSON.stringify({
			name: machineName.value,
			desc: machineDescription.value,
			data: {
				cores: coreCount.value,
				memory: ramAmount.value,
				packages: selectedPackages.value,
			},
		}),
	}
	fetch(import.meta.env.VITE_API_ENDPOINT + '/machine/create/', settings)
		.then(res => {
			if (res.ok) {
				return res.json()
			} else {
				isError.value = true
				errorMsg.value = 'Failed to create machine.'
				throw new Error(errorMsg.value)
			}
		})
		.then(res => {
			console.log(res.userId)
			isSuccess.value = true
			successMsg.value = "Machine successfully created."
			socket.emit('machines_brief')
		})
		.catch(err => console.error(err))
};

const appendPackages = (pack) => {
	selectedPackages.value.push(pack)
};

const searchPackages = (searchString) => {
	if (osVersion.value.length > 0 && searchString.length > 0) {
		packagesLoading.value = true;
		console.log(searchString);
		socket.emit("get_os_packages", [osVersion.value, searchString]);
	}
}

watch(packageList, () => { packagesLoading.value = false; })

watch(searchText, debounce(() => {
	searchPackages(searchText.value);
}, 500));

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