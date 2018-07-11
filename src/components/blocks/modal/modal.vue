<template>
    <!-- Signup Modal -->
    <div v-if="modalStatus == true" class="alert-modal" id="signup-modal">
      <div @click="changeView" class="modal-container"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="logo-box">
            <img src="~@/assets/logo.png">
          </div>
          <h1 class="title">Please verify your email address.</h1>

          <p>
            An email has been sent to customer@gmail.com with a link to verify your email address.
            If you have not received the email after a few minuts, please check your spam folder or <a href="#">resend the verification email</a>.
          </p>

          <button v-on:click="changeView" type="button" class="btn btn-secondary">Okay</button>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ShortDataLastBlock',
  props: ['modalStatus'],
  data() {
    return {}
  },
  methods: {
    changeView() {
      this.$emit('modalDisabled', false)
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/modal/modal.less';
</style>
