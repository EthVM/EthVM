package io.enkrypt.kafka.connect

import org.apache.commons.codec.binary.Hex
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Log
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import java.math.BigInteger

private val HEX_CHARS = "0123456789abcdef".toCharArray()

/**
 * Taken from https://gist.github.com/fabiomsr/845664a9c7e92bafb6fb0ca70d4e44fd
 */
fun ByteArray.toHex(): String {
    val result = StringBuffer()

    forEach {
        val octet = it.toInt()
        val firstIndex = (octet and 0xF0).ushr(4)
        val secondIndex = octet and 0x0F
        result.append(HEX_CHARS[firstIndex])
        result.append(HEX_CHARS[secondIndex])
    }

    return result.toString()
}

fun ByteArray.toBigInteger(): BigInteger = BigInteger(this)

fun Long.toBigInteger(): BigInteger = BigInteger.valueOf(this)

fun String.hexToBytes(): ByteArray = Hex.decodeHex(this.replace("0x", ""))

fun EthBlock.Block.toStruct(schema: Schema): Struct {

    val struct = Struct(schema).apply {
        put("number", number.toByteArray())
        put("hash", hash.hexToBytes())
        put("parentHash", parentHash.hexToBytes())
        put("nonce", nonceRaw.hexToBytes())
        put("sha3Uncles", sha3Uncles.hexToBytes())
        put("logsBloom", logsBloom.hexToBytes())
        put("transactionsRoot", transactionsRoot.hexToBytes())
        put("stateRoot", stateRoot.hexToBytes())
        put("receiptsRoot", receiptsRoot.hexToBytes())
        put("miner", miner.hexToBytes())
        put("difficulty", difficulty.toByteArray())
        put("totalDifficulty", totalDifficulty.toByteArray())
        put("extraData", extraData.hexToBytes())
        put("size", size.toLong())
        put("gasLimit", gasLimit.toByteArray())
        put("gasUsed", gasUsed.toByteArray())
        put("timestamp", timestamp.toLong())
        put("uncles", uncles.map { it.hexToBytes() })
        //  put("transactions", transactions.map {
//
//    when (it.get()) {
//      is Transaction -> (it as Transaction).toStruct(schema.field("transactions").schema().valueSchema())
//      else -> throw IllegalStateException("Unexpected type")
//    }
//
//  })
    }

    if (author != null) struct.put("author", author)
    if (sealFields != null) struct.put("sealFields", sealFields.map { it.hexToBytes() })
    if (mixHash != null) struct.put("mixHash", mixHash.hexToBytes())

    return struct
}

fun Transaction.toStruct(schema: Schema, receipt: TransactionReceipt?): Struct {

    val struct = Struct(schema).apply {
        put("hash", hash.hexToBytes())
        put("nonce", nonce.toByteArray())
        put("transactionIndex", transactionIndex.toByteArray())
        put("from", from.hexToBytes())
        put("value", value.toByteArray())
        put("gasPrice", gasPrice.toByteArray())
        put("gas", gas.toByteArray())
    }

    if (receipt != null) struct.put("receipt", receipt.toStruct(schema.field("receipt").schema()))

    if (to != null) struct.put("to", to.hexToBytes())
    if (input != null) struct.put("input", input.hexToBytes())
    if (creates != null) struct.put("creates", creates.hexToBytes())
    if (publicKey != null) struct.put("publicKey", publicKey.hexToBytes())
    if (raw != null) struct.put("raw", raw.hexToBytes())

    return struct
}

fun TransactionReceipt.toStruct(schema: Schema): Struct {

    val struct = Struct(schema)
    struct.put("cumulativeGasUsed", cumulativeGasUsed.toByteArray())
    struct.put("gasUsed", gasUsed.toByteArray())
    struct.put("logsBloom", logsBloom.hexToBytes())
    struct.put("logs", logs.map { it.toStruct(schema.field("logs").schema().valueSchema()) })

    if (root != null) struct.put("root", root.hexToBytes())
    if (contractAddress != null) struct.put("contractAddress", contractAddress.hexToBytes())
    if (status != null) struct.put("status", status.hexToBytes())

    return struct
}

fun Log.toStruct(schema: Schema): Struct =
        Struct(schema)
                .put("address", address.hexToBytes())
                .put("data", data.hexToBytes())
                .put("topics", topics.map { it.hexToBytes() })
