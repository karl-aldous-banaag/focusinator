import re

with open("edit.txt") as f:
    html_text = f.read()
    print(re.findall("href=\"(.*?)\"", html_text))

# with open("edit.txt") as f:
#     print(f.readlines())