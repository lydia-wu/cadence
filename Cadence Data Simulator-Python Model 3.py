import requests
#test_file = open('/Users/Hunter/Downloads/myfile.txt', 'r')
#test_response = requests.post(test_url, files = {"form_field_name": test_file})

#if test_response.ok:
#    print("upload completed successfully.")
#    print(test_response.text)
#else:
#    print("Something went wrong.")
import time
import pandas
import csv
from datetime import date

with open('/Users/Hunter/Downloads/Source xx.csv', 'w+', newline = '') as file:
    writer = csv.writer(file)
    writer.writerow(["tomorrow2",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow2",  "A000002", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow3",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow4",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow5",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow6",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow7",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow8",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow9",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow10",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow11",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow12",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow13",  "A000001", "Received File from HelloWorld", ])
    writer.writerow(["tomorrow14",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow15",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow16",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow17",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow18",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow19",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow20",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow21",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow22",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow23",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow24",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow25",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow26",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow27",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow28",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow29",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow30",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow31",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow32",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow33",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow34",  "A000001", "Received File from HelloWorld",])
    writer.writerow(["tomorrow35",  "A000001", "Received File from HelloWorld",])

df = pandas.read_csv("/Users/Hunter/Downloads/Source xx.csv",
index_col='NodeID', 
header=0,
names=['Time', 'NodeID', 'Input from Device'])
df.to_csv('/Users/Hunter/Downloads/Source 3.csv')