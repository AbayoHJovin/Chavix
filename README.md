# What is chavix
Chavix is a real-real time chat app which is built in nodejs as backend framework and typescript as frontend framework. It uses websockets for transmission of messages and enables group and direct message conversations. Database schemas are defined in model folder.

# How to run chavix

 After cloning Chavix, You will need install all the packages used. After that, run the frontend and backend.
    1. To run frontend
      > cd view
      >npm run dev
   1.To start the server
   
     >npm run dev (This will start both socketio server and backend server, with database connection in mongodb)

 # How to test chavix in the browser

 First of all you will open frontend application in your browser. Signup or login so that your messages will be saved.
 You can use nav bar to navigate into direct messages and groups messages. For testing reasons, you may need to create another account in order to check how messages are being transmittend 
 from sender to receiver who is specified.

 # What are the missing features in chavix as it is still being developed
  > It doesn't have sstrong authentication and authorization features,
> It few CRUD features,
> it's user interface is not updated
> 
