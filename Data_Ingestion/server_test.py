# last edited by Michael Di Girolamo at 3/29/22 8:45 PM

import time
from server import *

iterations = 1111
count = 1

x = server(5601)    # parameter: port number
x.start_server(5)   # parameter: time before timeout

while count <= iterations:
    x.send_data(f"data test {count}")
    count = count + 1
    #time.sleep(1) #used for testing purposes - logging heartbeats etc.
x.stop_server()
