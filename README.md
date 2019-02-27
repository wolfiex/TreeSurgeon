# Written for usage in:

## "A machine learning based global sea-surface iodide distribution"

#### Authors:
Tomás Sherwen1,2, Rosie J. Chance2, Liselotte Tinel2, Daniel Ellis2, Mat J. Evans1,2, and Lucy J. Carpenter2


1National Centre for Atmospheric Science, University of York, York, YO10 5DD, UK 

2Wolfson Atmospheric Chemistry Laboratories, University of York, York, YO10 5DD, UK



# Running
Place files in csv folder.

`python start.py $NCPUS` -for composite files
`python start.py $NCPUS 1 ` -for single dot files

This then runs in the background (no screen). To change edit 'show' option in main.js

# Set colours
see colours.json file

# Output
This is in the pdf folder.

# Install
```
conda install nodejs
npm install
sudo npm install -g --save electron --unsafe-perm=true --allow-root
```

- for merge - have imagemagick and ghostscript installed


# Montage setup
python montage.py



## Example Output for Composite Graph
<img src="./readmeimage.png" width="400" />


