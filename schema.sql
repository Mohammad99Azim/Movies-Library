DROP TABLE IF EXISTS themove;

CREATE TABLE IF NOT EXISTS themove (
    id SERIAL PRIMARY KEY,
    title varchar(255),
    releasedate varchar(255),
    posterpath varchar(255)
);
