#!/usr/bin/env python
import argparse 					# to parse arguments used on command line
from fontTools.ttLib import TTFont 	# to extract unicode points from font
from PIL import ImageFont, ImageDraw, Image # to render glyph from font
import math 						# to sqrt scale the --collagewidth
from sys import stdout 				# to make the progress bar stay a single line 
from bisect import bisect 			# to calculate -f & -l positions

# accept cmd line arguments
ap = argparse.ArgumentParser()
ap.add_argument("font",  				help="path to font to scan")
ap.add_argument("-w",  "--collagewidth",help="how many icons wide the collage is (default: scaled on number of icons)", 	type=int, default=None)
ap.add_argument("-x",  "--width",	 	help="how many pixels wide each icon is (default: 100px)", 							type=int, default=100)
ap.add_argument("-y",  "--height", 		help="how many pixels high each icon is (default: same as width)", 					type=int, default=None)
ap.add_argument("-s",  "--size", 		help="how large to render the font at (default: scaled on width)", 					type=int, default=None)
ap.add_argument("-f",  "--firstcodepoint",help="filter to only codepoints after number", 									type=int, action='append')
ap.add_argument("-l",  "--lastcodepoint",help="filter to only codepoints before number", 									type=int, action='append')
ap.add_argument("-N",  "--nameless",	help="hides names in collage", 														action='store_true')
ap.add_argument("-T",  "--text", 		help="outputs list of supported code points then quits", 							action='store_true')
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
	if not (end_num is None or start_num is None) and start_num > end_num:
		print("Error: {}-{} is an invalid range".format(start_num, end_num))
	if end_num: end = bisect(supported_unicode, end_num)
	else: 		end = len(supported_unicode)

	if start_num: 	start = bisect(supported_unicode, start_num, hi=end)
	else:	  		start = 0
	
	selected_unicode+=supported_unicode[start:end]
	
if args["text"]:
	print(list(selected_unicode))	
	quit()

# load font into PIL so we can render it
pil_font = ImageFont.truetype(font_path, font_size)
pil_ui = ImageFont.load_default()

# extra fancy progress bar thingo
def update_progress(name, percent):
    total = 20
    completed = int(total*percent)+1
    incomplete = total-completed
    text = "\r{}... [{}{}] {:2d}%".format(name, "="*completed, " "*incomplete, int(percent*101))
    stdout.write(text)
    stdout.flush()

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
	if not args["nameless"]:
		# write the U+ code in black with a white background (so it doesnt overlap with glyph)
		d.rectangle((0,0,uni_name_pixel_length,10), fill=1)
		d.text((1,0), uni_name, fill=0)
	icons.append(img)
	update_progress("Rendering Icons", len(icons)/len(selected_unicode))

# make a big image that shows em all
icons_per_row = args["collagewidth"] or math.ceil(math.sqrt(len(icons)*1.5)) or 1
collage_size = (icons_per_row*icon_size[0], 
				(len(icons)//icons_per_row+1)*icon_size[1]) 

collage = Image.new("1", collage_size)
for i, image in enumerate(icons):
	x = i%icons_per_row * icon_size[0]
	y = i//icons_per_row * icon_size[1]
	collage.paste(image, (x,y))
	update_progress("Rendering Collage", i/len(icons))
collage.show()