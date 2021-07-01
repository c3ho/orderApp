DROP TABLE IF EXISTS menu;
DROP TABLE IF EXISTS users;

CREATE TABLE menu(
    id varchar(4) PRIMARY KEY,
    name varchar(50),
    chinese varchar(50),
    price numeric(5,2),
    category varchar(50),
    enabled boolean
)

CREATE TABLE users(
    id varchar PRIMARY KEY,
    password varchar not null,
    account varchar not null,
)