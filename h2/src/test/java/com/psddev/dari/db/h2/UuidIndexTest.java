package com.psddev.dari.db.h2;

import org.junit.Test;

import java.util.UUID;

public class UuidIndexTest extends AbstractIndexTest<UuidModel, UUID> {

    @Override
    protected Class<UuidModel> modelClass() {
        return UuidModel .class;
    }

    @Override
    protected UUID value(int index) {
        return new UUID(0L, 41L * index);
    }

    @Override
    @Test(expected = IllegalArgumentException.class)
    public void containsNull() {
        createCompareTestModels();
        query().and("one contains ?", (Object) null).count();
    }

    @Override
    @Test(expected = IllegalArgumentException.class)
    public void startsWithNull() {
        createCompareTestModels();
        query().and("one startsWith ?", (Object) null).count();
    }
}
