# import our stuffz
from PIL import ImageFont, ImageDraw, Image # to render characters in custom font
import cv2 as cv 	# to analyse and compare characters 
import numpy as np 	# to make blank opencv files, could probably be replaced but i think cv2 depends on it anyway 
import argparse 	# to parse the arguments
import ast 			# to parse the size arguments as tuples

# get image to search with as argument
ap = argparse.ArgumentParser()
ap.add_argument("image", nargs = "?",
	help="path to image used as search")
ap.add_argument("-I", "--invert", action='store_true',
	help="inverts input image")
ap.add_argument("characters", nargs = "*", default=("ᑐ", "ᐳ", "ᓄ", "ᐯ", "ᑭ", "ᑌ", "w"),
	help="what characters to use as a dictionary to search through")
ap.add_argument("-f", "--font", default="gadugi.ttf",
	help="font used to render characters")
ap.add_argument("-s", "--size", type=ast.literal_eval, default= (50,50),
	help="dimensions to normalise images to")
ap.add_argument("-r", "--results", type=int, default=5,
	help="max number of results to display")
ap.add_argument("-d", "--displaysize", type=ast.literal_eval, default = (150,150),
	help="dimensions to display images at")
ap.add_argument("-m", "--storagemethod", type=int, default = cv.CHAIN_APPROX_TC89_KCOS, choices=range(1,6),
	help="method used to store/compress contours")
ap.add_argument("-c", "--comparemethod", type=int, default=3, choices=range(1,4),
	help="method used to compare contours")
args = vars(ap.parse_args())

# init what characters we wanna generate, what font we using, and configured variables
characters = args["characters"]
font = ImageFont.truetype(args["font"], 200)
number_of_results = args["results"] or len(characters)
search_resolution = args["displaysize"]


# make a blank image that we will stitch all out images on
basecollage = np.zeros((100,0,3), dtype = 'uint8')
vectors = []
images = []

def binarised(img):
	gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
	ret,thresh = cv.threshold(gray,127,255,cv.THRESH_BINARY)
	return thresh

def calculateContours(img):
	bw = normalised(img)
	contours, heirarchy = cv.findContours(image = bw, mode = cv.RETR_TREE, method = args["storagemethod"])
	img = cv.drawContours(img, contours, -1, (0, 0, 255), 3)
	return contours[0], bw	

def normalised(img):
	return cv.resize(crop(binarised(img)), args["size"])

def crop(img,tolerance=0):
    # crops black padding, taken from https://codereview.stackexchange.com/questions/132914/crop-black-border-of-image-using-numpy
    mask = img>tolerance
    m,n = img.shape
    mask0,mask1 = mask.any(0),mask.any(1)
    col_start,col_end = mask0.argmax(),n-mask0[::-1].argmax()
    row_start,row_end = mask1.argmax(),m-mask1[::-1].argmax()
    return img[row_start:row_end,col_start:col_end]


# loop over each character in bank and analyse contours into vectors list
for character in characters:
	# create a blank image (rgb space bc pil doesnt like it not being that)
	img = np.zeros((300,300,3), np.uint8)

	# load image in PIL
	pil_img = Image.fromarray(img)
	pil_draw = ImageDraw.Draw(pil_img)

	# draw character on image
	pil_draw.text((0, 0), character, font = font)
	#img = cv.putText(img, character, (100, 200), font, 5, (255, 255, 255), 5, cv.LINE_AA)
	
	# convert image back to opencv
	img = np.array(pil_img)

	# calculate & append contours
	contours, bw = calculateContours(img)
	vectors.append(contours)
	images.append(img)

	# add to collage
	basecollage = cv.hconcat([basecollage, cv.resize(img, (100,100))])

cv.imshow('dictionary', basecollage)

if args["image"] != None:
	# read provided image
	img = cv.imread(args["image"])
	if img is None:
		err = Exception('could not read file "{}" as image'.format(args["image"]))
		raise err
	if args["invert"]:
		img = (255-img)
	# analyse
	contours, bw = calculateContours(img)
	# show
	cv.imshow('input', bw)

	# calculate matches
	closeness = []
	for character in vectors:
		me = cv.matchShapes(character, contours, args["comparemethod"], 0.0)
		closeness.append(me)

	# sort matches
	closest_matches = sorted(zip(closeness, images), key=lambda x: x[0])
	print(sorted(zip(closeness, characters), key=lambda x: x[0]))

	# stitch an image of the closest matches
	results = np.zeros((0, search_resolution[1], 3), np.uint8)
	for closeness, img in closest_matches[:number_of_results]:
		# calc & display text
		percent = "{:.2f}%".format(100-closeness)
		cv.putText(img, percent, (55,47), cv.FONT_HERSHEY_SIMPLEX, 2, (150, 150, 150), 4)
		results = cv.vconcat([results, cv.resize(img, search_resolution)])
	cv.imshow('closest', results)


cv.waitKey(0)
cv.destroyAllWindows()
