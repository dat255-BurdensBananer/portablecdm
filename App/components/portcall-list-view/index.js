import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPortCalls } from '../../actions';

import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';

import { 
    SearchBar, 
    Button, 
    List, 
    ListItem,
} from 'react-native-elements';

import colorScheme from '../../config/colors';
import TopHeader from '../top-header-view';
import { getDateTimeString } from '../../util/timeservices';

class PortCallList extends Component {
    static navigationOptions = {
        header: <TopHeader title="PortCalls" firstPage={true}/>
    }

    state = {
        searchTerm: '',
    }

    componentWillMount() {
        this.props.fetchPortCalls();
    }

    render() {
        const {navigation, showLoadingIcon, portCalls} = this.props;
        const {navigate} = navigation;
        const {searchTerm} = this.state;

        return(
            <View style={styles.container}>
                {/*Render the search/filters header*/}
                <View style={styles.containerRow}>
                    <SearchBar 
                        containerStyle = {styles.searchBarContainer}
                        showLoadingIcon={showLoadingIcon}
                        clearIcon
                        inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
                        lightTheme  
                        placeholder='Search'
                        placeholderTextColor = {colorScheme.tertiaryTextColor}
                        onChangeText={text => this.setState({searchTerm: text})}
                        textInputRef='textInput'
                    />
                    <Button
                        containerViewStyle={styles.buttonContainer}
                        small
                        icon={{
                            name: 'filter-list',
                            size: 30,
                            color: colorScheme.primaryTextColor,
                            style: styles.iconStyle,
                        }}
                        backgroundColor = {colorScheme.primaryColor} 
                        onPress= {() => navigate('FilterMenu')}
                    /> 
                </View>

                {/*Render the List of PortCalls*/}
                <ScrollView>
                    <List>
                        {
                            this.search(portCalls, searchTerm).map( (portCall) => (
                                <ListItem
                                    roundAvatar
                                    avatar={{uri: portCall.vessel.photoURL}}
                                    key={portCall.portCallId}
                                    title={portCall.vessel.name}
                                    subtitle={getDateTimeString(new Date(portCall.startTime))}
                                    onPress={() => navigate('TimeLineDetails', {portCallId: portCall.portCallId})}
                                />
                            ))
                        }                    
                    </List>
                </ScrollView>
            </View>
        );        
    }

    search(portCalls, searchTerm) {
        return portCalls.filter(portCall => portCall.vessel.name.toUpperCase().startsWith(searchTerm.toUpperCase()));        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.primaryColor  // Har denna grå färgen lite brunt i sig? 
    },
    // Search bar and filter button  
    containerRow: {
        flexDirection: 'row',
        alignItems:'center',
        marginTop: 10,
        paddingLeft: 15,
        paddingRight: 0,
    },
    searchBarContainer: {
        backgroundColor: colorScheme.primaryColor,
        flex: 4,
        marginRight: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,      
    },
    // Filter button container 
    buttonContainer: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        alignSelf: 'stretch',
    },
    iconStyle: {
        alignSelf: 'stretch',
    },
})

function mapStateToProps(state) {
    return {
        portCalls: state.portCalls.foundPortCalls,
        showLoadingIcon: state.portCalls.portCallsAreLoading
    }
}

export default connect(mapStateToProps, {fetchPortCalls})(PortCallList);

