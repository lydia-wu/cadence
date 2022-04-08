# Author: L. Wu
# Created: 2022-01-21 7PM ET
# Last modified: 2022-01-21 8:30PM ET, L. Wu
# Purpose: create test code for GitHub local repo experimentation

import csv 

import time
import datetime

# Function to convert string to datetime
def convert(date_time):
    format = '%b %d %Y %I:%M%p' # The format
    datetime_str = datetime.datetime.strptime(date_time, format)
   
    return datetime_str

header = ['DeviceID', 'DeviceStatus', 'Timestamp']
data = [
             ['10001', 'strongConnection', convert('Jan 1 2022 10:01AM')],
             ['12345', 'strongConnection', convert('Jan 1 2022 10:08AM')],
             ['12345', 'weakConnection',   convert('Jan 1 2022 11:55AM')],
             ['12345', 'strongConnection', convert('Jan 1 2022 12:34PM')],
             ['12345', 'strongConnection', convert('Jan 1 2022 12:35PM')],
             ['10001', 'noConnection',     convert('Jan 1 2022 12:48PM')]
        ]

with open('HuntersData_001.csv', 'w', encoding='UTF8') as f:
    writer = csv.writer(f)

    # write the header
    writer.writerow(header)

    # write the data
    writer.writerow(data)

