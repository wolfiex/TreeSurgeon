<a href='https://zenodo.org/record/2579240'> <img data-toggle="modal" data-target="[data-modal='https://zenodo.org/record/2579240']" src="https://zenodo.org/badge/112364748.svg" alt="https://zenodo.org/record/2579240"></a>

# TreeSurgeon - Visualisation of Radom Forest Regressor models

*TreeSurgeon* contains routines to visualise Radom Forest Regressor models. The module takes models output files made by [`sklearn`](https://scikit-learn.org/)'s RadomForestRegressor implementation of the random forest regressor algorithm. The raw output files from [`sklearn`](https://scikit-learn.org/) models (`*pkl`) first needs to be converted to the input .csv files required by *TreeSurgeon* using the
extract_models4TreeSurgeon.py script in the
[`sparse2spatial`](https://github.com/tsherwen/sparse2spatial) module.


# Quick Start

## Running

- Process the saved Radom Forest Regressor models `*.pkl` files into the `.csv` that *TreeSurgeon* expects using the script in [`sparse2spatial`](https://github.com/tsherwen/sparse2spatial) module. You will need to update some lines in the script as described there.

`python extract_models4TreeSurgeon.py`

- Place files in the [`csv`](https://github.com/wolfiex/TreeSurgeon/tree/master/csv) folder.

for composite files:
`python start.py $NCPUS`

or for single dot files
`python start.py $NCPUS 1 `

- This then runs in the background (no screen). To change edit `show` option in main.js

## Set colours
The colours are set in the `colours.json` file.

## Output
This is in the [`pdfs`](https://github.com/wolfiex/TreeSurgeon/tree/master/pdfs) folder.

## Install
```
conda install nodejs
npm install
sudo npm install -g --save electron --unsafe-perm=true --allow-root
```

- for merge - have imagemagick and ghostscript installed

## Montage setup
python montage.py

## Example Output for Composite Graph
<img src="./readmeimage.png" width="400" />

# Usage

This package was initially written for use with the [`sparse2spatial`](https://github.com/tsherwen/sparse2spatial) package for work to predict sea-surface concentrations ([Sherwen et al. 2019])[https://doi.org/10.5194/essd-2019-40]. However it can be used for any Radom Forest Regressor models made by [`sklearn`](https://scikit-learn.org/) and post-processed to *TreeSurgeon* input by [`sparse2spatial`](https://github.com/tsherwen/sparse2spatial)


## Citation(s)
Sherwen, T., Chance, R. J., Tinel, L., Ellis, D., Evans, M. J., and Carpenter, L. J.: A machine learning based global sea-surface iodide distribution, Earth Syst. Sci. Data Discuss., https://doi.org/10.5194/essd-2019-40, in review, 2019.

