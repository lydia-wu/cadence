print ("Hello World")
import time
from datetime import datetime, timedelta 
import csv
with open('/Users/Hunter/Downloads/TimeSimulator.csv', 'w+', newline = '') as file4:
    DeviceClockfield = csv.writer(file4)
    DeviceClockfield.writerow(['This is a time simulator'])
    seconds = range(1,100)
    
    for x in seconds:
        DeviceClockfield.writerow([datetime.now() + timedelta(seconds=x)])
    
        #print(datetime.now() + timedelta(seconds=x))