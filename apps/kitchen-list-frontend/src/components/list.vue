<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
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

const userId = ref(localStorage.getItem("userId"));

const letters = ref([]);

const letter = ref();

const category: Ref<number | null> = ref(null);

const newItem = ref();

const newCategory = ref();

const categoryList: Ref<ICategory[]> = ref([]);

async function getCategoryList() {
  const res = await axios.get("/api/goods-categories");
  categoryList.value = res.data;
  category.value = categoryList.value[0].id;
}

const suggestion: Ref<ISuggestionListItem[]> = ref([]);

const list: Ref<IListItem[]> = ref([]);

const changeLetter = async function (l?: string, category?: number) {
  if(!l) return;
  const res = await axios.get(`/api/goods-list/${l}`, { params: { category } });
  suggestion.value = res.data?.filter(
    (item: { name: string; id: number }) => !list.value.find((v) => v.id === item.id)
  );
};

const getLetters = async function (category: number | null) {
  if (!category) return;
  const res = await axios.get("/api/goods-list/find", { params: { category } });
  letters.value = res.data;
  letter.value = letters.value[0];
};

const addItem = function (newItem: ISuggestionListItem) {
  if (!list.value.find((item) => item.id === newItem.id)) {
    list.value.push({ ...newItem, actual: true });
  }
};

const addNewCategory = async function () {
  if (!newCategory.value) return;
  const res = await axios.post("/api/goods-categories", { name: newCategory.value });
  newCategory.value = "";
  getCategoryList();
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

const removeItem = function (id: number) {
  const index = list.value.findIndex((item) => item.id === id);
  list.value.splice(index, 1);
};

watch(letter, (newValue?: string) => {
  if (category.value) {
    changeLetter(newValue, category.value);
  }
});

watch(category, (newValue?: number | null) => {
  letter.value = null;
  if (newValue) {
    getLetters(newValue);
  }
});

getCategoryList();
</script>

<template>
  <div>
    <InputGroup>
      <InputText
        v-model="newCategory"
        v-on:keyup.enter="addNewCategory()"
        placeholder="New Category"
      />
      <Button
        icon="pi pi-check"
        @click="addNewCategory()"
        label="Add"
        severity="success"
      />
    </InputGroup>
    <Tabs v-model:value="category" scrollable>
      <TabList>
        <Tab v-for="tab in categoryList" v-bind:key="tab" :value="tab.id">{{
          tab.name
        }}</Tab>
      </TabList>
    </Tabs>
    <Divider />
    <InputGroup>
      <InputText
        v-model="newItem"
        v-on:keyup.enter="addNewItem()"
        placeholder="New Item"
      />
      <Button icon="pi pi-check" @click="addNewItem()" label="Add" severity="success" />
    </InputGroup>
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
      </TabPanels>
    </Tabs>
  </div>
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
</style>
