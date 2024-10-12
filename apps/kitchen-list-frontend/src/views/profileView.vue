<script lang="ts" setup>
import axios from "axios";
import Card from "primevue/card";
import Menubar from "primevue/menubar";
import { ref } from "vue";
import router from "../router";
</script>

<template>
  <div class="about">
    <Card>
      <template #title>Simple Card</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
          consequuntur error repudiandae numquam deserunt quisquam repellat libero
          asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque quas!
        </p>
      </template>
    </Card>
  </div>
</template>

<style></style>
