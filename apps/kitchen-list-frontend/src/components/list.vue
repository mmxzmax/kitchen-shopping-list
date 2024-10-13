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

interface ISuggestionListItem {
  name: string;
  id: number;
}

interface IListItem extends ISuggestionListItem {
  actual: boolean;
}

const userId = ref(localStorage.getItem("userId"));

const letters = ref([]);

const letter = ref();

const newItem = ref();

const suggestion: Ref<ISuggestionListItem[]> = ref([]);

const list: Ref<IListItem[]> = ref([]);

const changeLetter = async function (l?: string) {
  if (!l) {
    return;
  }
  const res = await axios.get(`/api/goods-list/${l}`);
  if (res.data?.length) {
    suggestion.value = res.data?.filter(
      (item: { name: string; id: number }) => !list.value.find((v) => v.id === item.id)
    );
  }
};

const getLetters = async function () {
  const res = await axios.get("/api/goods-list/find");
  letters.value = res.data;
  letter.value = letters.value[0];
};

const addItem = function (newItem: ISuggestionListItem) {
  if (!list.value.find((item) => item.id === newItem.id)) {
    list.value.push({ ...newItem, actual: true });
  }
};

const addNewItem = async function () {
  const res = await axios.post("/api/goods-list", { name: newItem.value });
  addItem(res.data);
  newItem.value = "";
  getLetters();
};

const removeItem = function (id: number) {
  const index = list.value.findIndex((item) => item.id === id);
  list.value.splice(index, 1);
};

watch(letter, (newValue?: string) => {
  changeLetter(newValue);
});

getLetters();
</script>

<template>
  <div>
    <Tabs v-model:value="letter" scrollable>
      <TabList>
        <Tab v-for="tab in letters" v-bind:key="tab" :value="tab">{{ tab }}</Tab>
      </TabList>

      <TabPanels>
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
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    list-style: none;
    padding: 0.5rem;
    margin: 0;
    li {
      margin: 0.25rem;
    }
  }
}
</style>
