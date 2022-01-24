print ("Hello World")
try: 
    f = open("airlines.csv", encoding = 'utf-8')
    #perform file operations
finally: 
    f.close()

import csv
with open('airtravel.csv', 'w', newline = '') as file:
    writer = csv.writer(file)
    writer.writerow(["Time", "ICCID (SIM ID)", "random field", "connection event", "bytes used"])
    writer.writerow(["Timestamp in GMT", 2222222222, "xyz", "connect", 0])
    