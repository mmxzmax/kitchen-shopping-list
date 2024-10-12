<script setup lang="ts">
import Fieldset from "primevue/fieldset";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Button from "primevue/button";
import Divider from "primevue/divider";

import { ref } from "vue";
import axios from "axios";
import router from "../router";

const email = ref(null);
const password = ref(null);

const login = async function () {
  const data = {
    email: email.value,
    password: password.value,
  };
  if (Object.values(data).every((v) => !!v)) {
   const res =  await axios.post("/api/auth/login", {
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('userId', res.data?.user?.id)
    router.push("/");
  }
};
</script>

<template>
  <Fieldset legend="Login">
    <p class="m-0">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-inbox" />
        </InputGroupAddon>
        <InputText v-model="email" placeholder="Email" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-pen-to-square" />
        </InputGroupAddon>
        <Password v-model="password" :feedback="false"   placeholder="Password" />
      </InputGroup>
    </p>
    <RouterLink to="/register">Register</RouterLink>
    <Divider />
    <Button @click="login()" label="Login" />
  </Fieldset>
</template>

<style></style>
