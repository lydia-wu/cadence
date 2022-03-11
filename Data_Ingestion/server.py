#string data
#same exact process as simulator, but not a file
#send the deviceLog data
#retire our current deviceLog.log file

import socket
import sys
#from timer import Timer
from datetime import datetime

#t = Timer()
#t.start()
#t.stop()

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

