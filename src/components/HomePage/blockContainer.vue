<template>

  <div class="standard-table-3">
    <p class="table-title">
      <icon name='refresh'
            scale='1'></icon> Latest Blocks</p>
    
      <div class="data-block-loop" v-for="block in blocks" v-if="!block.getIsUncle()">
        
        <!-- .data-block-1 -->
        <div class="data-block-1">
          <div>Hash <span>{{block.getHash()}}</span></div>
        </div>
        <!-- .data-block-1 -->
        
        <!-- .data-block-2 -->
        <div class="data-block-2">
          <div>
            <h1>Height</h1>
            <p>{{block.getIntNumber()}}</p>
          </div>
          
          <div>
            <h1>TXs</h1>
            <p>{{block.getTransactions().length}}</p>
          </div>

          <div>
            <h1>Reward<span>(ETH)</span></h1>
            <p>{{block.getBlockReward.toEth()}}</p>
          </div>

          <div>
            <h1>Miner</h1>
            <p>{{block.getMiner()}}</p>
          </div>
        </div>
        <!-- .data-block-2 -->

        <!--sub txs -->
        <div class="data-block-sub">
          <div>

              <div class="sub-icon">
                  <icon name='code-fork' scale='1'></icon>
              </div>
              
              <div class="sub-data">
                <div class="sub-hash-block">
                  <h1>Hash</h1>
                  <p>987h34f38h39489459752907592735927384982</p>
                </div>
                <div class="sub-data-block">
                  <h1>Height</h1>
                  <p>qwr23r23r23r</p>
                </div>
                <div class="sub-data-block">
                  <h1>Reward</h1>
                  <p>124124124124</p>
                </div>
                <div class="sub-data-block">
                  <h1>Miner</h1>
                  <p>2324r23r</p>
                </div>

              </div>

              
          </div>
        </div>
        <!--sub txs -->

      </div>
      <!-- .data-block-loop -->
    
  </div>
  <!-- .standard-table-1 -->

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

<style scoped lang='less'>
@import '~lessPath/standardTables';

.data-block-2{
    display: block;
    position: relative;
    
    >div:nth-child(1){
      width: 15%;
    }

    >div:nth-child(2){
      width: 15%;
    }

    >div:nth-child(3){
      width: 20%;
    }

    >div:nth-child(4){
      width: 40%;
    }


    >div{
        display: inline;
        margin-right: 0px;
        
        h1{
            display: inline;
            font-size: 14px;
            font-family: @stable-font-family;
            vertical-align: middle;
            margin: 0;
            padding: 0;
            font-weight: @stable-font-weight-bold;
            text-transform: uppercase;
        }

        p{
            display: inline;
            text-overflow: ellipsis;
            overflow: hidden;
            
            font-size: 14px;
            vertical-align: middle;
            margin: 0;
            padding: 0;
        }

    }
}


.data-block-sub{

    >div{

        .sub-icon{
            vertical-align: top;

            svg{
                padding: 2px;
                width: 17px;
                height: 17px;
                border-radius: 20px;
                border: 1px solid black;
            }
        }


        >div:nth-child(1){
            width: 22px;
            
            
        }

        >div:nth-child(2){
            width: 20%;
            
        }


        >div:nth-child(3){
            width: 20%;
            
        }


        >div:nth-child(4){
            width: 20%;
            
        }

        >div:nth-child(5){
            width: 20%;
            
        }

    }
   
}



/***********************
 Mobile Responsive
***********************/
@media screen and (min-width: 700px) and (max-width: 1199px){

  .data-block-sub{

      >div{

          .sub-icon{
              vertical-align: top;

              svg{
                  padding: 2px;
                  width: 17px;
                  height: 17px;
                  border-radius: 20px;
                  border: 1px solid black;
              }
          }


          >div:nth-child(1){
              width: 22px;
              
              
          }

          >div:nth-child(2){
              width: 25%;
              
          }


          >div:nth-child(3){
              width: 25%;
              
          }


          >div:nth-child(4){
              width: 20%;
              
          }

          >div:nth-child(5){
              width: 40%;
              
          }

      }
     
  }
}

@media screen and (max-width: 699px){

  .data-block-2{
      display: block;
      position: relative;
      
      >div:nth-child(1){
        width: 20%;
      }

      >div:nth-child(2){
        width: 15%;
      }

      >div:nth-child(3){
        width: 25%;
      }

      >div:nth-child(4){
        width: 30%;
      }


  }

    .data-block-sub{

        >div{

            .sub-icon{
                vertical-align: top;

                svg{
                    padding: 2px;
                    width: 17px;
                    height: 17px;
                    border-radius: 20px;
                    border: 1px solid black;
                }
            }


            >div:nth-child(1){
                width: 22px;
                
                
            }

            >div:nth-child(2){
                width: 15%;
                
            }


            >div:nth-child(3){
                width: 15%;
                
            }


            >div:nth-child(4){
                width: 10%;
                
            }

            >div:nth-child(5){
                width: 30%;
                
            }

        }
       
    }

}


</style>
