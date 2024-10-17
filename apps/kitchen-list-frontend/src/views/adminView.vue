<script lang="ts" setup>
import axios from "axios";
import Card from "primevue/card";
import { Ref, ref } from "vue";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import Divider from "primevue/divider";
import DataTable, { DataTableRowEditSaveEvent } from "primevue/datatable";
import Column from "primevue/column";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import Listbox from "primevue/listbox";
import { ICategory, IUser } from "../types";

interface IGood {
  name: string;
  id: number;
  categories: ICategory[];
}

const confirm = useConfirm();
const toast = useToast();

const visible = ref(false);

const usersList: Ref<IUser[]> = ref([]);

const newItem: Ref<string> = ref("");

const selectedGood: Ref<IGood | null> = ref(null);

const categoryList: Ref<ICategory[]> = ref([]);

const editingRows = ref([]);
const editingRows2 = ref([]);
const editingRows3 = ref([]);

const goodsList: Ref<IGood[]> = ref([]);

async function addNewItem() {
  const res = await axios.post("/api/goods-categories", { name: newItem.value });
  getCategoryList();
  newItem.value = "";
}

async function getCategoryList() {
  const res = await axios.get("/api/goods-categories");
  categoryList.value = res.data;
}

async function getGoodsList() {
  const res = await axios.get("/api/goods-list");
  goodsList.value = res.data;
}

async function onRowEditSave(event: DataTableRowEditSaveEvent) {
  let { newData, index } = event;
  const resp = await axios.post(`/api/goods-categories/${newData.id}`, {
    name: newData.name,
  });
  if (resp.data) {
    categoryList.value[index] = resp.data;
  }
}

async function deleteItem(id: number) {
  return await axios.delete(`/api/goods-categories/${id}`).catch((e) => false);
}

async function deleteGoodItem(id: number) {
  return await axios.delete(`/api/goods-list/${id}`).catch((e) => false);
}

function confirmDelete(event: MouseEvent, cat: ICategory) {
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
      const res = await deleteItem(cat.id).catch((e) => false);
      if (res) {
        toast.add({
          severity: "info",
          summary: "Deleted",
          detail: `Category ${cat.name} deleted succesfully`,
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `Category ${cat.name} is not deleted`,
          life: 3000,
        });
      }
    },
  });
}

function confirmDeleteUser(event: MouseEvent, user: IUser) {
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
      const res = await axios.delete(`/api/users/${user.id}`);
      if (res) {
        toast.add({
          severity: "info",
          summary: "Deleted",
          detail: `User ${user.email} deleted succesfully`,
          life: 3000,
        });
        getUsers();
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `User ${user.email} is not deleted`,
          life: 3000,
        });
      }
    },
  });
}

function confirmDeleteGood(event: MouseEvent, good: IGood) {
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
      const res = await deleteGoodItem(good.id).catch((e) => false);
      if (res) {
        toast.add({
          severity: "info",
          summary: "Deleted",
          detail: `Good ${good.name} deleted succesfully`,
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `Good ${good.name} is not deleted`,
          life: 3000,
        });
      }
    },
  });
}

async function saveGoodsInCategory(event: DataTableRowEditSaveEvent) {
  const { newData, index } = event;
  const res = await axios.post(`/api/goods-list/${newData.id}`, {
    name: newData.name,
    categories: (newData as IGood).categories.map(({ id }) => id),
  });
  if (res.data) {
    editGood(res.data, index);
  }
}

function editGood(item: IGood | null, index?: number) {
  if (!item) {
    return;
  }
  if (!index) {
    index = goodsList.value.findIndex((v) => v.id === item.id);
  }
  goodsList.value[index] = item;
}

async function getUsers() {
  const res = await axios.get("/api/users/list");
  usersList.value = res.data;
}

getCategoryList();
getGoodsList();
getUsers();
</script>

<template>
  <div class="about">
    <Toast />
    <ConfirmPopup />
    <Card>
      <template #title>Categories</template>
      <template #content>
        <InputGroup>
          <InputText
            v-model="newItem"
            v-on:keyup.enter="addNewItem()"
            placeholder="New Item"
          />
          <Button
            icon="pi pi-check"
            @click="addNewItem()"
            label="Add"
            severity="success"
          />
        </InputGroup>

        <Divider />

        <DataTable
          v-model:editingRows="editingRows"
          :value="categoryList"
          editMode="row"
          dataKey="id"
          @row-edit-save="onRowEditSave"
        >
          <Column field="id" header="Id" style="width: 1rem"> </Column>
          <Column field="name" header="Name">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" fluid />
            </template>
          </Column>
          <Column
            :rowEditor="true"
            style="width: 8rem"
            bodyStyle="text-align:center"
          ></Column>

          <Column style="width: 8rem" bodyStyle="text-align:center">
            <template #editor="{ data }">
              <Button
                icon="pi pi-trash"
                @click="confirmDelete($event, data)"
                severity="danger"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    <Card>
      <template #title>Goods</template>
      <template #content>
        <DataTable
          v-model:editingRows="editingRows2"
          :value="goodsList"
          editMode="row"
          dataKey="id"
          @row-edit-save="saveGoodsInCategory"
        >
          <Column field="id" header="Id" style="width: 1rem"></Column>
          <Column field="name" header="Name">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" fluid />
            </template>
          </Column>
          <Column
            :rowEditor="true"
            style="width: 8rem"
            bodyStyle="text-align:center"
          ></Column>
          <Column style="width: 8rem" bodyStyle="text-align:center">
            <template #editor="{ data }">
              <Button
                style="margin-right: 0.25rem"
                icon="pi pi-list"
                @click="
                  visible = true;
                  selectedGood = data;
                "
                severity="sucess"
              />
              <Button
                icon="pi pi-trash"
                @click="confirmDeleteGood($event, data)"
                severity="danger"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Card>
      <template #title>Users</template>
      <template #content>
        <DataTable
          v-model:editingRows="editingRows3"
          :value="usersList"
          editMode="row"
          dataKey="id"
          @row-edit-save="saveGoodsInCategory"
        >
          <Column field="id" header="Id" style="width: 1rem"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="role" header="Role"></Column>
          <Column
            :rowEditor="true"
            style="width: 8rem"
            bodyStyle="text-align:center"
          ></Column>
          <Column style="width: 8rem" bodyStyle="text-align:center">
            <template #editor="{ data }">
              <Button
                icon="pi pi-trash"
                @click="confirmDeleteUser($event, data)"
                severity="danger"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>

  <Dialog
    v-model:visible="visible"
    modal
    :header="`Categories for ${selectedGood?.name}`"
    :style="{ width: '25rem' }"
  >
    <div v-if="selectedGood" class="flex justify-end gap-2">
      <Listbox
        v-model="selectedGood.categories"
        :options="categoryList"
        checkmark
        :highlight-on-select="false"
        multiple
        optionLabel="name"
        class="w-full md:w-56"
      />
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="visible = false"
      />
      <Button
        type="button"
        label="Save"
        @click="
          visible = false;
          editGood(selectedGood);
        "
      />
    </div>
  </Dialog>
</template>

<style></style>
