<template>
  <v-card flat white>
    <v-layout>
      <v-flex xs12 hidden-sm-and-up>
        <div class="token-mobile">
          <v-layout grid-list-xs row wrap align-center justify-start fill-height>
            <v-flex xs2 >
              <div class="loading"></div>
            </v-flex>
            <v-flex xs8 >
                <div class="loading"></div>
                <div class="loading"></div>
                <div class="loading"></div>
                <div class="loading"></div>
            </v-flex>
             <v-flex xs2 >
               <div class="loading"></div>
             </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex hidden-xs-only sm12>
    <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
      <v-flex xs1>
        <div class="loading"></div>
      </v-flex>
      <v-flex xs2>
        <div class="loading"></div>
      </v-flex>
      <v-flex xs2>
        <div class="loading"></div>
      </v-flex>
      <v-flex xs1>
        <div class="loading"></div>
      </v-flex>
      <v-flex xs3>
        <div class="loading"></div>
      </v-flex>
      <v-flex xs3>
        <div class="loading"></div>
      </v-flex>
    </v-layout>
    <v-divider class="mb-2 mt-2" />
    </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class TokenTableRowLoading extends Vue {}
</script>

<style scoped lang="css">
.loading {
  background: #e6e6e6;
  height: 12px;
  border-radius: 2px;
  margin:1px;
}
.token-mobile {
  border: 1px solid #b4bfd2;
  padding: 10px 0px 10px 0px;
  height: 68px;
}
</style>
