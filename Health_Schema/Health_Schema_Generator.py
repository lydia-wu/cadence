# Python program to write JSON to a file
import json

#input variables
regularTagline = "regular"
irregularTagline = "irregular"
appRegular = 9
appIrregular = 20
networkRegular = 10
networkIrregular = 20
deviceLogRegular = 5
deviceLogIrregular = 20
  
# Data to be written
devices =[
{
  "DataSource": "AppReportValueExpected",
  "if": {
    "Parameter Value": {
      "$lte": appRegular
    }
  },
  "then": {
    "Tagline Parameter": regularTagline
  },
  "else": {
    "if": {
      "Parameter Value": {
        "$gt": appIrregular
      }
    },
    "then": {
      "Tagline Parameter": irregularTagline
    }
  }
},
{
  "DataSource": "NetworkReportValueExpected",
  "if": {
    "Parameter Value": {
      "$lte": networkRegular
    }
  },
  "then": {
    "Tagline Parameter": regularTagline
  },
  "else": {
    "if": {
      "Parameter Value": {
        "$gt": networkIrregular
      }
    },
    "then": {
      "Tagline Parameter": irregularTagline
    }
  }
},
{
  "DataSource": "DeviceLogValueExpected",
  "if": {
    "Parameter Value": {
      "$lte": deviceLogRegular
    }
  },
  "then": {
    "Tagline Parameter": regularTagline
  },
  "else": {
    "if": {
      "Parameter Value": {
        "$gt": deviceLogIrregular
      }
    },
    "then": {
      "Tagline Parameter": irregularTagline
    }
  }
}
]
  
# Serializing json 
json_object = json.dumps(devices, indent = 4)
  
# Writing to sample.json
with open("Health_Schema/HealthSchema.json", "w") as outfile:
    outfile.write(json_object)