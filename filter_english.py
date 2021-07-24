# filter out english text from merged file
import argparse, re

parser = argparse.ArgumentParser(description='Clicky Stats Daemon')
parser.add_argument('-v', '--verbose', default=False, action='store_true', help='Verbose')
parser.add_argument('-links', default=False, action='store_true', help='Extract links')
parser.add_argument('-lang',help="Language")
parser.add_argument('infile',help="Input file")
args = parser.parse_args()


links = set()

with open(args.infile,'r') as ifile:
    for line in ifile:
        if re.search('^Question',line):
            continue
        if args.lang:
            if not re.search('ca\.gov/%s/' % (args.lang),line):
                continue
        else:
            if re.search('ca\.gov/(es|tl|ko|jp|vi|ar|zh-hans|zh-hant)/',line):
                continue
        toks = line.split("\t")
        if len(toks) > 0:
            if args.links:
                if toks[2] != 'Editorial':
                    links.add(toks[2])
            else:
                print(toks[0],toks[2])

if args.links:
    for l in sorted(list(links)):
        print(l)