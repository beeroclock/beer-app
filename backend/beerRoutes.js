// Reroute to app
get '/app',
// User login API to create session
post '/login'
body:  {
    "username": "a",
    "password": "a"
  }
// Serve the authentication template when logged out
get '/login'
// Create a new User
post '/signup'
body: {
  "username": "5",
  "password": "a",
  "email": "5@1.com"
}
// User logout
get '/logout'
//Get all user ids and usernames in DB
get 'allUsers'
// Search for friend by username
get '/friends/:friendName'
// Get friends list
get '/friends'
// Request new friendship
post '/friendship'
body: {
 "friendId": 17
}
// Update friendship status
put '/friendship'
body: {
  "friendId": 666
}
// Create new event
post '/events'
body: {
  "ownerLat": 33.3451,
  "ownerLong": -128.1443
}
//get Friend's Events
get '/events/'
//Accept Event
post '/acceptEvent/:id'
body: {
  "eventId": 1,
  "acceptedLat": 34.34,
  "acceptedLong": -118.132
}
//Get single active event
get '/events/:id'
// Lock event so users who join cannot update the central location
put '/lockEvent/:id'
