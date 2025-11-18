from random import randint

# Generates random palettes data in order to test app's performance

totalPalettes = 1
colorsPerPalette = 50
palettes = []

file = open("./scripts/test.json", "w+")


def randomID(idSize: int = 12) -> str:

    finalID = ""
    chars = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "@",
        "!",
        "#",
        "$",
        "%",
        "&",
        "*",
        "?",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ]

    for i in range(idSize):
        finalID += chars[randint(0, len(chars) - 1)]

    return finalID


def randomColor() -> dict:
    RGB_MAX = 255
    RGB_MIN = 0

    colorID = randomID()
    r = randint(RGB_MIN, RGB_MAX)
    g = randint(RGB_MIN, RGB_MAX)
    b = randint(RGB_MIN, RGB_MAX)
    HEX = "#{:0>2}{:0>2}{:0>2}".format(
        hex(r).replace("0x", ""), hex(g).replace("0x", ""), hex(b).replace("0x", "")
    )

    finalColor = {"id": colorID, "r": r, "g": g, "b": b, "hex": HEX}

    return finalColor


file.write("[\n")

for p in range(totalPalettes):
    paletteName = "Palette {}".format(p + 1)
    paletteID = randomID()
    colors = []
    for c in range(colorsPerPalette):
        color = randomColor()
        color['name'] = 'Color {}'.format(c + 1)
        colors.append(color)

    palette = {
        "name": paletteName,
        "id": paletteID,
        "colors": colors,
    }

    palettes.append(palette)

size = len(palettes)
current = 1

for p in palettes:
    file.write("""{{\n\t"name": "{}",\n\t"id": "{}",\n\t"colors": [\n""".format(p["name"], p["id"])
    )

    colorSize = len(p['colors'])
    currentColor = 1
    
    for c in p['colors']:
        
        if (currentColor == colorSize):
            file.write("""\t\t{{"id": "{}", "r": {}, "g": {}, "b": {}, "hex": "{}", "name": "{}"}}\n""".format(c["id"], c["r"], c["g"], c["b"], c["hex"], c["name"]))
        else:
            file.write("""\t\t{{"id": "{}", "r": {}, "g": {}, "b": {}, "hex": "{}", "name":"{}"}},\n""".format(c["id"], c["r"], c["g"], c["b"], c["hex"], c["name"]))
        
        currentColor += 1
    
    if (current == size):
        file.write("]\n}")
    else:
        file.write("]\n},")
    
    current += 1

file.write("\n]")
file.close()
