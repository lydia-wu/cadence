# imports
import socket
import sys
from datetime import datetime

# Create a socket
s = socket.socket()
print("client socket created")

# define the port to connect to (make sure it is the same as the server's defined port)
port = 5601

# connect to the server through the defined port
s.connect(('127.0.0.1', port)) # 127.0.0.1 is localhost

# receive the data from the server
data = s.recv(1024) # 1024 defines the max amount of data to be received at once
print (data.decode()) # decode the data back into a string format

# write the data to a file at a defined filepath location
with open('logs/DeviceLog_' + datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log','w+') as file:
    file.write(data.decode())

# close the socket
print ("Closing socket")
s.close()
