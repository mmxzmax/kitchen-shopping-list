<script lang="ts" setup>
import { computed, Ref, ref, watch } from "vue";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import Divider from "primevue/divider";
import axios from "axios";
import InputGroupAddon from "primevue/inputgroupaddon";
import OrderList from "primevue/orderlist";
import { ICategory, ISuggestionListItem, IListItem } from "../types";
import ToggleSwitch from "primevue/toggleswitch";
import router from "../router";
import { formatDate } from "../helpers";
import Dialog from "primevue/dialog";

const routeId = +router.currentRoute.value.params["id"];

const isEdit = ref(false);

const letters = ref([]);

const letter = ref();

const category: Ref<number | null> = ref(null);

const newItem = ref();

const newCategory = ref();

const categoryList: Ref<ICategory[]> = ref([]);

const createCategoryDialog = ref(false);

async function getCategoryList() {
  const res = await axios.get("/api/goods-categories");
  categoryList.value = res.data;
  category.value = categoryList.value[0].id;
}

const suggestion: Ref<ISuggestionListItem[]> = ref([]);

const list: Ref<IListItem[]> = ref([]);

const pagedata = ref();

const changeLetter = async function (l?: string, category?: number) {
  if (!l) return;
  const res = await axios.get(`/api/goods-list/${l}`, { params: { category } });
  suggestion.value = res.data?.filter(
    (item: { name: string; id: number }) => !list.value.find((v) => v.id === item.id)
  );
};

const getLetters = async function (category: number | null) {
  if (!category) return;
  const res = await axios.get("/api/goods-list/find", { params: { category } });
  letters.value = res.data;
  if (!letter.value) {
    letter.value = letters.value[0];
  }
};

const addItem = function (newItem: ISuggestionListItem) {
  if (!list.value.find((item) => item.id === newItem.id)) {
    list.value.push({ ...newItem, completed: true });
    const index = suggestion.value.findIndex((item) => item.id === newItem.id);
    suggestion.value.splice(index, 1);
  }
};

const addNewCategory = async function () {
  if (!newCategory.value) return;
  const res = await axios.post("/api/goods-categories", { name: newCategory.value });
  newCategory.value = "";
  getCategoryList();
  createCategoryDialog.value = false;
};

const addNewItem = async function () {
  if (!newItem.value) return;
  const res = await axios.post("/api/goods-list", {
    name: newItem.value,
    categories: [category.value],
  });
  addItem(res.data);
  newItem.value = "";
  getLetters(category.value);
};

const removeItem = function (itemId: number) {
  const index = list.value.findIndex((item) => item.id === itemId);
  const { id, name } = list.value.splice(index, 1)[0];
  suggestion.value.push({ id, name });
};

async function saveList() {
  const data = {
    name: pagedata.value.name,
    goods: list.value.map(({ id }) => id),
    completedGoods: list.value.filter((item) => !item.completed).map(({ id }) => id),
  };
  const res = await axios.post(`/api/user-shop-list/${routeId}`, data);
  setListData(res.data);
  isEdit.value = false;
}

function setListData(data: {
  goods: ISuggestionListItem[];
  completedGoods: ISuggestionListItem[];
}) {
  list.value = data?.goods
    ?.map((item: ISuggestionListItem) => ({
      ...item,
      completed: !data?.completedGoods?.find(
        (v: ISuggestionListItem) => item.id === v.id
      ),
    }))
    .sort((a, b) => (a.completed && !b.completed ? -1 : 1));
}

async function getList() {
  const res = await axios.get(`/api/user-shop-list/${routeId}`);
  pagedata.value = res.data;
  setListData(res.data);
}

watch(letter, (newValue?: string) => {
  if (category.value) {
    changeLetter(newValue, category.value);
  }
});

watch(category, (newValue?: number | null) => {
  letter.value = null;
  suggestion.value = [];
  if (newValue) {
    getLetters(newValue);
  }
});

watch(isEdit, (newValue) => {
  if (newValue) {
    getCategoryList();
  }
});

getList();
</script>

<template>
  <div v-if="!isEdit">
    <h3 class="list-header">
      {{ pagedata?.name }}
      <Button icon="pi pi-pen-to-square" @click="isEdit = true" severity="success" />
    </h3>

    <span>{{ formatDate(pagedata?.date) }}</span>
    <Divider />
    <ul class="shop-list" v-if="list?.length">
      <li class="shop-list__item" v-for="(item, index) in list" v-bind:key="item.id">
        <ToggleSwitch
          v-model="item.completed"
          :inputId="`good${index}`"
          @change="saveList()"
        />
        <label :for="`good${index}`" class="ml-2"> {{ item.name }} </label>
      </li>
    </ul>
    <span v-if="!list?.length">No available options</span>
  </div>
  <div v-if="isEdit">
    <InputGroup>
      <InputText v-model="pagedata.name" placeholder="List name" />
    </InputGroup>
    <div class="list-category">
      <Tabs v-model:value="category" scrollable>
        <TabList>
          <Tab v-for="tab in categoryList" v-bind:key="tab" :value="tab.id">{{
            tab.name
          }}</Tab>
        </TabList>
      </Tabs>
      <Button icon="pi pi-plus" @click="createCategoryDialog = true" severity="success" />
    </div>

    <Tabs v-model:value="letter" scrollable>
      <TabList>
        <Tab v-for="tab in letters" v-bind:key="tab" :value="tab">{{ tab }}</Tab>
      </TabList>

      <TabPanels>
        <OrderList
          class="order-list"
          v-model="suggestion"
          dataKey="id"
          pt:pcListbox:root="w-full sm:w-56"
          :buttonProps="{ style: { display: 'none' } }"
          :unstyled="true"
        >
          <template #option="{ option }">
            <InputGroup>
              <InputGroupAddon>
                <span>{{ option.name }}</span>
              </InputGroupAddon>
              <Button icon="pi pi-plus" @click="addItem(option)" severity="success" />
            </InputGroup>
          </template>
        </OrderList>

        <InputGroup style="margin: 0 0.75rem" v-if="categoryList?.length">
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

        <OrderList
          class="order-list"
          v-model="list"
          dataKey="id"
          pt:pcListbox:root="w-full sm:w-56"
          :buttonProps="{ style: { display: 'none' } }"
          :unstyled="true"
        >
          <template #option="{ option }">
            <InputGroup>
              <InputGroupAddon>
                <span>{{ option.name }}</span>
              </InputGroupAddon>
              <Button
                icon="pi pi-times"
                @click="removeItem(option.id)"
                severity="danger"
              />
            </InputGroup>
          </template>
        </OrderList>
        <Divider />
        <Button icon="pi pi-save" @click="saveList()" label="Save" severity="success" />
        <Button
          style="margin-left: 0.5rem"
          icon="pi pi-times"
          @click="isEdit = false"
          label="Cancel"
          severity="danger"
        />
      </TabPanels>
    </Tabs>
  </div>

  <Dialog v-model:visible="createCategoryDialog" modal header="New Category">
    <InputGroup>
      <InputText
        v-model="newCategory"
        v-on:keyup.enter="addNewCategory()"
        placeholder="New Category"
      />
      <Button icon="pi pi-check" @click="addNewCategory()" severity="success" />
    </InputGroup>
  </Dialog>
</template>

<style lang="scss">
.order-list {
  position: relative;
  [data-pc-section="listcontainer"] {
    overflow: auto;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    list-style: none;
    padding: 0.5rem;
    margin: 0;
    height: 100%;
    li {
      margin: 0.25rem;
    }
  }
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.shop-list {
  list-style: none;
  margin: 0.25rem;
  padding: 0.25rem;
  &__item {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    label {
      margin-left: 0.5rem;
    }
  }
}
.list-category {
  display: flex;
  width: 100%;
  position: relative;
  margin-top: 0.5rem;
  .p-tabs {
    width: 100%;
    min-width: 15rem;
  }
  .p-button {
    width: 3.5rem;
  }
}
</style>
