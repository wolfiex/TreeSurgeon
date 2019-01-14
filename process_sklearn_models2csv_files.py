#!/usr/bin/python
# -*- coding: utf-8 -*-
"""

Function to process sklearn saved RandomForestRegressors to csv files, 
which can then be read in by forrester's nope.js plotter functions.  

NOTE: update needed to generalise to external inputs. 

"""

def main():
    """ 
    Driver to make summary csv files from sklearn RandomForestRegressor models
    """

    # Get dictionaries of feature variables, model names etc... 
    RFR_dict = get_RFR_dictionary()
    
    # Extract the pickled sklearn RandomForestRegressor models to .dot files
    extract_trees_to_dot_files()

    # Analyse the nodes in the models
    # (This calls the main worker function "get_decision_point_and_values_for_tree")
    analyse_nodes_in_models()
    

def get_RFR_dictionary():
    """ Read in RandomForestRegressor variables """    
    # Get model names and models 
    # Get testing features
    # ...

    return RFR_dict


def extract_trees_to_dot_files(folder=None,
        extr_str='FINAL_DATA_tree_X_STRAT_JUST_TEMP_K_GEBCO_SALINTY'):
    """ Extract model trees to .dot files to be plotted in d3 """
    from sklearn.externals import joblib
    from sklearn import tree
    import os
    # Get the location of the saved model
    if isinstance(folder, type(None)):
        folder = get_file_locations('iodide_data')+'/models/'
    model_filename = "my_model_{}.pkl".format( extr_str )
    # Mas depth to use?
    max_depth=None
#    max_depth=4 # What was original set in email to Dan
    # Provide feature names?
    testing_features = None
    if (extr_str == 'FINAL_DATA_tree_X_STRAT_JUST_TEMP_K_GEBCO_SALINTY'):
        testing_features = [
    #        u'Longitude',
    #       'Latitude',
           'WOA_TEMP_K',
           'WOA_Salinity',
    #       'WOA_Nitrate',
           'Depth_GEBCO',
    #       'SeaWIFs_ChlrA',
    #     u'month',
            ]
    # open as rf
    rf = joblib.load(folder+model_filename)
    # save all trees to disk
    for n, rf_unit in enumerate( rf ):
        out_file='tree_{}_{}.dot'.format( extr_str, n )
        tree.export_graphviz(rf_unit, out_file=out_file, max_depth=max_depth,
            feature_names=testing_features )
    # Also plot up?
#    os.system('dot -Tpng tree.dot -o tree.png')


def analyse_nodes_in_models( RFR_dict=None, depth2investigate=5 ):
    """ Analyse the nodes in a RFR model """
    import glob
    # ---
    # get dictionary of data if not provided as arguement
    if isinstance( RFR_dict, type(None) ):
        RFR_dict = build_or_get_current_models()
    # models to analyse?
    models2compare = [
#    'RFR(TEMP+DEPTH+SAL+NO3+DOC)', 'RFR(TEMP+DEPTH+SAL+NO3)',
#    'RFR(TEMP+DEPTH+SAL)', 'RFR(TEMP+SAL+Prod)',
#    'RFR(TEMP+SAL+NO3)',
#    'RFR(TEMP+DEPTH+SAL)',
    ]
    topmodels = get_top_models( RFR_dict=RFR_dict, NO_DERIVED=True, n=10 )
    models2compare = topmodels
    # get strings to update variable names to
    name_dict = convert_fullname_to_shortname( rtn_dict=True )
    # Loop and analyse models2compare
    for model_name in models2compare:
        print( model_name )
        get_decision_point_and_values_for_tree( model_name=model_name,
            RFR_dict=RFR_dict, depth2investigate=depth2investigate )
    # Loop and update the variable names
    for model_name in models2compare:
        print( model_name )
        # Now rename variables in columns
        filestr = 'Oi_prj_features_of*{}*{}*.csv'
        filestr = filestr.format( model_name, depth2investigate )
        csv_files = glob.glob(filestr)
        for csv_file in csv_files:
            df = pd.read_csv( csv_file )
            # Update the names for the variables
            feature_columns = [i for i in df.columns if 'feature' in i]
            for col in feature_columns:
                for key, value in name_dict.items():
                    df[col] = df[col].str.replace( key, value )
            # save the .csv
            df.to_csv( csv_file )


def get_decision_point_and_values_for_tree( depth2investigate=3,
        model_name='RFR(TEMP+DEPTH+SAL)', RFR_dict=None, verbose=True,
        debug=False ):
    """
    Get the variables driving decisions at each point

    NOTE:
    link: http://scikit-learn.org/stable/auto_examples/tree/plot_unveil_tree_structure.html
# The decision estimator has an attribute called tree_  which stores the entire
# tree structure and allows access to low level attributes. The binary tree
# tree_ is represented as a number of parallel arrays. The i-th element of each
# array holds information about the node `i`. Node 0 is the tree's root. NOTE:
# Some of the arrays only apply to either leaves or split nodes, resp. In this
# case the values of nodes of the other type are arbitrary!
#
# Among those arrays, we have:
#   - left_child, id of the left child of the node
#   - right_child, id of the right child of the node
#   - feature, feature used for splitting the node
#   - threshold, threshold value at the node
#
    """
    from sklearn.externals import joblib
    from sklearn import tree
    import os
    # get dictionary of data if not provided as arguement
    if isinstance( RFR_dict, type(None) ):
        RFR_dict = build_or_get_current_models()
    # extra variables needed from RFR_dict
    models_dict = RFR_dict['models_dict']
    testing_features_dict = RFR_dict['testing_features_dict']
    # Extract model from dictionary
    model = models_dict[ model_name ]
    # Get training_features
    training_features = testing_features_dict[ model_name ].split('+')
    # Core string for saving data to.
    filename_str = 'Oi_prj_features_of_{}_for_depth_{}{}.{}'
    # Intialise a DataFrame to store values in
    df = pd.DataFrame()
    # Loop by estimator in model
    for n_estimator, estimator in enumerate( model ):
        # Extract core variables of interest
        n_nodes = estimator.tree_.node_count
        children_left = estimator.tree_.children_left
        children_right = estimator.tree_.children_right
        feature = estimator.tree_.feature
        threshold = estimator.tree_.threshold
        n_node_samples = estimator.tree_.n_node_samples
        # The tree structure can be traversed to compute various properties such
        # as the depth of each node and whether or not it is a leaf.
        node_depth = np.zeros(shape=n_nodes, dtype=np.int64)
        is_leaves = np.zeros(shape=n_nodes, dtype=bool)
        stack = [(0, -1)]  # seed is the root node id and its parent depth
        # Now extract data
        while len(stack) > 0:
            node_id, parent_depth = stack.pop()
            node_depth[node_id] = parent_depth + 1
            # If we have a test node
            if (children_left[node_id] != children_right[node_id]):
                stack.append((children_left[node_id], parent_depth + 1))
                stack.append((children_right[node_id], parent_depth + 1))
            else:
                is_leaves[node_id] = True
        # - work out which nodes are required.
        # NOTE: numbering is 1=># of nodes (zero is the first node)
        # add the initial node to a dictionary
        nodes2save = {}
        depth = 0
        n_node = 0
        nodes2save[ depth ] = { n_node: [children_left[0], children_right[0]] }
        num2node = {0:0}
        # For depth in depths
        for depth in range( depth2investigate )[:-1]:
            nodes4depth = {}
            new_n_node = max( nodes2save[ depth ].keys() )+1
            for n_node in nodes2save[ depth ].keys():
                # Get nodes from the children of each node (LH + RH)
                for ChildNum in nodes2save[ depth ][ n_node ]:
                    # Get the children of this node
                    LHnew = children_left[ ChildNum ]
                    RHnew = children_right[ ChildNum ]
                    # save to temp. dict
                    nodes4depth[ new_n_node ] = [ LHnew, RHnew ]
                    # increment the counter and
                    new_n_node += 1
            # Save the new nodes for depth with assigned number
            nodes2save[ depth+1 ] = nodes4depth
        # Get node numbers to save as a dict
        for d in range( depth2investigate )[1:]:
            if debug: print ( d, nodes2save[d] )
            for n in nodes2save[d-1].keys():
                if debug: print( n, nodes2save[d-1][n] )
                for nn in nodes2save[d-1][n] :
                    newnum = max( num2node.keys() ) +1
                    num2node[ newnum ] = nn
        # Make a series of values for estimators
        s = pd.Series()
        for node_num in sorted( num2node.keys() ):
            # get index of node of interest
            idx = num2node[node_num]
            # save threadhold value
            var_ = 'N{:0>4}: threshold '.format( node_num )
            s[var_] = threshold[ idx ]
            # save feature (and convert index to variable name)
            var_ = 'N{:0>4}: feature '.format( node_num )
            s[var_] = training_features[ feature[ idx ] ]
            # save feature (and convert index to variable name)
            var_ = 'N{:0>4}: n_node_samples '.format( node_num )
            s[var_] = n_node_samples[ idx ]
            # save right hand children
            var_ = 'N{:0>4}: RH child '.format( node_num )
            s[var_] = children_right[ idx ]
            # save the left hand children
            var_ = 'N{:0>4}: LH child '.format( node_num )
            s[var_] = children_left[ idx ]
        # Also add general details for estimator
        s['n_nodes'] = n_nodes
        # now save to main DataFrame
        df[n_estimator] = s.copy()
    # Set index to be the estimator number
    df = df.T
    # Save the core data on the estimators
    filename = filename_str.format( model_name, depth2investigate, '_ALL', '')
    df.to_csv( filename+'csv' )
    # --- Print a summary to a file screen
    dfs = {}
    for node_num in sorted( num2node.keys() ):
        # get index of node of interest
        idx = num2node[node_num]
        vars_ = [i for i in df.columns if 'N{:0>4}'.format(node_num) in i ]
        # get values of inteest for nodes
        FEATvar = [i for i in vars_ if 'feature' in i][0]
        THRESvar = [i for i in vars_ if 'threshold' in i][0]
        SAMPLEvar = [i for i in vars_ if 'n_node_samples' in i][0]
#        RHChildvar = [i for i in vars_ if 'RH child' in i][0]
#        LHChildvar = [i for i in vars_ if 'LH child' in i][0]
#            print FEATvar, THRESvar
        # Get value counts
        val_cnts = df[FEATvar].value_counts()
        df_tmp = pd.DataFrame( val_cnts )
        # Store the features and rename the # of tress column
        df_tmp['feature'] = df_tmp.index
        df_tmp.rename( columns={FEATvar:'# of trees'}, inplace=True )
        # Calc percent
        df_tmp['%'] = val_cnts.values / float(val_cnts.sum()) *100.
        # Save the children for node
#        df_tmp['RH child'] = df[RHChildvar][idx]
#        df_tmp['LH child'] = df[LHChildvar][idx]
        # intialise series objects to store stats
        s_mean = pd.Series()
        s_median = pd.Series()
        s_std = pd.Series()
        node_feats = list(df_tmp.index)
        s_samples_mean = pd.Series()
        s_samples_median = pd.Series()
        # Now loop and get values fro features
        for feat_ in node_feats:
            # - Get threshold value for node + stats on this
            thres_val4node = df[THRESvar].loc[ df[FEATvar]==feat_]
            # make sure the value is a float
            thres_val4node = thres_val4node.astype(np.float)
            # convert Kelvin to degrees for readability
            if feat_ == 'WOA_TEMP_K':
                thres_val4node = thres_val4node -273.15
            # exact stats of interest
            stats_ = thres_val4node.describe().T
            s_mean[feat_] = stats_['mean']
            s_median[feat_] = stats_['50%']
            s_std[feat_] = stats_['std']
            # - also get avg. samples
            sample_val4node = df[SAMPLEvar].loc[ df[FEATvar]==feat_]
            # make sure the value is a float
            sample_val4node = sample_val4node.astype(np.float)
            stats_ = sample_val4node.describe().T
            s_samples_mean = stats_['mean']
            s_samples_median = stats_['50%']
        # Add stats to tmp DataFrame
        df_tmp['std'] = s_std
        df_tmp['median'] = s_median
        df_tmp['mean'] = s_mean
        # set the depth value for each node_num
        if node_num == 0:
            depth = node_num
        elif node_num in range(1,3):
            depth = 1
        elif node_num in range(3,3+(2**2) ):
            depth = 2
        elif node_num in range(7,7+(3**2) ):
            depth = 3
        elif node_num in range(16,16+(4**2)):
            depth = 4
        elif node_num in range(32,32+(5**2)):
            depth = 5
        elif node_num in range(57,57+(6**2)):
            depth = 6
        elif node_num in range(93,93+(7**2)):
            depth = 7
        elif node_num in range(129,129+(8**2)):
            depth = 8
        else:
            print( 'Depth not setup for > n+8' )
            sys.exit()
        df_tmp['depth'] = depth
        df_tmp['node #'] = node_num
        df_tmp['# samples (mean)'] = s_samples_mean
        df_tmp['# samples (median)'] = s_samples_median
        # Set the index to just a range
        df_tmp.index = range( len(df_tmp.index) )
        # Save to main DataFrame
        dfs[node_num] = df_tmp.copy()
    # loop and save info to files
    filename = filename_str.format( model_name, depth2investigate, '', 'txt')
    a = open( filename, 'w' )
    for depth in range(depth2investigate):
        # print summary
        header =  '--- At depth {:0>3}:'.format( depth )
        if verbose:
            print( header )
            print( dfs[depth] )
        # save
        print( header, file=a)
        print( dfs[depth], file=a)
    # close file to save data
    a.close()
    # --- Build a DataFrame with details on a node by node basis
    # combine by node
    keys = sorted( dfs.keys() )
    dfn = dfs[ keys[0] ].append( [dfs[i] for i in keys[1:] ] )
    # re index and order by
    dfn.index = range( len(dfn.index ) )
    dfn.sort_values(by=['node #'], ascending=True, inplace=True)
    filename = filename_str.format( model_name, depth2investigate, '', 'csv')
    dfn.to_csv( filename )
    
    
if __name__ == "__main__":
    main()

