<script setup lang="ts">
import Fieldset from "primevue/fieldset";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Button from 'primevue/button';
import Divider from 'primevue/divider';

import { ref } from "vue";

const email = ref(null);
const password = ref(null);
</script>

<template>
  <Fieldset legend="Login">
    <p class="m-0">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-inbox" />
        </InputGroupAddon>
        <InputText 
          v-model="email"
          placeholder="Email"
        />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-pen-to-square" />
        </InputGroupAddon>
        <Password 
          v-model="password"
          placeholder="Password"
        />
      </InputGroup>
    </p>
    <Divider />
    <Button label="Submit" />
  </Fieldset>
</template>

<style></style>
