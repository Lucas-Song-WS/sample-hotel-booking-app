CREATE TABLE test (
    seq BIGSERIAL PRIMARY KEY,
    val VARCHAR(10)
);

INSERT INTO test (val) VALUES ('A');
INSERT INTO test (val) VALUES ('B');
INSERT INTO test (val) VALUES ('C');