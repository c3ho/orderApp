Random readme to fix

PostgreSQL
When running homebrew psql, login to user using the command `psql postgres`:
show databases by using `\l`
show tables by using `\dt`
connect to a database by using `\c <database name>`

Testing on Postman
Check Headers tab, make sure content-type is set to `application/json`
When sending body, send raw with the following:

```
{
    "id": "1G",
    "itemName": "item1"
}
```
