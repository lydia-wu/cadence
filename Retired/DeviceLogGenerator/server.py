# last edited by Michael Di Girolamo at 3/11 2:11 PM

import socket

class server:
    def __init__(self, port):
        self.port = port
    
    def start_server(self):
        self.s = socket.socket()
        print ("Socket succesfully created")

        self.s.bind(('', self.port))
        print ("socket binded to %s" %(self.port))

    def stop_server(self):
        print(" Shutting down server")
        self.c.close()

    def send_data(self, message):
        print(message)

        self.s.listen(5)
        print ("Socket is listening")

        while True:
            self.c, addr = self.s.accept() # waits here until client connects
            print ('Got connection from ', addr)
            self.c.send(message.encode("utf-8"))
            break

