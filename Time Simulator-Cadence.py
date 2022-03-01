print ("Hello World")
import time
from datetime import datetime, timedelta 
import csv
with open('/Users/tsuru/OneDrive/Desktop/TimeSimulator.log', 'w+', newline = '') as file4:
    DeviceClockfield = csv.writer(file4)
    DeviceClockfield.writerow(['This is a time simulator'])
    seconds = range(1,100)
    
    for x in seconds:
        DeviceClockfield.writerow([datetime.now() + timedelta(seconds=x), "Sending Hello World"])
    
        #print(datetime.now() + timedelta(seconds=x))
        