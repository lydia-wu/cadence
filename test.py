print ("Generating Simulated Data")

import csv
import time
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

with open('/Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator/DeviceLogA1'+ format(time.strftime('%Y%m%d%H%M%S')) + '.log', 'w+', newline = '') as file1:
    DeviceLogA1 = csv.writer(file1)
    DeviceLogA1.writerow(['Beginning of Device 1 Log'])

print("Complete")