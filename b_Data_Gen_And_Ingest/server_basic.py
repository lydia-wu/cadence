# imports
import socket
import sys
from datetime import datetime

# define the message to be sent
message = "Hello World from server"
print(message)
# create the socket
s = socket.socket()
print ("Socket succesfully created")

# define the port (make sure it is the same as the client's port)
port = 5601
s.bind(('', port))
print ("socket binded to %s" %(port))

# listen on the port and queue up to 5 requests
s.listen(5)
print ("Socket is listening")

while True:
    c, addr = s.accept() # waits here until client connects
    print ('Got connection from ', addr)
    c.send(message.encode("utf-8")) #send the defined message to the client

    # close the socket
    print(" Shutting down server")
    c.close()
    break