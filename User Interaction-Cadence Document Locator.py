from time import sleep
import os

name = input("Hello, what is your name? ")
print ("Hello",name,", thank you for choosing the Cadence Data Visualization tool.")
sleep(2)
Response = input("Would you like to import the full list of log data today? Yes/No ")
if Response == "Yes":
    print("Retreiving Data for you,", name)
    sleep(2)
    os.system('/Users/Hunter/Downloads/BatchDelete.py')
    sleep(2)
else:

    print("Sorry")