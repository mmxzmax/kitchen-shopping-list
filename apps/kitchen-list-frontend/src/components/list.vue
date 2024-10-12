<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import PickList from "primevue/picklist";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import Divider from "primevue/divider";
import axios from "axios";

const userId = ref(localStorage.getItem("userId"));

const letters = ref([]);

const letter = ref();

const newItem = ref();

const suggestion: Ref<
  [{ name?: string; id: number }[], { name?: string; id: number, actual: boolean }[]]
> = ref([[], []]);

const changeLetter = async function (l?: string) {
  if (!l) {
    return;
  }
  const res = await axios.get(`/api/goods-list/${l}`);
  if (res.data?.length) {
    suggestion.value[0] = res.data?.filter(
      (item: { name: string; id: number }) =>
        !suggestion.value[1].find((v) => v.id === item.id)
    );
  }
};

const getLetters = async function () {
  const res = await axios.get("/api/goods-list/find");
  letters.value = res.data;
  letter.value = letters.value[0];
};

const addNewItem = async function () {
  const res = await axios.post("/api/goods-list", { name: newItem.value });
  if (!suggestion.value[1].find((item) => item.id === res.data.id)) {
    suggestion.value[1].push({...res.data, actual: true});
  }
  newItem.value = "";
  getLetters();
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
        <PickList
          v-model="suggestion"
          :showSourceControls="false"
          :showTargetControls="false"
          dataKey="id"
          breakpoint="1400px"
        >
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </PickList>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style lang="scss"></style>
