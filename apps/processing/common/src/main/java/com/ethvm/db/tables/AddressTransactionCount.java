/*
 * This file is generated by jOOQ.
 */
package com.ethvm.db.tables;


import com.ethvm.db.Indexes;
import com.ethvm.db.Keys;
import com.ethvm.db.Public;
import com.ethvm.db.tables.records.AddressTransactionCountRecord;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.TableImpl;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.11"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class AddressTransactionCount extends TableImpl<AddressTransactionCountRecord> {

    private static final long serialVersionUID = 1194084847;

    /**
     * The reference instance of <code>public.address_transaction_count</code>
     */
    public static final AddressTransactionCount ADDRESS_TRANSACTION_COUNT = new AddressTransactionCount();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<AddressTransactionCountRecord> getRecordType() {
        return AddressTransactionCountRecord.class;
    }

    /**
     * The column <code>public.address_transaction_count.address</code>.
     */
    public final TableField<AddressTransactionCountRecord, String> ADDRESS = createField("address", org.jooq.impl.SQLDataType.CHAR(42).nullable(false), this, "");

    /**
     * The column <code>public.address_transaction_count.total</code>.
     */
    public final TableField<AddressTransactionCountRecord, Long> TOTAL = createField("total", org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    /**
     * The column <code>public.address_transaction_count.total_out</code>.
     */
    public final TableField<AddressTransactionCountRecord, Long> TOTAL_OUT = createField("total_out", org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    /**
     * The column <code>public.address_transaction_count.total_in</code>.
     */
    public final TableField<AddressTransactionCountRecord, Long> TOTAL_IN = createField("total_in", org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    /**
     * The column <code>public.address_transaction_count.block_number</code>.
     */
    public final TableField<AddressTransactionCountRecord, BigDecimal> BLOCK_NUMBER = createField("block_number", org.jooq.impl.SQLDataType.NUMERIC.nullable(false), this, "");

    /**
     * Create a <code>public.address_transaction_count</code> table reference
     */
    public AddressTransactionCount() {
        this(DSL.name("address_transaction_count"), null);
    }

    /**
     * Create an aliased <code>public.address_transaction_count</code> table reference
     */
    public AddressTransactionCount(String alias) {
        this(DSL.name(alias), ADDRESS_TRANSACTION_COUNT);
    }

    /**
     * Create an aliased <code>public.address_transaction_count</code> table reference
     */
    public AddressTransactionCount(Name alias) {
        this(alias, ADDRESS_TRANSACTION_COUNT);
    }

    private AddressTransactionCount(Name alias, Table<AddressTransactionCountRecord> aliased) {
        this(alias, aliased, null);
    }

    private AddressTransactionCount(Name alias, Table<AddressTransactionCountRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> AddressTransactionCount(Table<O> child, ForeignKey<O, AddressTransactionCountRecord> key) {
        super(child, key, ADDRESS_TRANSACTION_COUNT);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schema getSchema() {
        return Public.PUBLIC;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Index> getIndexes() {
        return Arrays.<Index>asList(Indexes.ADDRESS_TRANSACTION_COUNT_PKEY, Indexes.IDX_ADDRESS_TRANSACTION_COUNTS_BY_NUMBER, Indexes.IDX_TRANSACTION_COUNTS_FOR_ADDRESS, Indexes.IDX_TX_COUNTS_FOR_ADDRESS);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UniqueKey<AddressTransactionCountRecord> getPrimaryKey() {
        return Keys.ADDRESS_TRANSACTION_COUNT_PKEY;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<AddressTransactionCountRecord>> getKeys() {
        return Arrays.<UniqueKey<AddressTransactionCountRecord>>asList(Keys.ADDRESS_TRANSACTION_COUNT_PKEY);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AddressTransactionCount as(String alias) {
        return new AddressTransactionCount(DSL.name(alias), this);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AddressTransactionCount as(Name alias) {
        return new AddressTransactionCount(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public AddressTransactionCount rename(String name) {
        return new AddressTransactionCount(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public AddressTransactionCount rename(Name name) {
        return new AddressTransactionCount(name, null);
    }
}