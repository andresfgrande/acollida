<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "BaseCard"
}
</script>

<style scoped>
.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 2rem auto;
  max-width: 33rem;
}
@media screen and (max-width: 768px) {
  .card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 1rem;
    margin: 2rem auto;
    max-width: 18rem;
  }
}
</style>