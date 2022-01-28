import requests
test_file = open('/Users/Hunter/Downloads/myfile.txt', 'r')
test_url = ""
test_response = requests.post(test_url, files = {"form_field_name": test_file})

if test_response.ok:
    print("upload completed successfully.")
    print(test_response.text)
else:
    print("Something went wrong.")