<template>
  <div>
    <NuxtRouteAnnouncer />
    <RandomPokemonImage :pokemon-id="getRandomIntInRange(1, 1025)" />
  </div>
</template>
