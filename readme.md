Working URL:
https://tic-tac-toe-async.netlify.app/ frontend on netlify
backend on render

To run the game just:
Login or Register
Make sure that the person with whom you want to play the game has registered
Enter the Email of person you want to play with using which they registered in the game.
Play X and O, at anypoint a player can submit and abondon the game.

Logical Explanation:
Used MERN full stack
for client and server socket was also used as we had to listen for the moves contantly and also create a room and socket is best used for that.
Server contains two data base models,
model 1: User Model: It contains the data related to the user (username,password,games)
model 2: Game Model: It contains the data related to a particular game (game State, turn etc)

Assumptions:
A user will always respond in the game and until then the winner wont get declared.

Problem faced:
During deployment of backend, as a newbie in socket, it was difficult to deploy socket backend but took half an hour to understand how it works and deployed on render
