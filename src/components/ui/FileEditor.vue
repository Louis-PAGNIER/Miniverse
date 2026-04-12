<script setup lang="ts">
import hljs from "highlight.js";
// @ts-ignore
import CodeEditor from "simple-code-editor";
import {computed, onMounted, ref, watch} from "vue";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import ActionButton from "@/components/ui/ActionButton.vue";

const props = defineProps<{
  filename: string,
  onSave?: Function
}>();

const fileContent = defineModel<string | null>({default: ""});
const initialContent = ref<string | null>(null);

const detectedLanguage = computed(() => {
  if (!props.filename) return "plaintext";

  const parts = props.filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() : "plaintext";
});

const editorLanguages = computed(() => {
  const lang = detectedLanguage.value;
  return [[lang, lang?.toUpperCase()]];
});

const hasChanged = computed(() => {
  return fileContent.value != initialContent.value;
})

const handleSave = async () => {
  if (fileContent.value !== null) {
    if (props.onSave) {
      await props.onSave(fileContent.value);
    }
    initialContent.value = fileContent.value;
  }
};

onMounted(() => {
  initialContent.value = fileContent.value;
})
</script>

<template>
  <teleport defer to="#sheets-container">
    <ActionButton v-if="hasChanged" class="save-button" @click="handleSave" severity="success">
      <font-awesome-icon :icon="faSave"></font-awesome-icon>
      Save
    </ActionButton>
  </teleport>

  <CodeEditor
      :highlight="hljs"
      width="100%"
      height="100%"
      :line-nums="true"
      :languages="editorLanguages"
      v-model="fileContent">
  </CodeEditor>
</template>

<style scoped>
.save-button {
  position: absolute;
  top: 1.25em;
  right: 1.25em;
}
</style>
