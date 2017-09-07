import React, { Component } from 'react';
import ReactNative from 'react-native';
import * as firebase from 'firebase';
import Prompt from 'react-native-prompt';
var StatusBar = require('./components/StatusBar');
var ActionButton = require('./components/ActionButton');
var ListItem = require('./components/ListItem');
const styles = require('./styles.js');
const {
  AppRegistry,
  ListView,
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableHighlight,
  Alert
} = ReactNative;

const firebaseConfig = {
  apiKey: "AIzaSyAgjNGL3q44uDYQfnRlEB551JpYQXTPGL8",
  authDomain: "tutorial-ca71e.firebaseapp.com",
  databaseURL: "https://tutorial-ca71e.firebaseio.com",
  projectId: "tutorial-ca71e",
  storageBucket: "tutorial-ca71e.appspot.com",
  messagingSenderId: "1032204070800"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
console.ignoredYellowBox = [
  "Setting a timer"
];

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = this.getRef().child('items');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" >
        <StatusBar title="Grocery List" />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to add!"
          onChangeText={(text) => this.setState({text})}
        />
        <ActionButton onPress={this._addItem.bind(this)} title="Add" />

      </KeyboardAvoidingView>
    )
  }

  _addItem() {
    this.itemsRef.push({ title: this.state.text });
  }

  _renderItem(item) {

    const onPress = () => {
      Alert.alert(
        'Delete this item?',
        null,
        [
          {text: 'Yes', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ],
        {cancelable: false}
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }
}