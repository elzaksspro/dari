package com.psddev.dari.db;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.joda.time.DateTime;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;

class MetricAction extends Modification<Object> {

    //private static final Logger LOGGER = LoggerFactory.getLogger(MetricAction.class);

    private transient final Map<String, Metric> recordMetrics = new HashMap<String, Metric>();
    private transient final Map<String, ObjectField> metricFields = new HashMap<String, ObjectField>();
    private transient final Map<String, Map<String, Double>> metricValueCache = new HashMap<String, Map<String, Double>>();
    private transient final Map<String, Map<String, Map<String, Double>>> metricValuesCache = new HashMap<String, Map<String, Map<String, Double>>>();
    private transient final Map<String, Map<String, Map<DateTime, Double>>> metricTimelineCache = new HashMap<String, Map<String, Map<DateTime, Double>>>();

    private ObjectField findMetricField(String internalName) {
        ObjectType recordType = ObjectType.getInstance(getOriginalObject().getClass());
        if (internalName == null) {
            for (ObjectField objectField : recordType.getFields()) {
                if (objectField.as(Metric.FieldData.class).isMetricValue()) {
                    return objectField;
                }
            }
        } else {
            ObjectField objectField = getState().getDatabase().getEnvironment().getField(internalName);

            if (objectField == null) {
                objectField = recordType.getField(internalName);
            }

            if (objectField != null && objectField.as(Metric.FieldData.class).isMetricValue()) {
                return objectField;
            }
        }
        throw new RuntimeException("At least one numeric field must be marked as @MetricValue");
    }

    private Map<String, Double> getMetricCache(String internalName) {
        if (! metricValueCache.containsKey(internalName)) {
            metricValueCache.put(internalName, new HashMap<String, Double>());
        }
        return metricValueCache.get(internalName);
    }

    private Map<String, Map<String, Double>> getMetricValuesCache(String internalName) {
        if (! metricValuesCache.containsKey(internalName)) {
            metricValuesCache.put(internalName, new HashMap<String, Map<String, Double>>());
        }
        return metricValuesCache.get(internalName);
    }

    private Map<String, Map<DateTime, Double>> getMetricTimelineCache(String internalName) {
        if (! metricTimelineCache.containsKey(internalName)) {
            metricTimelineCache.put(internalName, new HashMap<String, Map<DateTime, Double>>());
        }
        return metricTimelineCache.get(internalName);
    }

    private void clearCaches(String metricFieldInternalName) {
        metricValueCache.remove(metricFieldInternalName);
        metricTimelineCache.remove(metricFieldInternalName);
        metricValuesCache.remove(metricFieldInternalName);
    }

    private ObjectField getMetricField(String internalName) {
        if (!metricFields.containsKey(internalName)) {
            metricFields.put(internalName, findMetricField(internalName));
        }
        return metricFields.get(internalName);
    }

    // Explicit dimension
    public void incrementDimensionMetric(String metricFieldInternalName, String dimensionValue, double amount) {
        incrementDimensionMetric(metricFieldInternalName, dimensionValue, amount, null);
    }

    // Explicit dimension
    public void incrementDimensionMetric(String metricFieldInternalName, String dimensionValue, double amount, Long eventDateMillis) {
        try {
            clearCaches(metricFieldInternalName);
            getMetricObject(metricFieldInternalName).setEventDate(eventDateMillis);
            getMetricObject(metricFieldInternalName).incrementMetric(dimensionValue, amount);
        } catch (SQLException e) {
            throw new DatabaseException(getMetricObject(metricFieldInternalName).getDatabase(), "Error in Metric.incrementMetric() : " + e.getLocalizedMessage());
        }
    }

    // Explicit dimension
    public void setDimensionMetric(String metricFieldInternalName, String dimensionValue, double c) {
        try {
            clearCaches(metricFieldInternalName);
            getMetricObject(metricFieldInternalName).setMetric(dimensionValue, c);
        } catch (SQLException e) {
            throw new DatabaseException(getMetricObject(metricFieldInternalName).getDatabase(), "Error in Metric.setMetric() : " + e.getLocalizedMessage());
        }
    }

    // All dimensions
    public void deleteMetric(String metricFieldInternalName) {
        try {
            getMetricObject(metricFieldInternalName).deleteMetric();
        } catch (SQLException e) {
            throw new DatabaseException(getMetricObject(null).getDatabase(), "Error in Metric.deleteMetric() : " + e.getLocalizedMessage());
        }
    }

    //////////////////////////////////////////////////

    // Explicit dimension
    public double getDimensionMetric(String metricFieldInternalName, String dimensionValue) {
        return getDimensionMetricOverDateRange(metricFieldInternalName, dimensionValue, null, null);
    }

    // Explicit dimension
    public double getDimensionMetricOverDateRange(String metricFieldInternalName, String dimensionValue, Long startTimestamp, Long endTimestamp) {
        final String cacheKey = String.valueOf(dimensionValue) + ":" + String.valueOf(startTimestamp) + ":" + String.valueOf(endTimestamp);
        if (! getMetricCache(metricFieldInternalName).containsKey(cacheKey)) {
            try {
                Metric cr = getMetricObject(metricFieldInternalName);
                cr.setQueryDateRange(startTimestamp, endTimestamp);
                Double metricValue = cr.getMetric(dimensionValue);
                if (metricValue == null) {
                    getMetricCache(metricFieldInternalName).put(cacheKey, 0.0d);
                } else {
                    getMetricCache(metricFieldInternalName).put(cacheKey, metricValue);
                }
            } catch (SQLException e) {
                throw new DatabaseException(getMetricObject(metricFieldInternalName).getDatabase(), "Error in Metric.getMetric() : " + e.getLocalizedMessage());
            }
        }
        return getMetricCache(metricFieldInternalName).get(cacheKey);
    }

    // Explicit dimension
    public Map<DateTime, Double> getDimensionMetricTimeline(String metricFieldInternalName, String dimensionValue) {
        return getDimensionMetricTimelineOverDateRange(metricFieldInternalName, dimensionValue, null, null, null);
    }

    public Map<DateTime, Double> getDimensionMetricTimeline(String metricFieldInternalName, String dimensionValue, MetricInterval metricInterval) {
        return getDimensionMetricTimelineOverDateRange(metricFieldInternalName, dimensionValue, metricInterval, null, null);
    }

    public Map<DateTime, Double> getDimensionMetricTimelineOverDateRange(String metricFieldInternalName, String dimensionValue, Long startTimestamp, Long endTimestamp) {
        return getDimensionMetricTimelineOverDateRange(metricFieldInternalName, dimensionValue, null, startTimestamp, endTimestamp);
    }

    public Map<DateTime, Double> getDimensionMetricTimelineOverDateRange(String metricFieldInternalName, String dimensionValue, MetricInterval metricInterval, Long startTimestamp, Long endTimestamp) {
        final String cacheKey = String.valueOf(dimensionValue)+":"+String.valueOf(startTimestamp) + ":" + String.valueOf(endTimestamp) + ":" + ( metricInterval == null ? "default" : metricInterval.getClass().getName());
        if (! getMetricTimelineCache(metricFieldInternalName).containsKey(cacheKey)) {
            try {
                Metric cr = getMetricObject(metricFieldInternalName);
                cr.setQueryDateRange(startTimestamp, endTimestamp);
                Map<DateTime, Double> metricTimeline = cr.getMetricTimeline(dimensionValue, metricInterval);
                if (metricTimeline == null) {
                    getMetricTimelineCache(metricFieldInternalName).put(cacheKey, new HashMap<DateTime, Double>());
                } else {
                    getMetricTimelineCache(metricFieldInternalName).put(cacheKey, metricTimeline);
                }
            } catch (SQLException e) {
                throw new DatabaseException(getMetricObject(metricFieldInternalName).getDatabase(), "Error in Metric.getMetricTimeline() : " + e.getLocalizedMessage());
            }
        }
        return getMetricTimelineCache(metricFieldInternalName).get(cacheKey);
    }

    // Sum of all dimensions
    public double getMetricSum(String metricFieldInternalName) {
        return getMetricSumOverDateRange(metricFieldInternalName, null, null);
    }

    // Sum of all dimensions
    public double getMetricSumOverDateRange(String metricFieldInternalName, Long startTimestamp, Long endTimestamp) {
        final String cacheKey = "sum:"+String.valueOf(startTimestamp) + ":" + String.valueOf(endTimestamp);
        if (! getMetricCache(metricFieldInternalName).containsKey(cacheKey)) {
            try {
                Metric cr = getMetricObject(metricFieldInternalName);
                cr.setQueryDateRange(startTimestamp, endTimestamp);
                Double metricValue = cr.getMetricSum();
                if (metricValue == null) {
                    getMetricCache(metricFieldInternalName).put(cacheKey, 0.0d);
                } else {
                    getMetricCache(metricFieldInternalName).put(cacheKey, metricValue);
                }
            } catch (SQLException e) {
                throw new DatabaseException(getMetricObject(metricFieldInternalName).getDatabase(), "Error in Metric.getMetric() : " + e.getLocalizedMessage());
            }
        }
        return getMetricCache(metricFieldInternalName).get(cacheKey);
    }

    // All dimensions
    public Map<String, Double> getMetricValues(String metricFieldInternalName) {
        return getMetricValuesOverDateRange(metricFieldInternalName, null, null);
    }

    // All dimensions
    public Map<String, Double> getMetricValuesOverDateRange(String metricFieldInternalName, Long startTimestamp, Long endTimestamp) {
        final String cacheKey = String.valueOf(startTimestamp) + ":" + String.valueOf(endTimestamp);
        if (! getMetricValuesCache(metricFieldInternalName).containsKey(cacheKey)) {
            try {
                Metric cr = getMetricObject(metricFieldInternalName);
                cr.setQueryDateRange(startTimestamp, endTimestamp);
                Map<String, Double> metricValues = cr.getMetricValues();
                if (metricValues == null) {
                    getMetricValuesCache(metricFieldInternalName).put(cacheKey, new HashMap<String, Double>());
                } else {
                    getMetricValuesCache(metricFieldInternalName).put(cacheKey, metricValues);
                }
            } catch (SQLException e) {
                throw new DatabaseException(getMetricObject(metricFieldInternalName).getDatabase(), "Error in Metric.getMetric() : " + e.getLocalizedMessage());
            }
        }
        return getMetricValuesCache(metricFieldInternalName).get(cacheKey);
    }

    //////////////////////////////////////////////////

    private Metric getMetricObject(String metricFieldInternalName) {
        // if metricFieldInternalName is null, it will return the *first* @MetricValue in the type

        if (! recordMetrics.containsKey(metricFieldInternalName)) {
            ObjectField metricField = getMetricField(metricFieldInternalName);
            Metric recordMetric = new Metric(this, metricField.getUniqueName());
            recordMetric.setEventDateProcessor(metricField.as(Metric.FieldData.class).getEventDateProcessor());
            recordMetrics.put(metricFieldInternalName, recordMetric);
        }

        return recordMetrics.get(metricFieldInternalName);
    }

    public static UUID getDimensionId(String dimensionValue) {
        try {
            return Metric.getDimensionIdByValue(dimensionValue);
        } catch (SQLException e) {
            throw new DatabaseException(Database.Static.getFirst(SqlDatabase.class), "Error in Metric.getDimensionIdByValue() : " + e.getLocalizedMessage());
        }
    }

}
