#!/usr/bin/env python
import argparse 
from fontTools.ttLib import TTFont
from PIL import ImageFont, ImageDraw, Image
import math
import sys
from bisect import bisect

# accept cmd line arguments
ap = argparse.ArgumentParser()
ap.add_argument("font",  				help="path to font to scan")
ap.add_argument("-x",  "--width",	 	help="how many pixels wide each icon is (default: 100px)", 							type=int, default=100)
ap.add_argument("-y",  "--height", 		help="how many pixels high each icon is (default: same as width)", 					type=int, default=None)
ap.add_argument("-s",  "--size", 		help="how large to render the font at (default: scaled on width)", 					type=int, default=None)
ap.add_argument("-f",  "--firstcodepoint",help="filter to only codepoints after number", 									type=int, action='append')
ap.add_argument("-l",  "--lastcodepoint",help="filter to only codepoints before number", 									type=int, action='append')
ap.add_argument("-A",  "--ascii", 		help="only selects from ascii codepoints", 											action='store_true')
args = vars(ap.parse_args())

# init variables
font_size = args["size"] or int(args["width"]*0.7)
icon_size = (args["width"], args["height"] or args["width"])

# format path properly
font_path = args["font"].replace('\\', '/')
if not "/" in font_path:
	font_path = "C:/Windows/Fonts/"+font_path
	print("Full path not provided, assuming "+font_path)

# load in fonttools then find code tables
ft_font = TTFont(font_path)
number_of_tables = len(ft_font["cmap"].tables)
selected_table = int(args["ascii"])
if selected_table >= number_of_tables :
	if selected_table == 0: print("Error: no codepoints detected");
	elif selected_table == 1: print("Error: font doesnt distinguish ascii");
	else: print("Error: invalid codepoint selection")
	quit()

# extract unicode
supported_unicode = list(ft_font["cmap"].tables[selected_table].cmap.keys())
selected_unicode = []

# do the first&lastcodepoint filtering
for start_num, end_num in zip(args["firstcodepoint"] or [None], args["lastcodepoint"] or [None]):
	if not (end_num is None or start_num is None) and start_num > end_num :
		print("Error: {}-{} is an invalid range".format(start_num, end_num))
	if end_num: end = bisect(supported_unicode, end_num)
	else: 		end = len(supported_unicode)

	if start_num: 	start = bisect(supported_unicode, start_num, hi=end)
	else:	  		start = 0
	
	selected_unicode+=supported_unicode[start:end]
	

# load font into PIL so we can render it
pil_font = ImageFont.truetype(font_path, font_size)
pil_ui = ImageFont.load_default()

# extra fancy progress bar thingo
def update_progress(name, percent):
    total = 20
    completed = int(total*percent)+1
    incomplete = total-completed
    text = "\r{}... [{}{}] {:2d}%".format(name, "="*completed, " "*incomplete, int(percent*101))
    sys.stdout.write(text)
    sys.stdout.flush()

# render icons of each supported unicode character
icons = []
for code in selected_unicode:
	# init variables for icon
	img = Image.new("1", icon_size)
	d = ImageDraw.Draw(img)
	uni_name = "U+{:d}".format(code)
	uni_chr = chr(code)
	uni_name_pixel_length = len(uni_name)*6+3
	# render glyph
	d.text((0,0), uni_chr, font=pil_font, fill=1)
	icons.append(img)
	update_progress("Rendering Icons", len(icons)/len(selected_unicode))