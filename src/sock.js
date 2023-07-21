import { reactive, ref } from "vue";
import { io } from "socket.io-client";
import { useStore } from "vuex";
//import store from './store/store';

const store = ref();

export const setStore = (s) => {
    store.value = s;
}

export const state = reactive({
    connected: false,
    machinesList: [],
    templatesList: [],
    announce: ""
});

export const reconnect = () => {
    if (!store.value.state.connected) {
        console.log('reconnecting...')
        socket.connect()
    }
}

export const clearState = () => {
    store.value.dispatch('clearStore', [])
}

export const emitEvent = (eventName, args) => {
    if (args) {
        socket.emit(eventName, ...args)
    } else {
        console.log("Sending event " + eventName)
        socket.emit(eventName)
    }
}

export const socket = io(import.meta.env.VITE_API_ENDPOINT, {
    extraHeaders: {
        'ngrok-skip-browser-warning': true,
    },
    autoConnect: false,
});

socket.on("connect", () => {
    //state.connected = true;
    store.value.dispatch('updateConnection', true);
});

socket.on("disconnect", () => {
    //state.connected = false;
    store.value.dispatch('updateConnection', false);
});

socket.on("authenticate", () => {
    socket.emit("authenticate", {token: localStorage.getItem('usersession')});
});

socket.on("confirm_auth", (cred) => {
    console.log(cred);
    if (cred == "0") {
        socket.disconnect();
    }
})

socket.on("machines_brief", (...args) => {
    //state.machinesList.push(...args);
    store.value.dispatch('updateMachines', args);
});

socket.on("all_machines", (...args) => {
    store.value.dispatch('updateAllMachines', args);
});

socket.on("templates", (...args) => {
    //state.templatesList.push(...args);
    store.value.dispatch('updateTemplates', args);
});

socket.on("announce", (announcement) => {
    store.value.dispatch('updateAnnouncement', announcement);
});

socket.on("get_os_versions", (args) => {
    store.value.dispatch('updateOsVersions', args)
});

socket.on("os_packages", (packages) => {
    store.value.dispatch("updatePackagesList", packages)
});