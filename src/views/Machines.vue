<template>
	<main id="machines-page">
		<h1 class="text-4xl font-bold">Machines</h1>

		<div class="invisible md:visible flex flex-row md:mt-8 md:p-4">
			<div @click="showCreateMachine = showCreateMachine ? false : true"
				class="p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
				<span class="material-icons text-2xl mr-4">add</span>
				<span class="text-xl">Create a new machine...</span>
			</div>
			<div @click="showCreateFromTemplate = showCreateFromTemplate ? false : true"
				class="ml-4 p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
				<div class="material-icons text-2xl mr-4">file_copy</div>
				<div class="text-xl">Create from template...</div>
			</div>
		</div>
		<div class="visible md:invisible flex flex-row mt-8 p-4 md:w-0 md:h-0 md:p-0 md:m-0">
			<div @click="showCreateMachine = showCreateMachine ? false : true"
				class="p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
				<span class="material-icons text-2xl mr-4">add</span>
				<span class="text-xl">New...</span>
			</div>
			<div @click="showCreateFromTemplate = showCreateFromTemplate ? false : true"
				class="ml-4 p-2 pl-4 pr-4 text-slate-50 bg-[#62B6B7] flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
				<div class="material-icons text-2xl mr-4">file_copy</div>
				<div class="text-xl">From template...</div>
			</div>
		</div>

		<Transition>
			<CreateMachine v-if="showCreateMachine" />
		</Transition>


		<div v-if="showCreateFromTemplate" class="bg-[#cbedd5] m-4 mt-8 p-4 rounded-lg shadow-md flex-1">
			test2
		</div>

		<div class="bg-[#cbedd5] m-4 mt-8 p-4 rounded-lg shadow-md flex-1">
			<div class="flex flex-row justify-start items-center mb-4">
				<span class="material-icons text-4xl mr-4">monitor</span>
				<span class="text-2xl pr-4">Active Machines</span>
			</div>
			<div v-for="machine in active_machines">
				<div
					class="p-3 pl-4 pr-4 bg-[#62B6B7] rounded-lg w-full mb-1 flex flex-row items-center content-between cursor-pointer">
					<div class="rounded-full mr-4 bg-green-500 invisible md:visible p-2.5 border border-solid-white"></div>
					<span class="text-lg text-slate-50">{{ machine.name }}</span>
					<div class="text-slate-50 ml-auto">
						<span
							class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-green-300">play_arrow</span>
						<span
							class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-orange-300">stop</span>
						<span
							class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-red-400">delete</span>
						<span @click="viewMachine(machine.name)"
							class="text-3xl text-slate-50 ml-auto material-icons transition-all active:rotate-180">expand_more</span>
					</div>
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
	</main>
</template>

<script setup>

import { ref, onMounted, computed } from "vue";
import { reconnect } from "../sock.js";
import { useStore } from "vuex";
import CreateMachine from "../components/CreateMachine.vue";

onMounted(function () {
	//socket.connect()
	//reconnect()
})

const store = useStore();

const active_machines = computed(() => store.state.machinesList)

const showCreateMachine = ref(false)
const showCreateFromTemplate = ref(false)
const isViewingMachine = ref("");

const viewMachine = (machine) => {
	if (machine !== isViewingMachine.value) {
		isViewingMachine.value = machine;
	} else {
		isViewingMachine.value = "";
	}
}

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