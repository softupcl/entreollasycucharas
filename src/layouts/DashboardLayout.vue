<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->

    <!-- Main content with sidebar -->
    <main class="flex-1">
      <div class="flex">
        <!-- Sidebar -->
        <div class="w-64 bg-gray-800 text-white">
          <Sidebar />
        </div>

        <!-- Main content -->
        <div class="flex-1 overflow-auto">
          <div class="p-6">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
</script>
