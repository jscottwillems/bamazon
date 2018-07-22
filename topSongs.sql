CREATE DATABASE IF NOT EXISTS top_songsDB;

USE top_songsDB;

CREATE TABLE IF NOT EXISTS top5000 (
	id INT NOT NULL
    , artist VARCHAR(50) NOT NULL
	, name VARCHAR(50) NOT NULL
    , year INT(4) NOT NULL
    , usrank DECIMAL(10, 10)
    , ukrank DECIMAL(10, 10)
    , aurank DECIMAL(10, 10)
    , afrank DECIMAL(10, 10)
    , otherrank DECIMAL(10, 10)
    , PRIMARY KEY (id)
);

