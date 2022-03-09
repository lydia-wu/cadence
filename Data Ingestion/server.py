import socket
import sys

s = socket.socket()
print ("Socket succesfully created")

port = 5601
s.bind(('', port))
print ("socket binded to %s" %(port))

s.listen(5)
print ("Socket is listening")

while True:
    c, addr = s.accept()
    print ('Got connection from ', addr)
    message = "Thank you for connecting"
    c.send(message.encode("utf-8"))
    print(" Shutting down server")
    c.close()
    break