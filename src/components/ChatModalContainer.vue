<template>
  <div>
    <modal v-if="showModal" :expanded="expanded">
      <chat-container @expand="expandChatContainer"/>
    </modal>
    <div v-if="!expanded" class="open-modal-icon" @click="triggerModal">
      <img v-if="showModal" src="@/assets/close.svg" height="40px" width="40px" />
      <img v-else src="@/assets/chat.svg" height="40px" width="40px" />
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import ChatContainer from "@/components/ChatContainer.vue";
export default {
  name: "ChatModalContainer",
  components: {
    Modal,
    ChatContainer
  },
  data() {
    return {
      showModal: false,
      expanded: false,
    };
  },
  methods: {
    triggerModal() {
      this.showModal = !this.showModal;
    },
    expandChatContainer() {
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style lang="scss" scoped>
.open-modal-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 1;
}
</style>
