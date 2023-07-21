import { createStore } from "vuex";
//import { io } from "socket.io-client";

export default createStore({
    state: {
        connected: false,
        machinesList: [],
        allMachinesList: [],
        templatesList: [],
        osVersions: [],
        packagesList: [],
        announce: "",
        /* socket: io(URL, {
            autoConnect: false,
        }), */
    },
    mutations: {
        UPDATE_CONNECTED(state, payload) {
            state.connected = payload;
        },
        UPDATE_ALL_MACHINES(state, payload) {
            state.allMachinesList = payload ? payload : state.allMachinesList;
        },
        UPDATE_MACHINES(state, payload) {
            state.machinesList = payload ? payload : state.machinesList;
        },
        UPDATE_TEMPLATES(state, payload) {
            state.templatesList = payload ? payload : state.templatesList;
        },
        UPDATE_ANNOUNCE(state, payload) {
            state.announce = payload;
        },
        UPDATE_OS_VERSIONS(state, payload) {
            state.osVersions = payload;
        },
        UPDATE_PACKAGES_LIST(state, payload) {
            state.packagesList = payload;
        }
    },
    actions: {
        updateConnection(context, payload) {
            const connected = context.state.connected;
            console.log('UPDATE_CONNECTED');
            console.log(payload)
            context.commit('UPDATE_CONNECTED', payload);
        },
        updateMachines(context, payload) {
            const machines = context.state.machinesList;
            console.log('UPDATE_MACHINES');
            console.log(payload)
            context.commit('UPDATE_MACHINES', payload);
        },
        updateAllMachines(context, payload) {
            const allMachines = context.state.allMachinesList;
            console.log('UPDATE_ALL_MACHINES');
            console.log(payload)
            context.commit('UPDATE_ALL_MACHINES', payload);
        },
        updateTemplates(context, payload) {
            const templates = context.state.templatesList;
            console.log('UPDATE_TEMPLATES');
            console.log(payload)
            context.commit('UPDATE_TEMPLATES', payload);
        },
        updateAnnouncement(context, payload) {
            const announce = context.state.announce;
            console.log('UPDATE_ANNOUNCE');
            console.log(payload)
            context.commit('UPDATE_ANNOUNCE', payload);
        },
        updateOsVersions(context, payload) {
            const osVer = context.state.osVersions;
            console.log('UPDATE_OS_VERSIONS');
            console.log(payload)
            context.commit('UPDATE_OS_VERSIONS', payload);
        },
        updatePackagesList(context, payload) {
            const packagesList = context.state.packagesList;
            console.log('UPDATE_PACKAGES_LIST');
            console.log(payload.length)
            context.commit('UPDATE_PACKAGES_LIST', payload);
        },
        clearPackagesList(context, payload) {
            const packagesList = context.state.packagesList;
            context.commit('UPDATE_PACKAGES_LIST', []);
        },
        clearStore(context, payload) {
            const states = context.state;
            context.commit('UPDATE_MACHINES', []);
            context.commit('UPDATE_TEMPLATES', []);
            context.commit('UPDATE_ANNOUNCE', []);
            context.commit('UPDATE_OS_VERSIONS', []);
            context.commit('UPDATE_PACKAGES_LIST', []);
        }
    },
    getters: {

    },
});