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
const firstName = ref(null);
const lastName = ref(null);
const password = ref(null);
const repassword = ref(null);

const register = async function () {
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    confirmationPassword: repassword.value,
  };
  if (Object.values(data).every((v) => !!v)) {
   await axios.post("/api/auth/register", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      confirmationPassword: repassword.value,
    });
    router.push('/login');
  }
};
</script>

<template>
  <Fieldset legend="Register">
    <p class="m-0">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-inbox" />
        </InputGroupAddon>
        <InputText v-model="email" placeholder="Email" />
      </InputGroup>
      <Divider />
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-user" />
        </InputGroupAddon>
        <InputText v-model="firstName" placeholder="First Name" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-user" />
        </InputGroupAddon>
        <InputText v-model="lastName" placeholder="Last Name" />
      </InputGroup>
      <Divider />
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-pen-to-square" />
        </InputGroupAddon>
        <Password v-model="password" placeholder="Password" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-pen-to-square" />
        </InputGroupAddon>
        <Password v-model="repassword" placeholder="Confirm Password" />
      </InputGroup>
    </p>
    <Divider />
    <Button @click="register()" label="Submit" />
  </Fieldset>
</template>

<style></style>
