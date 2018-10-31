import glob, os,sys
import multiprocessing as mp

try:
    nproc = int(sys.argv[1])
except:
    print 'failed, did you specify the n of processors'
    sys.exit()


def run(f):
    print 'starting ',f
    os.system('npm start %s'%f.replace('(','\(').replace(')','\)'))
    print 'ending ',f


mp.Pool(nproc).map(run,filter(lambda x: 'ALL' not in x,glob.glob('csv/*.csv')))

print 'done'
