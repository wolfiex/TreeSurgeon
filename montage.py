import sys,os,glob

#dot
dot = glob.glob('./pdfs/dot_files/*')
dot = dot[0:int(len(dot)**.5)**2]

cmd = 'montage '+' '.join(dot)+' -quality 100  -density 300 -geometry 1200x1200+0+0 dotmerge.pdf'
cmd = cmd.replace('(','\(').replace(')','\)')
print (cmd)
print os.popen(cmd).read()


#comp
comp = glob.glob('./pdfs/*_white.pdf')
comp = comp[:10]#][0:int(len(comp)**.5)**2]
#*0.7 ratio
cmd = 'montage '+' '.join(comp)+' -quality 100 -density 300 -geometry 1400x2000+0+0 -tile 5x2 compmerge.pdf'
cmd = cmd.replace('(','\(').replace(')','\)')
print (cmd)
print os.popen(cmd).read()
