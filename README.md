
# TreeSurgeon: Visualisation of Random Forest Regressors
<a href="https://doi.org/10.5281/zenodo.3346817"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.3346817.svg" alt="DOI"></a>

**TreeSurgeon** contains routines to visualise Random Forest Regressor models. The module takes models output files made by [`sklearn`](https://scikit-learn.org/)'s RandomForestRegressor implementation of the random forest regressor algorithm. The raw output files from [`sklearn`](https://scikit-learn.org/) models (`*pkl`) first needs to be converted to the input `.csv` files required by **TreeSurgeon** using the
`extract_models4TreeSurgeon.py` script in the
[`sparse2spatial`](https://github.com/tsherwen/sparse2spatial) module.


# Quick Start

## Running

- Process the saved Random Forest Regressor models `*.pkl` files into the `.csv` that **TreeSurgeon*** expects using the script in [`sparse2spatial`](https://github.com/tsherwen/sparse2spatial) module. You will need to update some lines in the script as described there.

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

- for merge imagemagick and ghostscript need to be installed

## Montage setup
python montage.py

## Example Output for Composite Graph
<img src="./readmeimage.png" width="400" />

# Usage

This package was initially written for use with the [`sparse2spatial`](https://github.com/tsherwen/sparse2spatial) package for work to predict sea-surface concentrations [[*Sherwen et al.* 2019](https://doi.org/10.5194/essd-2019-40)]. However it can be used for any Radom Forest Regressor models made by [`sklearn`](https://scikit-learn.org/) and post-processed to **TreeSurgeon** input by [`sparse2spatial`](https://github.com/tsherwen/sparse2spatial)


## Reference
Sherwen, T., Chance, R. J., Tinel, L., Ellis, D., Evans, M. J., and Carpenter, L. J.: A machine learning based global sea-surface iodide distribution, Earth Syst. Sci. Data Discuss., https://doi.org/10.5194/essd-2019-40, in review, 2019.

# License

Copyright (c) 2019 [Daniel Ellis](https://github.com/wolfiex) and [Tomas Sherwen](https://github.com/tsherwen)

This work is licensed under a permissive MIT License.
