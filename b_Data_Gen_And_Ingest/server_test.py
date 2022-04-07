# last edited by Michael Di Girolamo at 4/7/22 8:00 PM

import time
from server import *

iterations = 23
count = 1
timeout_period = 10

d1 = server(5601)                   # parameter: port number
d1.start_server(timeout_period)     # parameter: time before timeout

d2 = server(5602)
d2.start_server(timeout_period)

d3 = server(5603)
d3.start_server(timeout_period)

d4 = server(5604)
d4.start_server(timeout_period)

d5 = server(5605)
d5.start_server(timeout_period)

while count <= iterations:
    d1.send_data(f"data test {count} Device 1")
    d2.send_data(f"data test {count} Device 2")
    d3.send_data(f"data test {count} Device 3")
    d4.send_data(f"data test {count} Device 4")
    d5.send_data(f"data test {count} Device 5")
    count = count + 1
    time.sleep(0.5) #used for testing purposes (logging heartbeats etc.)
d1.stop_server()
d2.stop_server()
d3.stop_server()
d4.stop_server()
d5.stop_server()
