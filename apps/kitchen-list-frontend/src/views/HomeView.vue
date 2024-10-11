<script setup lang="ts">
import Card from "primevue/card";
import Menubar from "primevue/menubar";
import { ref } from "vue";

const items = ref([
  {
    label: "Register",
    icon: "pi pi-user-plus",
    route: "/register",
  },
  {
    label: "signIn",
    icon: "pi pi-sign-in",
    route: "/login",
  },
]);
</script>

<template>
  <main>
    <Card>
      <template #title>
        <header>
          <Menubar :model="items">
            <template #item="{ item, props, hasSubmenu }">
              <router-link
                v-if="item.route"
                v-slot="{ href, navigate }"
                :to="item.route"
                custom
              >
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                  <span :class="item.icon" />
                  <span class="ml-2">{{ item.label }}</span>
                </a>
              </router-link>
              <a
                v-else
                v-ripple
                :href="item.url"
                :target="item.target"
                v-bind="props.action"
              >
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
              </a>
            </template>
          </Menubar>
        </header>
      </template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
          consequuntur error repudiandae numquam deserunt quisquam repellat libero
          asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque quas!
        </p>
      </template>
    </Card>
  </main>
</template>
