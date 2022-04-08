import csv
import pandas as pd
import time
from datetime import datetime

df = pd.read_csv('/Users/tsuru/OneDrive/Desktop/2022/ENGR482/NodeID_SIM_LookUpTable.csv')
# print(type(df['NodeID']))

node = df['NodeID']
print(type(node[0]))
sim = df['SIM ID']
lookup = {}

for x in range(node.size):
    # print(node[x],sim[x])
    lookup[node[x]] = sim[x]

print(lookup['A000001'])
