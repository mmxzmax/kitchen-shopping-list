<script lang="ts" setup>
import axios from "axios";
import { Ref, ref } from "vue";
import Card from "primevue/card";
import { IListItem, IShopListItem } from "../types";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import Divider from "primevue/divider";
import router from "../router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";

const confirm = useConfirm();
const toast = useToast();

const list: Ref<IShopListItem[]> = ref([]);

const listName = ref("");

const formatdDate = (date: string | Date) => new Date(date).toLocaleDateString("ru-Ru");

async function getList() {
  const res = await axios.get("/api/user-shop-list");
  list.value = res.data;
}

async function addNewList() {
  if (!listName.value) return;
  await axios.post("/api/user-shop-list", { name: listName.value });
  listName.value = '';
  getList();
}

function confirmDelete(event: MouseEvent, item: IShopListItem) {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "Are you sure you want to proceed?",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
    },
    accept: async () => {
      const res = await axios.delete(`/api/user-shop-list/${item.id}`);
      if (res) {
        await getList();
        toast.add({
          severity: "info",
          summary: "Deleted",
          detail: `List ${item.name} deleted succesfully`,
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `List ${item.name} is not deleted`,
          life: 3000,
        });
      }
    },
  });
}

getList();
</script>
<template>
  <div>
    <Toast />
    <ConfirmPopup />
    <InputGroup>
      <InputText
        v-model="listName"
        v-on:keyup.enter="addNewList()"
        placeholder="New List"
      />
      <Button
        icon="pi pi-plus"
        @click="addNewList()"
        label="Create New"
        severity="success"
      />
    </InputGroup>

    <Divider />

    <ul>
      <li v-for="listItem in list" v-bind:key="listItem.id">
        <Card>
          <template #title>{{ listItem.name }}</template>
          <template #content>
            <p class="m-0">
              <span>{{ formatdDate(listItem.date) }}</span>
            </p>
            <Divider />
            <InputGroup>
              <Button
                icon="pi pi-pen-to-square"
                @click="router.push(`/list/${listItem.id}`)"
                severity="success"
              />
              <Button
                icon="pi pi-trash"
                @click="confirmDelete($event, listItem)"
                severity="danger"
              />
            </InputGroup>
          </template>
        </Card>
      </li>
    </ul>
  </div>
</template>
<style lang="scss"></style>
