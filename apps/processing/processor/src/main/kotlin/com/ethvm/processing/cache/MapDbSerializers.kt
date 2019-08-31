package com.ethvm.processing.cache

import org.apache.avro.Schema
import org.apache.avro.io.DecoderFactory
import org.apache.avro.io.EncoderFactory
import org.apache.avro.specific.SpecificDatumReader
import org.apache.avro.specific.SpecificDatumWriter
import org.apache.avro.specific.SpecificRecord
import org.mapdb.DataInput2
import org.mapdb.DataOutput2
import org.mapdb.Serializer
import java.math.BigInteger

class SpecificAvroSerializer<T : SpecificRecord>(
  private val schema: Schema
) : Serializer<T> {

  override fun serialize(out: DataOutput2, value: T) {
    val encoder = EncoderFactory.get().binaryEncoder(out, null)
    val datumWriter = SpecificDatumWriter<T>(schema)
    datumWriter.write(value, encoder)
    encoder.flush()
  }

  override fun deserialize(input: DataInput2, available: Int): T {
    val bytes = ByteArray(available)
    input.readFully(bytes)
    val decoder = DecoderFactory.get().binaryDecoder(bytes, null)
    val datumReader = SpecificDatumReader<T>(schema)
    return datumReader.read(null, decoder)
  }
}

object MapDbSerializers {

  fun <T : SpecificRecord> forAvro(schema: Schema) = SpecificAvroSerializer<T>(schema)

  val BigInteger = object : Serializer<BigInteger> {
    override fun serialize(out: DataOutput2, value: BigInteger) {
      out.write(value.toByteArray())
    }

    override fun deserialize(input: DataInput2, available: Int): BigInteger {
      val bytes = ByteArray(available)
      input.readFully(bytes)
      return BigInteger(bytes)
    }
  }

}
