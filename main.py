import requests
from sys import argv
from PIL import Image

template = """
<!DOCTYPE html>
<html>
    <head>
        <title>$TITLE</title>
    </head>
    <body>
        <style>
            div {
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: row;
            }
            p {
                padding: 0;
                margin: 0;
                height: 1px;
                width: 1px;
            }
        </style>
        $BODY
    </body>
</html>
"""
pixel = "<p style='color:rgb({},{},{})'>.</p>"

html_out = ""
IMAGE_NAME = "out.jpg"
HTML_NAME = "out.html"
# download an image
try:
    url = argv[1]
except IndexError:
    print("Please provide an image URl.")
    exit()

try:
    HTML_NAME = argv[2]
except IndexError:
    pass

print(f"Writing to {HTML_NAME}")

response = requests.get(url)
if response.status_code == 200:
    with open(IMAGE_NAME, "wb") as f:
        f.write(response.content)

# parse pixel by pixel and output html
im = Image.open(IMAGE_NAME)
pix = im.load()

for y in range(im.size[1]):
    row = ""
    for x in range(im.size[0]):
        color = pix[x, y]
        row += pixel.format(color[0], color[1], color[2])
    html_out += f"<div>{row}</div>"

# plug-in to template and output to file
with open(HTML_NAME, "w") as f:
    out = template.replace("$TITLE", IMAGE_NAME)
    out = out.replace("$BODY", html_out)
    f.write(out)
