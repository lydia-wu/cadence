# Hunter Alloway
#Cadence-Data Simulator
# Created On: 2022-01-24 14:31:46.415580

print ("Hello World")
try: 
    f = open("airlines.csv", encoding = 'utf-8')
    #perform file operations
finally: 
    f.close()

import csv

from datetime import datetime
now = datetime.now()
print( now)
print('Type:', type(now))

with open('airtravel.csv', '', newline = '') as file:
    writer = csv.writer(file)
    writer.writerow(["Time", "ICCID (SIM ID)", "NodeID", "connection event", "bytes used"])
    writer.writerow(["Timestamp in GMT", 1111111111, "A000001", "Connect", "0-bytes"])
    writer.writerow(["Timestamp in GMT", 2222222222, "A000002", "Connect", "0-bytes"])
    writer.writerow(["Timestamp in GMT", 1111111111, "A000001", "Disconnect", "2000-bytes"])
    writer.writerow(["Timestamp in GMT", 2222222222, "A000002", "Disconnect", "2000-bytes"])