<template>
    <div>
        <div class="p-3 pl-4 pr-4 bg-[#62B6B7] rounded-lg w-full mb-1 flex flex-row items content-between cursor-pointer">
            <span class="text-lg text-slate-50">{{ currentTemplate.name }}</span>
            <span @click="viewTemplate(currentTemplate.name)"
                class="text-lg text-slate-50 ml-auto material-icons transition"
                :class="{ 'rotate-180': dropdownArrow }">expand_more</span>
        </div>
        <div v-if="isViewing == currentTemplate.name"
            class="p-3 pl-4 pr-4 bg-green-300 rounded-lg w-full mb-1 flex flex-col items">
            <div class="flex flex-row mb-4">
            <p class="mb-2 mt-2 flex-1">{{ currentTemplate.desc }}</p>
            <div class="flex flex-col w-fit p-4 mt-2 rounded-lg bg-[#e2e8f0]">
                <p class="mb-2 flex"><span class="material-icons text-md mr-2">memory</span>CPU Cores: {{ currentTemplate.data.cores }}</p>
                <p class="mb-2 flex"><span class="material-icons text-md mr-2">sd</span>Memory: {{ currentTemplate.data.memory }}</p>
            </div>
            </div>


            <div
                class="p-2 pl-4 pr-4 ml-auto text-slate-50 bg-[#62B6B7] inline-flex flex-row rounded-lg items-center cursor-pointer transition-all hover:bg-[#439a97] hover:scale-110">
                <span class="material-icons text-2xl mr-4">add</span>
                <span>Create VM From Template...</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRef } from "vue";

const props = defineProps(['template']);
const isViewing = ref("");
const currentTemplate = toRef(props, "template");

const dropdownArrow = ref(false);

const viewTemplate = (template) => {
    if (template !== isViewing.value) {
        isViewing.value = template;
        dropdownArrow.value = true;
    } else {
        isViewing.value = "";
        dropdownArrow.value = false;
    }
};
</script>