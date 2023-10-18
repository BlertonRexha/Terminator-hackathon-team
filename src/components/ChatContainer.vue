<template>
  <div class="h-full">
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

      <messages
        :messages="messages"
        :show-typing="showTyping"
        @resetChat="resetChat"
      />
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
            <img
              src="@/assets/close-circle.svg"
              @click="files.splice(filesIndex, 1)"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const baseUrl = "http://localhost:8000/chats/";
import Messages from "@/components/Messages.vue";
// import axios from "axios";
export default {
  name: "ChatContainer",
  components: {
    Messages,
  },
  data() {
    return {
      messages: [
        {
          role: "assistant",
          body: "Hello! How can I assist you today?",
        },
      ],
      newMessage: "",
      showTyping: false,
      files: [],
      chatId: null,
    };
  },
  beforeMount() {
    if (this.$route.params.chatId) {
      this.chatId = this.$route.params.chatId;
      this.getMessages(this.chatId);
    }
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
    getMessages(id) {
      this.showTyping = true;
      this.$axios
        .get(`${baseUrl}${id}`)
        .then((res) => {
          this.messages = this.messages.concat(
            res.data.chatMessages.map(({ role, message }) => {
              return {
                role: role,
                body: message,
              };
            })
          );
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.showTyping = false;
        });
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
      if (!this.chatId) {
        await this.createChat(question);
      } else {
        await this.sendMessageToChat(question);
      }
      this.showTyping = false;
      this.scrollToBottom();
    },
    async createChat(question) {
      try {
        const chatInitiatedApi = await this.$axios.post(
          baseUrl,
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
        this.chatId = chatInitiatedApi.data.id_chat;
        this.$router.push({ params: { chatId: this.chatId } });
        this.messages.push({
          role: "assistant",
          body: chatInitiatedApi.data.chat_answer,
        });
      } catch (err) {
        if (err?.response?.data?.length) {
          this.messages.push({
            role: "assistant",
            body: err.response.data[0],
          });
        }
      }
    },
    async sendMessageToChat(question) {
      try {
        const chatResApi = await this.$axios.post(
          `${baseUrl}${this.chatId}/messages`,
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
          body: chatResApi.data.response,
        });
      } catch (err) {
        if (err?.response?.data?.length) {
          this.messages.push({
            role: "assistant",
            body: err.response.data[0],
          });
        }
        console.log(err);
      }
    },
    scrollToBottom() {
      const messagesContainer = this.$el.querySelector(".messages-conatiner");
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    resetChat() {
      this.messages = [
        {
          role: "assistant",
          body: "Hello! How can I assist you today?",
        },
      ];
      this.chatId = null;
      this.$router.push({ params: { chatId: null } });
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
  margin-bottom: 3px;
  span {
    padding: 2px;
    background: #ccc;
    border-radius: 3px;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    padding-right: 20px;
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
