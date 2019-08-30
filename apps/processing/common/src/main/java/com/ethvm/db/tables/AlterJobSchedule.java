/*
 * This file is generated by jOOQ.
 */
package com.ethvm.db.tables;


import com.ethvm.db.Public;
import com.ethvm.db.tables.records.AlterJobScheduleRecord;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
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
public class AlterJobSchedule extends TableImpl<AlterJobScheduleRecord> {

    private static final long serialVersionUID = 1040955301;

    /**
     * The reference instance of <code>public.alter_job_schedule</code>
     */
    public static final AlterJobSchedule ALTER_JOB_SCHEDULE = new AlterJobSchedule();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<AlterJobScheduleRecord> getRecordType() {
        return AlterJobScheduleRecord.class;
    }

    /**
     * The column <code>public.alter_job_schedule.job_id</code>.
     */
    public final TableField<AlterJobScheduleRecord, Integer> JOB_ID = createField("job_id", org.jooq.impl.SQLDataType.INTEGER, this, "");

    /**
     * @deprecated Unknown data type. Please define an explicit {@link org.jooq.Binding} to specify how this type should be handled. Deprecation can be turned off using {@literal <deprecationOnUnknownTypes/>} in your code generator configuration.
     */
    @java.lang.Deprecated
    public final TableField<AlterJobScheduleRecord, Object> SCHEDULE_INTERVAL = createField("schedule_interval", org.jooq.impl.DefaultDataType.getDefaultDataType("\"pg_catalog\".\"interval\""), this, "");

    /**
     * @deprecated Unknown data type. Please define an explicit {@link org.jooq.Binding} to specify how this type should be handled. Deprecation can be turned off using {@literal <deprecationOnUnknownTypes/>} in your code generator configuration.
     */
    @java.lang.Deprecated
    public final TableField<AlterJobScheduleRecord, Object> MAX_RUNTIME = createField("max_runtime", org.jooq.impl.DefaultDataType.getDefaultDataType("\"pg_catalog\".\"interval\""), this, "");

    /**
     * The column <code>public.alter_job_schedule.max_retries</code>.
     */
    public final TableField<AlterJobScheduleRecord, Integer> MAX_RETRIES = createField("max_retries", org.jooq.impl.SQLDataType.INTEGER, this, "");

    /**
     * @deprecated Unknown data type. Please define an explicit {@link org.jooq.Binding} to specify how this type should be handled. Deprecation can be turned off using {@literal <deprecationOnUnknownTypes/>} in your code generator configuration.
     */
    @java.lang.Deprecated
    public final TableField<AlterJobScheduleRecord, Object> RETRY_PERIOD = createField("retry_period", org.jooq.impl.DefaultDataType.getDefaultDataType("\"pg_catalog\".\"interval\""), this, "");

    /**
     * Create a <code>public.alter_job_schedule</code> table reference
     */
    public AlterJobSchedule() {
        this(DSL.name("alter_job_schedule"), null);
    }

    /**
     * Create an aliased <code>public.alter_job_schedule</code> table reference
     */
    public AlterJobSchedule(String alias) {
        this(DSL.name(alias), ALTER_JOB_SCHEDULE);
    }

    /**
     * Create an aliased <code>public.alter_job_schedule</code> table reference
     */
    public AlterJobSchedule(Name alias) {
        this(alias, ALTER_JOB_SCHEDULE);
    }

    private AlterJobSchedule(Name alias, Table<AlterJobScheduleRecord> aliased) {
        this(alias, aliased, new Field[6]);
    }

    private AlterJobSchedule(Name alias, Table<AlterJobScheduleRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> AlterJobSchedule(Table<O> child, ForeignKey<O, AlterJobScheduleRecord> key) {
        super(child, key, ALTER_JOB_SCHEDULE);
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
    public AlterJobSchedule as(String alias) {
        return new AlterJobSchedule(DSL.name(alias), this, parameters);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AlterJobSchedule as(Name alias) {
        return new AlterJobSchedule(alias, this, parameters);
    }

    /**
     * Rename this table
     */
    @Override
    public AlterJobSchedule rename(String name) {
        return new AlterJobSchedule(DSL.name(name), null, parameters);
    }

    /**
     * Rename this table
     */
    @Override
    public AlterJobSchedule rename(Name name) {
        return new AlterJobSchedule(name, null, parameters);
    }

    /**
     * Call this table-valued function
     */
    public AlterJobSchedule call(Integer jobId, Object scheduleInterval, Object maxRuntime, Integer maxRetries, Object retryPeriod, Boolean ifExists) {
        return new AlterJobSchedule(DSL.name(getName()), null, new Field[] { 
              DSL.val(jobId, org.jooq.impl.SQLDataType.INTEGER)
            , DSL.val(scheduleInterval, org.jooq.impl.DefaultDataType.getDefaultDataType("\"pg_catalog\".\"interval\"").defaultValue(org.jooq.impl.DSL.field("NULL::interval", org.jooq.impl.SQLDataType.OTHER)))
            , DSL.val(maxRuntime, org.jooq.impl.DefaultDataType.getDefaultDataType("\"pg_catalog\".\"interval\"").defaultValue(org.jooq.impl.DSL.field("NULL::interval", org.jooq.impl.SQLDataType.OTHER)))
            , DSL.val(maxRetries, org.jooq.impl.SQLDataType.INTEGER.defaultValue(org.jooq.impl.DSL.field("NULL::integer", org.jooq.impl.SQLDataType.INTEGER)))
            , DSL.val(retryPeriod, org.jooq.impl.DefaultDataType.getDefaultDataType("\"pg_catalog\".\"interval\"").defaultValue(org.jooq.impl.DSL.field("NULL::interval", org.jooq.impl.SQLDataType.OTHER)))
            , DSL.val(ifExists, org.jooq.impl.SQLDataType.BOOLEAN.defaultValue(org.jooq.impl.DSL.field("false", org.jooq.impl.SQLDataType.BOOLEAN)))
        });
    }

    /**
     * Call this table-valued function
     */
    public AlterJobSchedule call(Field<Integer> jobId, Field<Object> scheduleInterval, Field<Object> maxRuntime, Field<Integer> maxRetries, Field<Object> retryPeriod, Field<Boolean> ifExists) {
        return new AlterJobSchedule(DSL.name(getName()), null, new Field[] { 
              jobId
            , scheduleInterval
            , maxRuntime
            , maxRetries
            , retryPeriod
            , ifExists
        });
    }
}