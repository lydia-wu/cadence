import socket
import sys

s = socket.socket()
print("client socket created")

port = 5601
s.connect(('127.0.0.1', port))

print (s.recv(1024))

print ("Closing socket")
s.close()