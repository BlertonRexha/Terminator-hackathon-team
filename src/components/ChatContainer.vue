<template>
  <div class="h-full home">
    <div class="h-full bg-gray-50 flex flex-col" x-data="chat">
      <div class="relative">
        <div class="flex justify-center p-4" style="background-color: #e30010">
          <span class="text-white text-bold flex content-center">
            <img src="@/assets/_logo.svg" height="40px" width="40px" />
          </span>
        </div>
        <div class="expand-icon">
          <span class="icon" @click="$emit('expand')">
            <img src="@/assets/expand.svg" height="20px" width="20px" />
          </span>
        </div>
      </div>

      <messages :messages="messages" :show-typing="showTyping" />
      <div class="inset-x-0 bottom-0 bg-gray-200">
        <div
          class="max-w-screen-lg m-auto w-full p-4 flex space-x-4 justify-center items-center"
        >
          <div class="user-input-container">
            <input
              id="message"
              type="text"
              autocomplete="off"
              class="border rounded-md p-2 flex-1 border-gray-300"
              v-model="newMessage"
              @keyup.enter="sendMessage"
              placeholder="Your message..."
            />
            <span class="icon upload-file-input">
              <label for="embedpollfileinput" style="cursor: inherit">
                <img src="@/assets/attach.svg" alt="" />
              </label>
              <input
                type="file"
                @change="fileEvent($event)"
                class="file-input-hidden"
                id="embedpollfileinput"
              />
            </span>
            <span
              class="icon"
              :class="{ disabled: !newMessage }"
              @click="sendMessage"
            >
              <img src="@/assets/send.svg" height="20px" width="20px" />
            </span>
          </div>
        </div>
        <div
          class="message-file max-w-screen-lg space-x-4 w-full px-4 m-auto flex items-center"
        >
          <span v-for="(image, filesIndex) in files" :key="filesIndex">
            {{ image.path }}
            <img src="@/assets/close-circle.svg" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Messages from "@/components/Messages.vue";
import axios from "axios";
export default {
  name: "HomeView",
  components: {
    Messages,
  },
  data() {
    return {
      messages: [
        {
          role: "assistant",
          body: "Hello, how can I help you?",
        },
      ],
      newMessage: "",
      showTyping: false,
      files: [],
      chatId: null,
    };
  },
  methods: {
    fileEvent(event) {
      const file = event.target.files[0];
      if (file) {
        this.files.push({
          blob: URL.createObjectURL(file),
          path: file.name,
        });
      }
    },
    sendMessage() {
      if (!this.newMessage) return;
      this.messages.push({
        role: "user",
        body: this.newMessage,
        files: this.files,
      });
      this.askQuestion(this.newMessage);
      this.newMessage = "";
      this.files = [];
      this.scrollToBottom();
    },
    async askQuestion(question) {
      this.showTyping = true;
      if(!this.chatId) {
        const chatInitiatedApi = await axios.post(
          "http://localhost:8000/chats/",
          {
            message: question,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      console.log(chatInitiatedApi);
      this.chatId = chatInitiatedApi.id_chat;
      if(!this.chatId) return
      const chatResApi = await axios.post(
        `http://localhost:8000/chats/${this.chatId}/messages`,
        {
          message: question,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "allow-access-control-origin": "*",
          },
        }
      );
      this.messages.push({
        role: "assistant",
        body: chatResApi.response,
      });
    },
    scrollToBottom() {
      const messagesContainer = this.$el.querySelector(".messages-conatiner");
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.file-input-hidden {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.user-input-container {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: white;
  border: 1px solid #e3e3e3;
  border-radius: 5px;
  padding: 2px;
  input {
    border: none;
    &:focus {
      outline: none;
    }
  }
  .icon {
    cursor: pointer;
    padding: 0 2px;
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
.expand-icon {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 50px;
  .icon {
    display: flex;
    justify-content: center;
    height: 100%;
    cursor: pointer;
  }
}

.message-file {
  span {
    padding: 2px;
    background: #ccc;
    border-radius: 3px;
    max-width: 201px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    img {
      position: absolute;
      top: 2px;
      right: 2px;
      cursor: pointer;
      height: 25px;
      width: 25px;
    }
  }
}
</style>
