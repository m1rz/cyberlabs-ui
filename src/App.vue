<template>
	<div class="app">
		<!-- Sidebar -->
		<Sidebar v-if="currentPath != '/login' && currentPath != '/logout'" />

		<Transition>
			<div v-if="announcements != ''"
				class="p-4 bg-green-700 fixed top-0 w-full flex flex-row text-center text-white font-semibold text-lg">
				<span class="flex-1">{{ announcements }}</span>
				<span @click="() => store.dispatch('updateAnnouncement', '')"
					class="material-icons transition-all hover:scale-125">close</span>
			</div>
		</Transition>

		<!-- Content -->
		<router-view />
	</div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
import { computed, onMounted, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from 'vue-router';
import { socket, state, setStore } from "./sock.js";
import { currentUserSymbol } from "./symbols";

const route = useRoute();
const store = useStore();
const currentPath = computed(() => route.path);

const announcements = computed(() => store.state.announce);

const currentUser = ref({});
const updateUser = (user) => {
	currentUser.value = user;
};
provide(currentUserSymbol, {currentUser, updateUser});

onMounted(() => {
	if (currentPath != '/login' && currentPath != '/logout') {
		setStore(useStore());
		socket.connect();
	} else if (currentPath === '/logout') {
		console.log("disconnecting...");
		console.log(socket);
		socket.disconnect();
	}
});

watch(currentPath, (to, from) => {
	if (to !== from) {
		if (to != '/login' && to != '/logout' && !store.state.connected) {
			socket.connect();
		} else if (to === '/logout') {
			console.log("disconnecting...");
			console.log(socket);
			socket.disconnect();
		}
	}
})

</script>

<style lang="scss">
:root {
	--primary: #4ade80;
	--primary-alt: #22c55e;
	--grey: #64748b;
	--white: #ffffff;
	--dark: #1e293b;
	--dark-alt: #334155;
	--light: #97dece4c;
	--nav-color: #439a97;
	--sidebar-width: 300px;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Fira sans', sans-serif;
}

body {
	background: var(--light);
}

button {
	cursor: pointer;
	appearance: none;
	border: none;
	outline: none;
	background: none;
}

.app {
	display: flex;

	main {
		flex: 1 1 0;
		padding: 2rem;

		@media (max-width: 1024px) {
			padding-left: 6rem;
		}
	}
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>