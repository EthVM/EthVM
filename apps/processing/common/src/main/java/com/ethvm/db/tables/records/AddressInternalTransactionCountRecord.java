/*
 * This file is generated by jOOQ.
 */
package com.ethvm.db.tables.records;


import com.ethvm.db.tables.AddressInternalTransactionCount;

import java.math.BigDecimal;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.Record2;
import org.jooq.Record5;
import org.jooq.Row5;
import org.jooq.impl.UpdatableRecordImpl;


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
public class AddressInternalTransactionCountRecord extends UpdatableRecordImpl<AddressInternalTransactionCountRecord> implements Record5<String, Long, Long, Long, BigDecimal> {

    private static final long serialVersionUID = -1010080923;

    /**
     * Setter for <code>public.address_internal_transaction_count.address</code>.
     */
    public AddressInternalTransactionCountRecord setAddress(String value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>public.address_internal_transaction_count.address</code>.
     */
    public String getAddress() {
        return (String) get(0);
    }

    /**
     * Setter for <code>public.address_internal_transaction_count.total</code>.
     */
    public AddressInternalTransactionCountRecord setTotal(Long value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for <code>public.address_internal_transaction_count.total</code>.
     */
    public Long getTotal() {
        return (Long) get(1);
    }

    /**
     * Setter for <code>public.address_internal_transaction_count.total_out</code>.
     */
    public AddressInternalTransactionCountRecord setTotalOut(Long value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.address_internal_transaction_count.total_out</code>.
     */
    public Long getTotalOut() {
        return (Long) get(2);
    }

    /**
     * Setter for <code>public.address_internal_transaction_count.total_in</code>.
     */
    public AddressInternalTransactionCountRecord setTotalIn(Long value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for <code>public.address_internal_transaction_count.total_in</code>.
     */
    public Long getTotalIn() {
        return (Long) get(3);
    }

    /**
     * Setter for <code>public.address_internal_transaction_count.block_number</code>.
     */
    public AddressInternalTransactionCountRecord setBlockNumber(BigDecimal value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for <code>public.address_internal_transaction_count.block_number</code>.
     */
    public BigDecimal getBlockNumber() {
        return (BigDecimal) get(4);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Record2<String, BigDecimal> key() {
        return (Record2) super.key();
    }

    // -------------------------------------------------------------------------
    // Record5 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row5<String, Long, Long, Long, BigDecimal> fieldsRow() {
        return (Row5) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row5<String, Long, Long, Long, BigDecimal> valuesRow() {
        return (Row5) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field1() {
        return AddressInternalTransactionCount.ADDRESS_INTERNAL_TRANSACTION_COUNT.ADDRESS;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field2() {
        return AddressInternalTransactionCount.ADDRESS_INTERNAL_TRANSACTION_COUNT.TOTAL;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field3() {
        return AddressInternalTransactionCount.ADDRESS_INTERNAL_TRANSACTION_COUNT.TOTAL_OUT;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field4() {
        return AddressInternalTransactionCount.ADDRESS_INTERNAL_TRANSACTION_COUNT.TOTAL_IN;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<BigDecimal> field5() {
        return AddressInternalTransactionCount.ADDRESS_INTERNAL_TRANSACTION_COUNT.BLOCK_NUMBER;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String component1() {
        return getAddress();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long component2() {
        return getTotal();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long component3() {
        return getTotalOut();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long component4() {
        return getTotalIn();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public BigDecimal component5() {
        return getBlockNumber();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value1() {
        return getAddress();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value2() {
        return getTotal();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value3() {
        return getTotalOut();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value4() {
        return getTotalIn();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public BigDecimal value5() {
        return getBlockNumber();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AddressInternalTransactionCountRecord value1(String value) {
        setAddress(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AddressInternalTransactionCountRecord value2(Long value) {
        setTotal(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AddressInternalTransactionCountRecord value3(Long value) {
        setTotalOut(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AddressInternalTransactionCountRecord value4(Long value) {
        setTotalIn(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AddressInternalTransactionCountRecord value5(BigDecimal value) {
        setBlockNumber(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AddressInternalTransactionCountRecord values(String value1, Long value2, Long value3, Long value4, BigDecimal value5) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached AddressInternalTransactionCountRecord
     */
    public AddressInternalTransactionCountRecord() {
        super(AddressInternalTransactionCount.ADDRESS_INTERNAL_TRANSACTION_COUNT);
    }

    /**
     * Create a detached, initialised AddressInternalTransactionCountRecord
     */
    public AddressInternalTransactionCountRecord(String address, Long total, Long totalOut, Long totalIn, BigDecimal blockNumber) {
        super(AddressInternalTransactionCount.ADDRESS_INTERNAL_TRANSACTION_COUNT);

        set(0, address);
        set(1, total);
        set(2, totalOut);
        set(3, totalIn);
        set(4, blockNumber);
    }
}