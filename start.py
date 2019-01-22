import glob, os,sys
import multiprocessing as mp

try:
    nproc = int(sys.argv[1])
except:
    print( 'failed, did you specify the n of processors')
    sys.exit()


def run(f):
    print( 'starting ', f )
    os.system('npm start %s'%f.replace('(','\(').replace(')','\)'))
    print( 'ending ', f )

def single(f):
    print( 'starting ', f )
    os.system('electron single.js %s'%f.replace('(','\(').replace(')','\)'))
    print( 'ending ', f )

try:
    sys.argv[2]
    print( 'single runs')
    mp.Pool(nproc).map(single,filter(lambda x: 'ALL' not in x,glob.glob('dot_files/*.dot')))

except:
    print( 'composite runs' )
    mp.Pool(nproc).map(run,filter(lambda x: 'ALL' not in x,glob.glob('csv/*.csv')))

print( 'done' )
