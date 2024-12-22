<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
    :class="$attrs.class"
  >
    <slot></slot>
  </span>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>
