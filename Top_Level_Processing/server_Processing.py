# last edited by Michael Di Girolamo at 3/29/22 8:45 PM
# last edited by Lydia Wu at 3/30/2022 11:22 PM

import socket

class server:
    def __init__(self, port):
        self.port = port
    
    def start_server(self, timeout):
        self.s = socket.socket()
        print ("Socket succesfully created")
        self.s.settimeout(timeout) # use select statements in future implementation?

        self.s.bind(('', self.port))
        print ("socket binded to %s" %(self.port))

    def stop_server(self):
        print("Shutting down server")
        self.s.close() # was "c", changed to "s"

    def send_data(self, message):
        print(message)

        self.s.listen(5)
        print ("Socket is listening")

        while True:
            try:
                print("waiting for connection...")
                self.c, addr = self.s.accept() # waits here until client connects
                print ('Got connection from ', addr)
                self.c.send(message.encode("utf-8"))
                break
            except TimeoutError:
                print("Timeout")
                #quit()
                #continue
                break
            except Exception as e:
                    print("An unexpected error occured")
                    print(e)
                    quit()

