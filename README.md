# React ionic

Realized by Alexis GANGNEUX and Julien BOISGARD

The back follow this models.
![Alt text](/images/models.png "follow this model")

# lauch back with db.

for launch the back API

```BASH
docker-compose up
```

to initialize the database go to the link: http://localhost:5001/

the docs of back is in swagger on http://localhost:5001/api/docs

# lauch front


before the lauch go to /front/frontApp/src/Global.tsx and just put your BackUrl.

for launch front on website do : 

```
cd /front/frontApp 

npm install

ionic build 

ionic serve 
```

For launch on android mobile do :

```
cd /front/frontApp 

npm install

ionic cap sync android

ionic cap open android 

```
