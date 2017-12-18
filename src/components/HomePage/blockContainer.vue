<template>
  <div class="standard-table-2">
    <p class= "table-title"><icon name='cube' scale='1'></icon> Last Blocks</p>
    <table>
      <thead>
        <tr>
          <td><div>Height</div></td>
          <td><div>Hash</div></td>
          <td><div>TXs</div></td>
          <td><div>Block Reward(ETH)</div></td>
          <td><div>TX Fees(ETH)</div></td>
          <td><div>Miner</div></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="block in blocks" v-if="!block.getIsUncle()">
          <td><div>{{block.getIntNumber()}}</div></td>
          <td><div>{{block.getHash()}}</div></td>
          <td><div>{{block.getTransactions().length}}</div></td>
          <td><div>{{block.getBlockReward.toEth()}}</div></td>
          <td><div>{{block.getTxFees.toEth()}}</div></td>
          <td><div>{{block.getMiner()}}</div></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
export default Vue.extend({
  name: 'block-container',
  props: ['maxItems'],
  data () {
    return {
      store: store
    }
  },
  mounted: function () {

  },
  computed: {
    blocks () {
      return store.getters.getBlocks.slice(0, this.maxItems)
    }
  }
})
</script>

<style lang='less'>
@import "~lessPath/frontpage.less";
@import "~lessPath/latest-blocks-table";


table{
  width: 100%;

  thead,
  tbody{
    tr{
      td{
        margin: 0;
        padding: 0;


        &:nth-child(1){
          width: 10%;
        }

        &:nth-child(2){
          width: 20%;
        }

        &:nth-child(3){
          width: 10%;
        }

        &:nth-child(4){
          width: 20%;
        }

        &:nth-child(5){
          width: 20%;
        }

        &:nth-child(6){
          width: 20%;
        }

      }
    }
  }

}






/***********************
 Mobile Responsive
***********************/
@media screen and (max-width: 699px){


  table{
    width: 100%;

    thead,
    tbody{
      tr{
        td{
          margin: 0;
          padding: 0;


          &:nth-child(1){
            width: 20%;
          }

          &:nth-child(2){
            width: 35%;

            div{
              width: 90px;
            }
          }

          &:nth-child(3){
            width: 15%;
          }

          &:nth-child(4){
            width: 0%;
            display: none;
          }

          &:nth-child(5){
            width: 0%;
            display: none;
          }

          &:nth-child(6){
            width: 30%;
          }

        }
      }
    }

  }


}


@media screen and (min-width: 700px) and (max-width: 1199px){


  table{
    width: 100%;

    thead,
    tbody{
      tr{
        td{
          margin: 0;
          padding: 0;


          &:nth-child(1){
            width: 20%;
          }

          &:nth-child(2){
            width: 30%;

            div{
              width: 180px;
            }
          }

          &:nth-child(3){
            width: 10%;
          }

          &:nth-child(4){
            width: 0%;
            display: none;
          }

          &:nth-child(5){
            width: 20%;

          }

          &:nth-child(6){
            width: 20%;
          }

        }
      }
    }

  }


}
</style>
