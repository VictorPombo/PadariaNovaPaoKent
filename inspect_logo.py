from PIL import Image

try:
    img = Image.open('public/LogoNovaPaoKent.png')
    img = img.convert("RGBA")
    datas = img.getdata()
    
    dark_pixels = 0
    grey_pixels = 0
    salmon_pixels = 0
    
    for r, g, b, a in datas:
        if a > 50:
            if r < 50 and g < 50 and b < 50:
                dark_pixels += 1
            elif abs(r-g) < 20 and abs(r-b) < 20 and r > 50 and r < 200:
                grey_pixels += 1
            elif r > g + 30 and r > b + 30:
                salmon_pixels += 1

    print(f"Dark pixels: {dark_pixels}")
    print(f"Grey pixels: {grey_pixels}")
    print(f"Salmon pixels: {salmon_pixels}")

except Exception as e:
    print("Error:", e)
