<template>
  <div
    class="messages-conatiner relative w-full max-w-screen-lg flex-1 m-auto p-8 my-4 pb-20"
  >
    <div class="flex flex-col">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message rounded-lg py-2 px-6 mb-4"
        :class="
          message.role === 'assistant'
            ? 'assistant bg-blue-100 border-blue-100 self-start'
            : 'user bg-green-200 border-green-200 self-end'
        "
      >
        <div class="w-full text-left">
          {{ message.body }}
          <div class="image-container">
            <div v-for="file in message.files" class="image-box">
              <img :src="file.blob" alt="" />
            </div>
          </div>
        </div>
        <template v-if="message.beingTyped">
          <span
            class="w-2.5 bg-gray-600 h-4 inline-block -mb-0.5 align-baseline blink"
          ></span>
        </template>
      </div>

      <div
        v-if="showTyping"
        class="message assistant rounded-lg py-2.5 px-6 mb-4 bg-blue-100 border-blue-100 self-start"
      >
        <div class="type-indicator">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
      <div v-if="messages.length > 2 && !rate" class="star-rating-container">
        <span class="text-gray-500">Please rate your experience:</span>
        <star-rating
          :star-size="20"
          :show-rating="false"
          @rating-selected="setRating"
        />
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  name: "Messages",
  components: {
    StarRating,
  },
  props: {
    messages: {
      type: Array,
      required: true,
    },
    showTyping: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rate: null,
    };
  },
  methods: {
    setRating(rating) {
      this.rate = rating;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.messages-conatiner {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  .message {
    position: relative;
    max-width: 96%;
    &::after {
      content: "";
      top: 0;
      position: absolute;
      border: 0.75em solid transparent;
      border-top-color: blue;
      display: block;
    }

    &.assistant::after {
      left: -0.45em;
      border-top-color: inherit;
    }

    &.user::after {
      right: -0.45em;
      border-top-color: inherit;
    }
    
    .image-container {
      display: flex;
      flex-wrap: wrap;
      .image-box {
        display: inline-block;
        width: 100px;
        height: 100px;
        margin: 0 .5rem 0.5rem 0;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .type-indicator {
      span {
        display: inline-block;
        padding: 0 0.075em;
        animation: type-indicator 1s ease-in-out infinite;
        transform: translateY(0);
      }

      span:nth-child(2) {
        animation-delay: 150ms;
      }

      span:nth-child(3) {
        animation-delay: 300ms;
      }
    }

    &.blink {
      animation: blink 1.25s infinite;
    }

    @keyframes type-indicator {
      0% {
        transform: none;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
      50% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
    }

    @keyframes blink {
      0% {
        opacity: 1;
      }
      69% {
        opacity: 1;
      }
      70% {
        opacity: 0;
      }
      100% {
        opacity: 0;
      }
    }
  }

  .star-rating-container {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    > span {
      margin-right: 0.5rem;
      margin-top: 5px;
    }
  }
}
</style>
