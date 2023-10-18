<template>
  <div id="myModal" class="modal" :class="{ expanded }">
    <div class="modal-content">
      <slot> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    blank: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 1;
  overflow: none;
  width: 400px;
  height: 600px;
  bottom: 70px;
  right: 2rem;
  box-shadow: #d4d4d4 0 -15px 20px ;
  &.expanded {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  border-radius: 5px;
  height: 100%;
  position: relative;
}
</style>
