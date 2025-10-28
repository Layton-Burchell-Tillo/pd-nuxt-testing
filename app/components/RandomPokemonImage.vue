<script setup lang="ts">
const props = defineProps<{
  pokemonId: number
}>()

const baseUrl = 'https://pokeapi.co/api/v2/pokemon'
const dataUrl = `${baseUrl}/${props.pokemonId}`

const response = await fetch(dataUrl)
const data = await response.json();
</script>

<template>
  <h1>Random pokemon image</h1>
  <img
    :src="data.sprites.front_default"
    :style="{
      width: '300px',
      height: '300px',
      backgroundColor: 'lightblue',
      imageRendering: 'pixelated',
    }"
  >
</template>