<template>
	<main id="templates-page">
		<h1 class="text-4xl font-bold">Templates</h1>
		<div class="mt-8 p-4 bg-[#cbedd5] rounded-lg shadow-md flex-auto">
			<div class="flex flex-row justify-start items-center mb-4">
				<span class="material-icons text-4xl mr-4">display_settings</span>
				<span class="text-2xl pr-4">Machine Templates</span>
			</div>
			<Template v-for="template in machine_templates" :template="template" />
		</div>
	</main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Template from '../components/Template.vue';

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