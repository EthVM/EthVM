<template>
    <div class="block-detail">
        <div class="block-detail-container" v-if="tx">
            <div class="details">
                <div>
                    <li>Hash</li>
                    <li>{{tx.getHash().toString()}}</li>
                </div>
                <div>
                    <li>Status</li>
                    <li>{{getStringStatus(tx.getStatus())}}</li>
                </div>
                <div>
                    <li>Time Stamp</li>
                    <li>{{tx.getTimestamp().toDate().toString()}} (
                        <timeago :since="tx.getTimestamp().toDate()" :auto-update="10"></timeago>)</li>
                </div>
                <div>
                    <li>From</li>
                    <li class= "address-link"><router-link :to="'/address/'+tx.getFrom().toString()">{{tx.getFrom().toString()}}</router-link></li>
                </div>
                
                    <div v-if="tx.getContractAddress().toString()">
                        <li>Contract</li>
                        <li class= "link"><router-link :to="'/address/'+tx.getTo().toString()">{{tx.getContractAddress().toString()}}</router-link></li>
                    </div>
                    <div v-else>
                        <li>To</li>
                        <li class="link"><router-link :to="'/address/'+tx.getTo().toString()">{{tx.getTo().toString()}}</router-link></li>
                    </div>
                
                <div>
                    <li>Amount</li>
                    <li>{{tx.getValue().toEth().toString()}}&nbsp;ETH</li>
                </div>
                <div>
                    <li>Block</li>
                    <li class="link"><router-link :to="'/block/'+tx.getBlockHash().toString()">{{tx.getBlockNumber().toNumber()}}</router-link></li>
                </div>
                <div>
                    <li>Gas Limit</li>
                    <li>{{tx.getGas().toNumber()}}</li>
                </div>
                <div>
                    <li>Gas Used</li>
                    <li>{{tx.getGasUsed().toNumber()}}</li>
                </div>
                <div>
                    <li>Gas Price</li>
                    <li>{{tx.getGasPrice().toGWei()}}</li>
                </div>
                <div>
                    <li>Tx Cost</li>
                    <li>{{getTxCost(tx.getGasPrice().toEth(), tx.getGasUsed().toNumber())}} &nbsp;ETH</li>
                </div>
            </div>
            <!-- .details -->
        </div>
        <!-- .block-detail-container -->
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import store from '@/states';
import {
    Block,
    common,
    Tx
} from '@/libs';
export default Vue.extend({
    name: 'TxView',
    props: [
        'tx'
    ],
    data() {
        return {}
    },
    methods: {
        getStringStatus(isBool) {
            if (isBool)
                return 'Successful';
            else
                return 'Failed';
        },
        getTxCost(price, used) {
            return (price * used)
        }
    },
    mounted: function() {

    },
    computed: {
      
    }
})
</script>
<style scoped="" lang="less">
@import "~lessPath/sunil/blocks/largeBlocks/txDetail.less";
</style>
