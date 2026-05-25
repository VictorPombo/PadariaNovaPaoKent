from PIL import Image

def process_logo():
    try:
        img = Image.open('public/LogoNovaPaoKent.png')
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for r, g, b, a in datas:
            # If the pixel is relatively grayscale (not the salmon color)
            if abs(r - g) < 40 and abs(r - b) < 40 and abs(g - b) < 40:
                avg = (r + g + b) / 3
                # We want to turn this into white text.
                # The darker it was, the more opaque white it should be.
                # The lighter it was, the more transparent white it should be.
                # new_alpha = original_alpha * (255 - avg) / 255
                new_a = int(a * ((255 - avg) / 255.0))
                
                # To boost the brightness a bit, let's make it pure white with the calculated alpha
                newData.append((255, 255, 255, new_a))
            else:
                # Keep salmon colors unchanged
                newData.append((r, g, b, a))

        img.putdata(newData)
        img.save('public/LogoNovaPaoKent_WhiteText.png', "PNG")
        print("Successfully created LogoNovaPaoKent_WhiteText.png")
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    process_logo()
