<script setup lang="ts">
const modal = useTemplateRef('modalRef')

function openModal() {
  modal.value?.showModal()
}
</script>

<template>
  <div>
    <button @click="openModal" >
      click me!
    </button>
    <dialog ref="modalRef" :open="false">
      dialog open
    </dialog>
  </div>
</template>