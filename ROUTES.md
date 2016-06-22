###Routes###

```
// Reroute to app
get '/app',
// User login API to create session
post '/login'
// Serve the authentication template when logged out
get '/login'
// Create a new User
pos '/signup'
// User logout
get '/logout'
// Search for friend by username
get '/friends/:friendName'
// Get friends list
get '/friends/'
// Request new friendship
post '/friendship'
// Update friendship status
put '/friendship'
// Create new event
post '/events'
//get Friend's Events
get '/events/'
//Accept Event
post '/acceptEvent/:id'
//Get single active event
get '/events/:id'
```
