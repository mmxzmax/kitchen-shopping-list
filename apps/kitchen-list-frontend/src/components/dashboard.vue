<script lang="ts" setup>
import axios from "axios";
import { Ref, ref } from "vue";
import Card from "primevue/card";
import { IShopListItem } from "../types";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import Divider from "primevue/divider";
import router from "../router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";
import { formatDate } from "../helpers";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";

const confirm = useConfirm();
const toast = useToast();

const list: Ref<IShopListItem[]> = ref([]);

const showAdd = ref(false);

const listName = ref("");

async function getList() {
  const res = await axios.get("/api/user-shop-list");
  list.value = res.data;
}

async function addNewList() {
  if (!listName.value) return;
  await axios.post("/api/user-shop-list", { name: listName.value });
  listName.value = "";
  showAdd.value = false;
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
    <Dialog
      v-model:visible="showAdd"
      modal
      header="Create new list"
      :style="{ width: '25rem' }"
    >
      <InputGroup>
        <InputText
          v-model="listName"
          v-on:keyup.enter="addNewList()"
          placeholder="New List"
        />
      </InputGroup>
      <div class="add-list-buttons">
        <Button
          icon="pi pi-plus"
          @click="addNewList()"
          label="Create New"
          severity="success"
        />
        <Button
          icon="pi pi-close"
          @click="showAdd = false"
          label="Cancel"
          severity="danger"
        />
      </div>
    </Dialog>

    <ul class="user-shop-list">
      <li><Button icon="pi pi-plus" @click="showAdd = true" severity="success" /></li>
      <li class="user-shop-list__item" v-for="listItem in list" v-bind:key="listItem.id">
        <Card @click="router.push(`/list/${listItem.id}`)">
          <template #title>{{ listItem.name }}</template>
          <template #content>
            <p class="m-0 user-shop-list__date">
              <span>{{ formatDate(listItem.date) }}</span>
            </p>
            <Divider />
            <div class="user-shop-list__buttons">
              <Tag
                :severity="listItem.comleted ? 'success' : 'warn'"
                :value="listItem.comleted ? 'success' : 'in-work'"
                rounded
              ></Tag>
              <Button
                icon="pi pi-trash"
                @click="confirmDelete($event, listItem)"
                severity="danger"
              />
            </div>
          </template>
        </Card>
      </li>
    </ul>
  </div>
</template>
<style lang="scss">
.user-shop-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0.25rem;
  align-items: stretch;
  &__item {
    border: 1px solid #3f3f46;
    border-radius: 0.25rem;
    margin: 0.25rem;
    width: 18rem;
    max-width: 100%;
    @media (max-width: 640px) {
      width: 100%;
    }
  }
  &__buttons {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-end;
    .p-inputgroup {
      width: auto;
      margin-left: 1rem;
    }
    .p-tag {
      margin-right: auto;
    }
  }
}
.add-list-buttons {
  display: flex;
  margin-top: 1rem;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  > * {
    &:last-child {
      margin-left: 0.5rem;
    }
  }
}
</style>
