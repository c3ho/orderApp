DROP TABLE IF EXISTS menu;

CREATE TABLE menu(
    id varchar(4) PRIMARY KEY,
    name varchar(50),
    chinese varchar(50),
    price numeric(5,2),
    category varchar(50),
    enabled boolean
)