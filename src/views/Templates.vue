<template>
	<main id="templates-page">
		<h1>Templates</h1>
		<div class="mt-8 p-4 bg-[#cbedd5] rounded-lg shadow-md flex-auto">
			<div class="flex flex-row justify-start items-center mb-4">
				<span class="material-icons text-4xl mr-4">display_settings</span>
				<span class="text-2xl pr-4">Machine Templates</span>
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
	</main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const machine_templates = computed(() => store.state.templatesList);

const isViewing = ref("");

const viewTemplate = (template) => {
	if (template !== isViewing.value) {
		isViewing.value = template;
	} else {
		isViewing.value = "";
	}
};

</script>