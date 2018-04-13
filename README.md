# API

Accepts :
- application/x-www-form-urlencoded
- application/json

Remote test server : `https://morbak.alan-balbo.com`

## Authentication

* Login with `/api/auth/login`
* This should respond with something like :
```javascript
{
    "user": {
        "_id": "5ad0b5f26568137c6c85e228",
        "username": "MonBlaze",
        "creationDate": "2018-04-13T14:07:13.052Z",
        "__v": 0
    },
    "token": "MY_TOKEN"
}
```
* You should save the user somewhere, as well as the token
* **Again, the token should be saved in local storage for auto login**
* The token must be provided in the `Authorization` header of every request to the API, preceded with the `Bearer` keyword;  like so:
```
Authorization: Bearer MY_TOKEN
```

## Routes


| Name | Method | Route | Params |
|--|--|--|--|
| Login | POST|/api/auth/login | `{username: string, password: string} `  |
| Register | POST| /api/auth/register |  `{username: string, password: string} `|
|List Users | GET|/api/users |-
|Get User | GET|/api/users/:id |-
|Update user | PUT|/api/users/:id |  `{username?: string} `
