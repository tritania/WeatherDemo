/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, View, ScrollView} from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLegend,
  VictoryAxis,
  VictoryLabel,
} from 'victory-native';
import envData from './EnvCanada-2018-daily-weather-data.json'; //bring in env canada data

//compute values in sheets to make sure results are accurate
const monthNames = [
  //add month names to make table generation easier
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const monthNamesAbv = [
  //shorthen month names to make graph generation easier
  'J',
  'F',
  'M',
  'A',
  'M',
  'J',
  'J',
  'A',
  'S',
  'O',
  'N',
  'D',
];

export default class WeatherDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
    //data is processed here as API call would likely be made here if this was networked
    var months = []; //json data has months starting at 1 so we'll create 13 elements and ignore 0
    for (var t = 0; t < 13; t++) {
      months.push([]); //create an array of arrays so we can sort days into respective month objects
    }

    var computedData = [];
    for (var i = 0; i < envData.length; i++) {
      months[envData[i].Month].push(envData[i]); //move each day into its corresponding month
    }

    var min, avg, max, prep, missingDays;
    for (var j = 1; j < months.length; j++) {
      min = 1000; //set initial values for min max avg and precip, use absurd values to make sure they cant be the defaults
      avg = 0;
      max = -1000;
      prep = 0;
      missingDays = 0; //have to account for missing days when we do the mean calculation

      for (var k = 0; k < months[j].length; k++) {
        /* find min temp */
        if (
          months[j][k]['Min Temp Flag'] !== 'M' &&
          min > months[j][k]['Min Temp (°C)'] //pull the actual data out
        ) {
          //make sure we dont have M flag for missing for any values, skip if we do
          min = months[j][k]['Min Temp (°C)'];
        }
        /* find max temp */
        if (
          months[j][k]['Max Temp Flag'] !== 'M' &&
          max < months[j][k]['Max Temp (°C)']
        ) {
          max = months[j][k]['Max Temp (°C)'];
        }
        /* sum for avg*/
        if (months[j][k]['Mean Temp Flag'] !== 'M') {
          avg += months[j][k]['Mean Temp (°C)'];
        } else {
          missingDays++;
        }
        /*sum precp*/
        if (months[j][k]['Total Precip Flag'] !== 'M') {
          prep += months[j][k]['Total Precip (mm)'];
        }
      }
      avg = avg / months[j].length - missingDays; //find average, days in month minus any missing days

      computedData.push({
        name: monthNames[j - 1],
        min: min,
        avg: Number(parseFloat(avg).toFixed(1)), //parse temperature to a fixed float and also make sure its a number so Victory will graph its value correctly
        max: max,
        prep: Number(parseFloat(prep).toFixed(1)),
      });
    }

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({data: computedData, loading: false}); //because I'm assuming a fake network call setting state here is fine
  }

  rowRender(month, index) {
    //return a row of data, each call to this function represents one month
    return (
      <View
        key={index}
        style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
          <Text>{month.name}</Text>
        </View>
        <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
          <Text>{month.min}</Text>
        </View>
        <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
          <Text>{month.avg}</Text>
        </View>
        <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
          <Text>{month.max}</Text>
        </View>
        <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
          <Text>{month.prep}</Text>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.loading) {
      //where we import the json data as a "fake" network call the data isnt renderable from the start check the state of loading to know when data processing is done
      return (
        //seperate view to show while data is fetched and processed
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading!</Text>
        </View>
      );
    } else {
      //data is good to go
      const data = [
        //extract the min, avg, max, and precip value for each month for graphing
        this.state.data.map(datus => datus.min),
        this.state.data.map(datus => datus.avg),
        this.state.data.map(datus => datus.max),
        this.state.data.map(datus => datus.prep),
      ];
      return (
        //couldnt get 2 graphs and the table to fit in one view and look nice so, ScrollView used instead
        <ScrollView style={{flex: 1, flexDirection: 'column'}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                padding: 20,
              }}>
              Summary of Monthly Temperature and Precipitation Data in Saint
              John, NB for 2018
            </Text>
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#d6d7da',
              }}>
              <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
                <Text style={{fontWeight: 'bold'}}>Month</Text>
              </View>
              <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
                <Text style={{fontWeight: 'bold'}}>Min Temp (°C)</Text>
              </View>
              <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
                <Text style={{fontWeight: 'bold'}}>Mean Temp (°C)</Text>
              </View>
              <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
                <Text style={{fontWeight: 'bold'}}>Max Temp (°C)</Text>
              </View>
              <View style={{flex: 1, borderWidth: 0.5, borderColor: '#d6d7da'}}>
                <Text style={{fontWeight: 'bold'}}>Total Precip (mm)</Text>
              </View>
            </View>
            {this.state.data.map((month, index) => {
              //items should have keys
              return this.rowRender(month, index);
            })}
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                padding: 20,
              }}>
              Minimum, Maximum and Mean Temperatures per Month (°C) in Saint
              John, NB, 2018
            </Text>
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryAxis
                dependentAxis
                orientation="left"
                tickValues={[-30, -15, 0, 15, 30]}
              />
              <VictoryAxis
                orientation="bottom"
                tickFormat={x => monthNamesAbv[x]}
                crossAxis={false}
                tickCount={12}
                fixLabelOverlap={true}
                tickLabelComponent={<VictoryLabel angle={0} />}
              />
              <VictoryLegend
                x={125}
                y={250}
                title="Legend"
                centerTitle
                orientation="horizontal"
                gutter={20}
                style={{border: {stroke: 'black'}, title: {fontSize: 20}}}
                data={[
                  {name: 'Min', symbol: {fill: 'blue'}},
                  {name: 'Avg', symbol: {fill: 'grey'}},
                  {name: 'Max', symbol: {fill: 'red'}},
                ]}
              />
              <VictoryLine
                style={{
                  data: {stroke: 'blue'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={data[0]}
              />
              <VictoryLine
                style={{
                  data: {stroke: 'grey'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={data[1]}
              />
              <VictoryLine
                style={{
                  data: {stroke: 'red'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={data[2]}
              />
            </VictoryChart>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                padding: 20,
              }}>
              Precipitation per Month (mm) in Saint John, NB, 2018
            </Text>
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryAxis
                dependentAxis
                orientation="left"
                tickValues={[0, 75, 150, 225, 300]}
              />
              <VictoryAxis
                orientation="bottom"
                tickFormat={x => monthNamesAbv[x]}
                crossAxis={false}
                tickCount={12}
                fixLabelOverlap={true}
                tickLabelComponent={<VictoryLabel angle={0} />}
              />
              <VictoryLine
                style={{
                  data: {stroke: 'purple'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={data[3]}
              />
            </VictoryChart>
          </View>
        </ScrollView>
      );
    }
  }
}
