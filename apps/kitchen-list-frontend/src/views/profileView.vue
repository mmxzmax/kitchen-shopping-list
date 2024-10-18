<script lang="ts" setup>
import axios from "axios";
import Card from "primevue/card";
import Inplace from "primevue/inplace";
import { Ref, ref } from "vue";
import { IUser } from "../types";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import Divider from "primevue/divider";
import Tag from "primevue/tag";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import InputGroupAddon from "primevue/inputgroupaddon";

const toast = useToast();

const userData: Ref<IUser | undefined> = ref();

async function getUserData() {
  const res = await axios.get("/api/users");
  userData.value = res.data;
}

async function saveUser() {
  if (!userData.value) return;
  if (userData.value.firstName && userData.value.lastName) {
    await axios.post(`/api/users/${userData.value.id}`, {
      firstName: userData.value.firstName,
      lastName: userData.value.lastName,
    });
    toast.add({
      severity: "success",
      summary: "Saved",
      detail: `User ${userData.value.email} saved succesfully`,
      life: 3000,
    });
  }
}

const tgLink = ref();

async function getTgLink() {
  const res = await axios.get("/api/users/tg-invite-link");
  tgLink.value = res.data?.link;
}

const tgInput = ref(null);

function copyTgLink() {
  navigator.clipboard.writeText(tgLink.value).then(
    function () {
      toast.add({
        severity: "success",
        summary: "coppyed",
        detail: `tg link copyed to clippboard succesfully`,
        life: 3000,
      });
    },
    function (err) {
      toast.add({
        severity: "error",
        summary: "coppy error",
        life: 3000,
      });
    }
  );
}

getUserData();
getTgLink();
</script>

<template>
  <div class="about">
    <Card>
      <template #title
        >{{ userData?.email }} <Tag severity="info" :value="userData?.role"></Tag
      ></template>
      <template #content>
        <InputGroup>
          <InputGroupAddon>
            <a :href="tgLink" target="_blank"
              ><i class="pi pi-link"></i>
              <span style="margin-left: 0.25rem">follow</span></a
            >
          </InputGroupAddon>
          <InputText v-model="tgLink" />
          <Button label="copy" icon="pi pi-copy" @click="copyTgLink()"></Button>
        </InputGroup>
        <Divider />
        <div v-if="userData">
          <Inplace style="margin-bottom: 0.5rem; width: 100%">
            <template #display>
              <span>{{ userData.firstName || "Click to Edit" }}</span>
              <span class="pi pi-pencil"></span>
            </template>
            <template #content="{ closeCallback }">
              <InputGroup>
                <InputText v-model="userData.firstName" autofocus />
                <Button
                  icon="pi pi-times"
                  text
                  severity="danger"
                  @click="closeCallback"
                />
              </InputGroup>
            </template>
          </Inplace>
          <Inplace style="margin-bottom: 0.5rem; width: 100%">
            <template #display>
              <span>{{ userData.lastName || "Click to Edit" }}</span>
              <span class="pi pi-pencil"></span>
            </template>
            <template #content="{ closeCallback }">
              <InputGroup>
                <InputText v-model="userData.lastName" autofocus />
                <Button
                  icon="pi pi-times"
                  text
                  severity="danger"
                  @click="closeCallback"
                />
              </InputGroup>
            </template>
          </Inplace>
          <Divider />
          <div class="user-footer">
            <Button
              icon="pi pi-save"
              label="Save"
              severity="success"
              @click="saveUser()"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
  <Toast />
</template>

<style lang="scss">
.p-inplace-content,
.p-inplace-display {
  width: 100%;
}
.p-inplace-display {
  display: flex !important;
  > :first-child {
    width: 100%;
  }
}
.user-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
