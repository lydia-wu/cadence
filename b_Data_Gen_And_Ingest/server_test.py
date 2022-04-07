# last edited by Michael Di Girolamo at 3/30/22 1:45 PM

import time
from server import *

iterations = 23
count = 1

x = server(5601)    # parameter: port number
x.start_server(5)   # parameter: time before timeout

y = server(5602)
y.start_server(5)

while count <= iterations:
    x.send_data(f"data test {count} D1")
    y.send_data(f"data test {count} D2")
    count = count + 1
    time.sleep(0.5) #used for testing purposes - logging heartbeats etc.
x.stop_server()
