# last edited by Michael Di Girolamo at 3/11 2:15 PM

import time
from server import *
import csv
import schedule

iterations = 31
count = 1

x = server(5601)
x.start_server()

while count <= iterations:
    x.send_data(f"data test {count}")
    count = count + 1
    time.sleep(1)
x.stop_server()
