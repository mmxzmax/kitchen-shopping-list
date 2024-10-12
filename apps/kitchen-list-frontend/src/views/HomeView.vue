<script setup lang="ts">
import axios from "axios";
import Card from "primevue/card";
import Menubar from "primevue/menubar";
import { ref } from "vue";
import router from "../router";

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    route: "/",
  },
  {
    label: "profile",
    icon: "pi pi-user",
    route: "/profile",
  },
  {
    label: "signOut",
    icon: "pi pi-sign-out",
    command: async () => {
      await axios.get("/api/auth/logout");
      router.push("/login");
    },
  },
]);
</script>

<template>
  <main>
    <header>
      <Menubar :model="items">
        <template #item="{ item, props, hasSubmenu }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else :href="item.url" :target="item.target" v-bind="props.action">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
          </a>
        </template>
      </Menubar>
    </header>
    <Card>
      <template #content>
        <RouterView />
      </template>
    </Card>
  </main>
</template>
