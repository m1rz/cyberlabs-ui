<template>
  <main class="adm-home-page">
    <h1 class="text-4xl font-bold">System Dashboard</h1>
    <div class="mt-8 p-4 bg-[#cbedd5] rounded-lg shadow-md flex flex-row flex-wrap content-between justify-center">
      <apexchart class="m-auto" type="radialBar" :options='cpuChart' :series='[stats.cpu]'></apexchart>
      <apexchart class="m-auto" type="radialBar" :options='ramChart' :series='[stats.mem]'></apexchart>
      <apexchart class="m-auto" type="radialBar" :options='diskChart' :series='[stats.disk]'></apexchart>
      <apexchart class="m-auto" type="radialBar" :options='swapChart' :series='[stats.swap]'></apexchart>
    </div>
    <!-- Active Machines -->
    <div class="bg-[#cbedd5] m-4 mt-8 p-4 rounded-lg shadow-md flex-1">
      <div class="flex flex-row justify-start items-center mb-4">
        <span class="material-icons text-4xl mr-4">monitor</span>
        <span class="text-2xl pr-4">Active Machines</span>
      </div>
      <div v-for="machine in active_machines"
        class="p-3 pl-4 pr-4 bg-[#62B6B7] rounded-lg w-full mb-1 flex flex-row items-center content-between cursor-pointer">
        <div :style="statusLightbinding(machine.state)"></div>
        <!-- <div class="rounded-full mr-4 bg-green-500"></div> -->
        <span class="text-lg text-slate-50">{{ machine.name }}</span>
        <div class="text-slate-50 ml-auto">
          <span
            class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-green-300">play_arrow</span>
          <span
            class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-orange-300">stop</span>
          <span
            class="text-3xl text-slate-50 ml-auto material-icons transition-all hover:scale-125 hover:text-red-400">delete</span>
          <span class="text-3xl text-slate-50 ml-auto material-icons transition-all active:rotate-180">expand_more</span>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>

//import ApexCharts from "apexcharts";
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { reconnect, socket } from "../sock.js";

const store = useStore();

const active_machines = computed(() => store.state.allMachinesList);

const statistics = ref({});
const stats = computed(() => {
  return {
    cpu: Math.floor(statistics.value.cpu * 1000) / 1000,
    mem: Math.floor((statistics.value.memused / statistics.value.memtotal) * 100) / 100,
    disk: Math.floor((statistics.value.rootused / statistics.value.roottotal) * 100) / 100,
    swap: Math.floor((statistics.value.swapused / statistics.value.swaptotal) * 100) / 100,
  };
})

onMounted(() => {
  //socket.connect()
  socket.emit("all_machines");
  const settings = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'ngrok-skip-browser-warning': true,
      'Authorization': 'Bearer ' + localStorage.getItem('usersession'),
    },
  }
  fetch(import.meta.env.VITE_API_ENDPOINT + '/admin/stats', settings)
    .then(res => res.json())
    .then(res => {
      /* console.log(res); */
      statistics.value = res;
    })
    .catch(err => console.error(err))

})


const statusLightbinding = (status) => {
  return { 
    "visibility": "visible", 
    "padding": "0.625rem", 
    "marginRight": "1rem", 
    "borderRadius": "9999px", 
    "borderWidth": "1px", 
    "backgroundColor": status.toLowerCase() === "running" ? "#10B981" : "#EF4444", 
    "@media (min-width: 768px)": { 
      "visibility": "visible" 
    } 
  };
}


const genChartOptions = (name) => {
  return {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: name ? true : false
          },
          value: {
            offsetY: -45,
            fontSize: '22px'
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'solid',

    },
    labels: [name ? name : 'Results'],
  }
}
const cpuChart = genChartOptions('CPU Usage')
const ramChart = genChartOptions('RAM Usage')
const diskChart = genChartOptions('Disk Usage')
const swapChart = genChartOptions('Swap Usage')

</script>