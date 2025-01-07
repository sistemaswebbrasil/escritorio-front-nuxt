<script setup lang="ts">
import { useTaskApi } from "~/@core/composable/useTaskApi";
import type { Task } from "~/types/task";

const taskApi = useTaskApi();
const loading = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const tasks = ref<Task[]>([]);
const searchQuery = ref("");
const search = ref("");

const defaultItem = ref<Task>({
  id: -1,
  title: "",
  description: "",
  status: "PENDING",
  createdAt: new Date().toISOString(),
  updatedAt: "",
});

const editedItem = ref<Task>(defaultItem.value);
const editedIndex = ref(-1);

// Fetch initial data
const fetchTasks = async () => {
  loading.value = true;

  try {
    tasks.value = await taskApi.getAllTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    loading.value = false;
  }
};

// Methods
const editItem = (item: Task) => {
  editedIndex.value = tasks.value.indexOf(item);
  editedItem.value = { ...item };
  editDialog.value = true;
};

const addItem = () => {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem.value };
  editDialog.value = true;
};

const deleteItem = (item: Task) => {
  editedIndex.value = tasks.value.indexOf(item);
  editedItem.value = { ...item };
  deleteDialog.value = true;
};

const close = () => {
  editDialog.value = false;
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem.value };
};

const closeDelete = () => {
  deleteDialog.value = false;
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem.value };
};

const save = async () => {
  loading.value = true;
  try {
    if (editedIndex.value > -1) {
      // Update
      await taskApi.updateTask(editedItem.value.id, editedItem.value);
    } else {
      // Create
      const { id, ...taskData } = editedItem.value;
      await taskApi.createTask(taskData);
    }
    await fetchTasks();
    close();
  } catch (error) {
    console.error("Error saving task:", error);
  } finally {
    loading.value = false;
  }
};

const deleteItemConfirm = async () => {
  loading.value = true;
  try {
    await taskApi.deleteTask(editedItem.value.id);
    await fetchTasks();
    closeDelete();
  } catch (error) {
    console.error("Error deleting task:", error);
  } finally {
    loading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchTasks();
});

// Status options
const selectedOptions = [
  { text: "PENDING", value: "PENDING" },
  { text: "TODO", value: "TODO" },
  { text: "IN_PROGRESS", value: "IN_PROGRESS" },
  { text: "BACKLOG", value: "BACKLOG" },
];

// Headers
const headers = [
  { title: "ID", key: "id" },
  { title: "TÍTULO", key: "title" },
  { title: "DESCRIÇÃO", key: "description" },
  { title: "STATUS", key: "status" },
  { title: "CRIADO EM", key: "createdAt" },
  { title: "AÇÕES", key: "actions" },
];

const resolveStatusVariant = (status: string) => {
  const variants = {
    PENDING: { color: "warning", text: "Pendente" },
    TODO: { color: "info", text: "A Fazer" },
    IN_PROGRESS: { color: "success", text: "Em Progresso" },
    BACKLOG: { color: "grey", text: "Backlog" },
  };
  return (
    variants[status as keyof typeof variants] || { color: "grey", text: status }
  );
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <VCard title="Lista de Tarefas">
    <VCardText>
      <div class="d-flex flex-wrap gap-4 ma-6">
        <div class="d-flex align-center">
          <AppTextField
            prepend-inner-icon="tabler-search"
            v-model="search"
            placeholder="Pesquisar"
            style="inline-size: 300px"
            class="me-3"
          />
        </div>

        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <VBtn color="primary" prepend-icon="tabler-plus" @click="addItem()">
            Adicionar Tarefa
          </VBtn>
          <VBtn
            color="secondary"
            prepend-icon="tabler-refresh"
            @click="fetchTasks"
          >
            Atualizar
          </VBtn>
        </div>
      </div>

      <VDataTable
        :headers="headers"
        :items="tasks"
        :search="search"
        :items-per-page="5"
        :loading="loading"
        :sort-by="[{ key: 'id', order: 'desc' }]"
      >
        <!-- Status -->
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>

        <!-- Created At -->
        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="editItem(item)">
              <VIcon icon="tabler-edit" />
            </IconBtn>
            <IconBtn @click="deleteItem(item)">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>

  <!-- Edit Dialog -->
  <VDialog v-model="editDialog" max-width="600px">
    <VCard title="Editar Tarefa">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <AppTextField v-model="editedItem.title" label="Título" />
          </VCol>

          <VCol cols="12">
            <AppTextField v-model="editedItem.description" label="Descrição" />
          </VCol>

          <VCol cols="12">
            <AppSelect
              v-model="editedItem.status"
              :items="selectedOptions"
              item-title="text"
              item-value="value"
              label="Status"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText>
        <div class="d-flex gap-4 justify-end">
          <VBtn color="error" variant="outlined" @click="close">
            Cancelar
          </VBtn>
          <VBtn color="success" variant="elevated" @click="save"> Salvar </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- Delete Dialog -->
  <VDialog v-model="deleteDialog" max-width="500px">
    <VCard title="Tem certeza que deseja excluir esta tarefa?">
      <VCardText>
        <div class="d-flex justify-center gap-4">
          <VBtn color="error" variant="outlined" @click="closeDelete">
            Cancelar
          </VBtn>
          <VBtn color="success" variant="elevated" @click="deleteItemConfirm">
            Confirmar
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>
