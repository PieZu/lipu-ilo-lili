# import our stuffz
from PIL import ImageFont, ImageDraw, Image # to render characters in custom font
from fontTools.ttLib import TTFont 	# to extract unicode points from font
import cv2 as cv 	# to analyse and compare characters 
import numpy as np 	# to make blank opencv files, and to make the selection of moments simpler bc indices n stuff
import argparse 	# to parse the arguments lol
from bisect import bisect 			# to calculate -f & -l positions
from math import copysign, log10, sqrt# to normalise the moments
import sys

# init variables
def intOrHex(x): return int(x, 0) 
ap = argparse.ArgumentParser()
ap.add_argument("basefont", 				help="path to font to render base (dictionary) glyphs with")
ap.add_argument("-b", "--basesize",			help="size at which to render base glyphs (default: scaled on render width)",		type=int)
ap.add_argument("searchglyph", 				help="code of glyph to search with (e.g. linja-pona's 'li'=58919)", 				type=intOrHex, action='append',)
ap.add_argument("-e", 	"--extra", 			help="additional glyphs to search", 												type=intOrHex, nargs="+", default=[])
ap.add_argument("inputfont", 				help="path to font to render search glyph", 										default="C:/Users/home/Downloads/linja pona 3 OTF.otf", nargs="?")
ap.add_argument("-s", 	"--inputsize",		help="size at which to render search glyph (default: same as base glyph size)",		default=None)
ap.add_argument("-x", 	"--renderwidth",	help="how many pixels wide each icon is (default: 100px)", 							type=int,	default=100)
ap.add_argument("-y", 	"--renderheight", 	help="how many pixels high each icon is (default: same as width)", 					type=int)
ap.add_argument("-d", 	"--displaywidth",	help="how many pixels wide a search result is (default: same as render)",			type=int)
ap.add_argument("-r", 	"--results", 		help="how many of the top search results to display (0=ALL)", 						type=int, 	default=5)
ap.add_argument("-f", 	"--firstcodepoint",	help="filter base to only codepoints after number", 								type=intOrHex, 	action='append')
ap.add_argument("-l", 	"--lastcodepoint",	help="filter base to only codepoints before number", 								type=intOrHex, 	action='append')
ap.add_argument("-m", 	"--moments",		help="list all the HuMoments that will be compared (default: all)",					type=int, 	nargs="+", choices=range(0,7))
ap.add_argument("-A", 	"--ascii", 			help="only selects from ascii codepoints", 											default=0, 	action='store_const', const=1)
ap.add_argument("-T", 	"--text", 			help="dont render the search results just output all as text", 						action="store_true")
ap.add_argument("-N", 	"--normalised", 	help="render search results how the program analyses it",							action="store_true")
args = vars(ap.parse_args())


base_font_path = args["basefont"]
base_font_size = args["basesize"] or int(args["renderwidth"]*0.7)
input_glyphs = args["searchglyph"]+args["extra"]
input_font_path = args["inputfont"]
input_font_size = args["inputsize"] or base_font_size
ascii_only = args["ascii"]
icon_resolution = (args["renderwidth"], args["renderheight"] or args["renderwidth"])
search_resolution = args["displaywidth"] or args["renderwidth"]
search_resolution = (search_resolution, search_resolution)
frame_size = icon_resolution
relevant_moments = np.array(args["moments"] or range(0,7))
text_only = args["text"]
render_results_normalised = args["normalised"]

# init fonts
def normalise_path(font_path):
	font_path = font_path.replace('\\', '/')
	if not "/" in font_path:
		font_path = "C:/Windows/Fonts/"+font_path
		print("Full path not provided, assuming "+font_path)
	return font_path

base_font_path = normalise_path(base_font_path)
base_font = ImageFont.truetype(base_font_path, base_font_size)

input_font_path = normalise_path(input_font_path)
input_font = ImageFont.truetype(input_font_path, input_font_size)

ui_font = ImageFont.load_default()

# extract base glyph codepoints
def extractCodes(font_path, first_filters=None, last_filters=None):
	# load font & tables
	ft_font = TTFont(font_path)
	number_of_tables = len(ft_font["cmap"].tables)

	if ascii_only and number_of_tables == 1 :
		print('Error: font "{}" doesnt distinguish ascii'.format(font_path));
		quit()
	if number_of_tables == 0 : 
		print('Error: could not parse any tables in font "{}"'.format(font_path))
		quit()

	# extract unicode
	supported_unicode = list(ft_font["cmap"].tables[ascii_only].cmap.keys())
	selected_unicode = []

	# do the first&lastcodepoint filtering
	for start_num, end_num in zip(first_filters or [None], last_filters or [None]):
		if not (end_num is None or start_num is None) and start_num > end_num :
			print("Error: {}-{} is an invalid range".format(start_num, end_num))
		if end_num: end = bisect(supported_unicode, end_num)
		else: 		end = len(supported_unicode)

		if start_num: 	start = bisect(supported_unicode, start_num, hi=end)
		else:	 		start = 0
		
		selected_unicode+=supported_unicode[start:end]

	return selected_unicode

base_codes = extractCodes(base_font_path)
number_of_results = args["results"] or len(base_codes)
# render & analyse base glyphs
def calculateHuMoments(img):
	huMoments = cv.HuMoments(cv.moments(normalised(img)))
	# Log scale hu moments
	for i in range(0,7):
		huMoments[i] = -1* (copysign(1.0, huMoments[i])* log10(abs(huMoments[i])))
	return huMoments

def render(code, font, named=False):
	i = Image.new("1", frame_size)
	d = ImageDraw.Draw(i)

	d.text((0, 0), chr(code), font = font, fill=1)

	if named:
		uni_name = "U+{:X}".format(code)
		uni_name_pixel_length = len(uni_name)*6+3
		d.rectangle((0,0,uni_name_pixel_length,10), fill=1)
		d.text((1,0), uni_name, fill=0)

	return i
def normalised(img): 
	return cv.resize(crop(img), icon_resolution)
def crop(img,tolerance=0):
	# crops black padding, taken from https://codereview.stackexchange.com/questions/132914/crop-black-border-of-image-using-numpy
	img = np.array(img, np.uint8)
	border = 3 # try and keep extra border unless it would go outside img bounds
	mask = img>tolerance
	m,n = img.shape
	mask0,mask1 = mask.any(0),mask.any(1)
	col_start,col_end = max(0, mask0.argmax()-border), min(n, n-mask0[::-1].argmax()+border)
	row_start,row_end = max(0, mask1.argmax()-border), min(m, m-mask1[::-1].argmax()+border)
	
	return img[row_start:row_end, col_start:col_end]
def binarised(img):
	gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
	ret,thresh = cv.threshold(gray,127,255,cv.THRESH_BINARY)
	return thresh

# extra fancy progress bar thingo
def update_progress(name, percent):
  total = 20
  completed = int(total*percent)
  incomplete = total-completed
  text = "\r{}... [{}{}] {:2d}%".format(name, "="*completed, " "*incomplete, int(percent*100))
  sys.stdout.write(text)
  sys.stdout.write(" "*20) # clear anything else on the line so we can have different length status names
  sys.stdout.flush()

moments = []
for i, code in enumerate(base_codes):
	update_progress("Rendering Glyphs", i/len(base_codes))
	moments.append( calculateHuMoments(render(code, base_font, icon_resolution)) )
update_progress("Rendered", 1)

for input_glyph in input_glyphs: 
	# analyse input glyph
	input_image = render(input_glyph, input_font, icon_resolution)
	input_moments = calculateHuMoments(input_image)

	# compare input glyph to all base glyphs
	glyph_distances = []
	for j, glyph_moments in enumerate(moments):
		update_progress("Calculating Distances", j/len(base_codes))
		# calculate hoeuajdshvian distance between each moment
		for i in range(0,7):
			glyph_moments[i] = sqrt(abs(glyph_moments[i][0]-input_moments[i][0]))
		# filter out any ones we dont care about because its sometimes more effective
		glyph_moments = np.array(glyph_moments)[relevant_moments]
		# the total distance is the sum of each individual distance
		glyph_distances.append(sum(glyph_moments))
		
	update_progress("Calculated", 1)

	# sort matches
	closest_matches = sorted(zip(glyph_distances, base_codes), key=lambda x: x[0])[0:number_of_results]
	if text_only:
		print([chr(input_glyph)]+["{}: {:.2f}%".format(chr(code), distance[0]) for distance, code in closest_matches])
	else:
		# stitch an image of the closest matches
		def generate_thumbnail(code, font):
			if render_results_normalised:
				img = render(code, font)
				img = normalised(img)
			else:
				img = render(code, font, named=True)
				img = np.array(img, np.uint8)
			return cv.resize(np.array(img)*255, search_resolution)

		results = generate_thumbnail(input_glyph, input_font)
		for distance, code in closest_matches[:number_of_results]:
			icon = generate_thumbnail(code, base_font)
			# calc & display text
			#percent = "{:.2f}".format(100-closeness)
			#cv.putText(img, percent, (55,47), cv.FONT_HERSHEY_SIMPLEX, 2, (150, 150, 150), 4)
			results = cv.hconcat([results, icon])
			
		cv.imshow('closest', results)

		#cv.imshow("testing", np.array(render(84, base_font), np.uint8)*255)
		#cv.imshow("testing2", np.array(render(84, base_font, named=True), np.uint8)*255)

		cv.waitKey(0)
		cv.destroyAllWindows()
