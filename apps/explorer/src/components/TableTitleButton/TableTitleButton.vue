<template>
  <div class="table-title-button"></div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  beforeMount() {
    // Detect all clicks on the document
    document.addEventListener('click', this.clickEvent, false)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickEvent, false)
  },
  methods: {
    openDropdownFocustToSearchInput: function() {
      // Focus user input to the seach input.
      this.dropdownOpen = !this.dropdownOpen
    },
    clickEvent: function(event) {
      for (let count = 0; count < event.path.length; count++) {
        if (event.path[count].className === 'coin-selector-click-safe-zone') {
          return
        }
      }
      this.dropdownOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'DropDownBidCurrencySelector.scss';
</style>
