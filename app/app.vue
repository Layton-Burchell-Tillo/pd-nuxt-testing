<template>
  <div>
    <NuxtRouteAnnouncer />
    <RandomPokemonImage :pokemon-id="getRandomNumberIntInRange(1, 1025)" />
  </div>
</template>
