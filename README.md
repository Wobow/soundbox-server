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
|Create lobby | POST|/api/lobbies |  `{name: string} `
|List lobbies | GET|/api/lobbies |  `{limit?: number, offset?: number}`
|Get lobby | GET|/api/lobbies/:id | 
|Get lobby members | GET|/api/lobbies/:id/members | 
|Get lobby games | GET|/api/lobbies/:id/games | 
|Delete lobby | DELETE|/api/lobbies/:id | 
|List Games | GET|/api/games |  `{limit?: number, offset?: number}`
|Get Game | GET|/api/games/:id | 


# Types de websocket

## Websocket d'un user

Elle te push les événements suivants :
- Mise à jour du profil
- Tu as rejoins une room
- Tu as quitté une room
- Tu as été kick d'une room
- Tu as créé une room
- Tu as rejoins une game
- Tu as terminé une game
- Tu as reçu une réponse à une requête

## Websocket d'un lobby :

Push les événements suivants :
- Un joueur a rejoint le lobby
- Un joueur a quitté le lobby
- Un joueur en a invité un autre à jouer
- Un joueur a accepté une invitation
- Une partie vient de commencer
- Une partie vient de se terminer
- Une partie ouverte vient d'être créée (peut être rejointe par n'importe qui)
- Le lobby vient d'être créé
- Le lobby vient d'être détruit

## Websocket d'une game
- La game vient d'être créée
- Un joueur a rejoint la game
- Un joueur a quitté la game
- Un spectateur a rejoint la partie
- Un spectateur est parti
- Un joueur vient de jouer un coup
- La partie est terminée
- Une nouvelle partie vient d'être lancée
- La game a été détruite

# Les Requests

## Types de request 

`joinLobby` : Le user veut rejoindre un lobby
`joinGame` : Le user veut rejoindre une game
`invitePlayer` : Le user veut inviter un autre user à jouer
`createGame`: Le user veut créer une partie ouverte

## Format de la request 

### Envoyer la requête
Fair un appel sur `POST /request` avec le body suivant : 
```javascript
{
  type: 'joinLobby' | 'joinGame' | 'invitePlayer' | 'createGame',
  accessResource: "LobbyId"
}
```
Le call renvoie la request créée (avec son id)

### Recevoir la réponse

Dans la **websocket de ton user** tu vas recevoir la réponse à la Request quand elle sera traitée (y'a une queue côté serveur)
- Soit elle a un `status: 'rejected'` et du coup tu peux afficher un message d'erreur comme quoi la requête associé à fail
- Soit elle a un `status: 'ok'` et tu peux interpréter le message et rejoindre le Lobby

Une reponse ressemble à ça :
```javascript
{
  request: Request // La request associée,
  message: '', // Un message explicite sur la response
  statusCode: 0, // Le code de retour normalisé de la response
  status: 'rejected' || 'ok' || 'aborted', // Le statut clair de la response
  resourceLink: '' // Un lien vers la resource associée
}
```

(je documenterai les codes de retour sur le fil)

En gros, si dans tes sockets tu reçois une requête de type 'joinLobby' avec le statut 'ok', ça veut dire que tu as rejoins un lobby.
Donc si tu fais 

- GET /lobbies/{LobbyId}
Tu vas voir que tu es dans la liste des users du lobby, et quand tu feras le get, ça va te renvoyer un lien vers la websocket du lobby


