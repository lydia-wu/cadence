print ("Generating Simulated Data")

import csv
import time
import os
# from time import time, sleep
from datetime import datetime, timedelta

# index = 
# for i in range(10):
#     with open('DeviceLog{}.log', 'w+', newline = '' ) as file:
#         DeviceLog = csv.writer(file(i))
#         DeviceLog.writerow(['Beginning of Device Log'])

# print("Finished")
        
# with open('/Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator/DeviceLogA1.log', 'w+', newline = '') as file1:
# DeviceLogA1 = csv.writer(file1)
# DeviceLogA1.writerow(['Beginning of Device 1 Log'])

count = 0
while count < 10:
    count = count + 1
    with open('/Users/tsuru/OneDrive/Documents/DeviceLogA1_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file1:
        DeviceLogA1 = csv.writer(file1)
        DeviceLogA1.writerow(['Beginning of Device 1 Log'])
        time.sleep(5)

print("Complete")
