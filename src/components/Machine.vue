<template>
    <div>
        <div
            class="p-3 pl-4 pr-4 bg-[#62B6B7] rounded-lg w-full mb-1 flex flex-row items-center content-between cursor-pointer">
            <div :style="statusLightbinding" :title="currentMachine.state"></div>
            <!-- <div class="rounded-full mr-4 bg-green-500 invisible md:visible p-2.5 border border-solid-white"></div> -->
            <span class="text-lg text-slate-50">{{ currentMachine.name }}</span>
            <div  class="text-slate-50 ml-auto">
                <span v-if="showControls"
                    class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-green-300">play_arrow</span>
                <span v-if="showControls"
                    class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-orange-300">stop</span>
                <span v-if="showControls"
                    class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-red-400">delete</span>
                <span @click="viewMachine(currentMachine.name)"
                    class="text-3xl text-slate-50 ml-auto material-icons transition-all" :class="{ 'rotate-180': dropdownArrow }">expand_more</span>
            </div>
        </div>
        <div v-if="isViewingMachine == currentMachine.name"
            class="p-3 pl-4 pr-4 bg-green-300 rounded-lg w-full mb-1 flex flex-col items">
            <div class="flex flex-row mb-4">
                <p class="mb-2 mt-2 flex-1">{{ trimDescription(currentMachine.desc) }}</p>
            <div class="flex flex-col w-fit p-4 mt-2 rounded-lg bg-[#e2e8f0]">
                <p class="mb-2 flex"><span class="material-icons text-md mr-2">memory</span>CPU Cores: {{ currentMachine.params.data.cores }}</p>
                <p class="mb-2 flex"><span class="material-icons text-md mr-2">sd</span>Memory: {{ currentMachine.params.data.memory }}</p>
            </div>
        </div>
        <div @click="connectMachine(currentMachine.vmid)"
            class="p-2 pl-4 pr-4 ml-auto text-slate-50 bg-[#62B6B7] inline-flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
            <span class="material-icons text-2xl mr-4">lan</span>
            <span>Connect...</span>
        </div>
            
        </div>
    </div>
</template>

<script setup>
import { computed, ref, toRef, inject } from "vue";
import { currentUserSymbol } from "../symbols";

const props = defineProps({
    machine: {
        type: Object,
    },
    showControls: {
        type: Boolean,
    }
});
const isViewingMachine = ref("");
const dropdownArrow = ref(false);
const currentMachine = toRef(props, "machine");
const { currentUser } = inject(currentUserSymbol);

const viewMachine = (machine) => {
	if (machine !== isViewingMachine.value) {
		isViewingMachine.value = machine;
        dropdownArrow.value = true;
	} else {
		isViewingMachine.value = "";
        dropdownArrow.value = false;
	}
}
const statusLightSet = (status) => {
    switch (status.toLowerCase()) {
        case "running":
            return "#10B981";
        case "stopped":
            return "#EF4444";
        default:
            return "#6B7280";
    }
};

const statusLightbinding = computed(() => {
    const bg_color = statusLightSet(currentMachine.value.state);
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
});

const trimDescription = (desc) => {
    const newDesc = desc.split('\n');
    if (newDesc.length > 1 && newDesc.pop().match(/__\s.*\s__/)) {
        return newDesc.join('\n');
    }
    return desc;
};

const connectMachine = (vmid) => {
	window.open(import.meta.env.VITE_API_ENDPOINT + '/connect2?vmid=' + vmid + '&username=' + currentUser.value.username, '_blank');
}

</script>