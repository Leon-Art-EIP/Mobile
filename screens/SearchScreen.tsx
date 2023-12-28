import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArtTypeFilter, artTypeFilters } from '../constants/artTypes';
import colors from '../constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { mlAuto, mrAuto, fwBold, flex1, mtAuto, mbAuto, flexRow } from '../constants/styles';
import Entypo from 'react-native-vector-icons/Entypo';

const SearchScreen = ({ navigation }: any) => {
  const [filters, setFilters] = useState<ArtTypeFilter[]>(artTypeFilters);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>([]);
  const [isArtTypeDisplayed, setIsArtTypeDisplayed] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [priceValues, setPriceValues] = useState<string>("0-1000");


  const selectOrDeselect = (filterName: string, isSubFilter: boolean = false) => {
    let newFilterArray: string[] = [];
    let array: any[] = isSubFilter ? selectedSubFilters : selectedFilters;

    if (array.includes(filterName)) {
      // if we must remove the value from the array
      newFilterArray = array.filter(
        (f: string) => f !== filterName
      );
    } else {
      // or if we must add it
      newFilterArray = [ ...array, filterName ];
    }

    return isSubFilter ? setSelectedSubFilters([ ...newFilterArray ]) :
      setSelectedFilters([ ...newFilterArray ]);
  }


  const callSearchApi = () => {
    let args1: string = `searchTerm=${search}&artType=${selectedSubFilters[0]}`;
    let args2: string = `&priceRange=${priceValues}`;
    let args3: string = `&artPage=1&artLimit=100&artistPage=1&artistLimit=100`;
    let url: string = args1 + args2 + args3;

    if (!search) {
      return console.warn('Empty search. Staying there...');
    }
    navigation.navigate('results', { url });
  }


  /*
   * Should receive an array like [min: number, max: number]
   */
  const setPriceValuesFromSlider = (values: number[]) => {
    // If not enough values in array
    if (values.length < 2) {
      console.log("slider values: ", values);
      return console.error("Invalid slider price values: not enough values");
    }

    // If value A higher than value B
    if (values[0] > values[1]) {
      console.log("slider values: ", values);
      return console.error("Invalid slider price values: value A higher than B");
    }

    let newValue = values[0].toString() + "-" + values[1].toString();
    console.log('New price values: ', newValue);
    return setPriceValues(newValue);
  }


  const getPriceValues: () => number[] = () => {
    let min: string = priceValues.substring(0, priceValues.indexOf('-'));
    let max: string = priceValues.substring(priceValues.indexOf('-') + 1, priceValues.length);
    return [parseInt(min), parseInt(max)];
  }


  useEffect(() => console.log(selectedSubFilters), [selectedSubFilters]);
  useEffect(() => console.log(selectedFilters), [selectedFilters]);


  useEffect(() => {
    /* get( */
    /*   "/api/explorer/art-types", */
    /*   context?.token, */
    /*   (res: any) => console.log(res), */
    /*   (err: any) => console.error({ ...err }) */
    /* ); */
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.bg}
        barStyle="dark-content"
      />

      {/* Search input */}
      <View style={styles.searchView}>
        <TextInput
          onChangeText={setSearch}
          placeholder="Search..."
          style={styles.searchBar}
        />
        <FontAwesome
          name="search"
          size={24}
          color={colors.text}
          style={{ ...mtAuto, ...mbAuto, marginHorizontal: 18 }}
          onPress={callSearchApi}
        />
      </View>

      {/* Search price */}
      <View style={styles.searchView}>
        <Text style={[mlAuto, mrAuto]}>{ getPriceValues()[0] } €</Text>
        <MultiSlider
          values={getPriceValues()}
          max={1000}
          onValuesChange={setPriceValuesFromSlider}
          sliderLength={Dimensions.get('window').width - 192}
          containerStyle={{ ...mlAuto, ...mrAuto }}
        />
        <Text style={[ mlAuto, mrAuto ]}>{ getPriceValues()[1] } €</Text>
      </View>

      {/* Art types */}
      <ScrollView style={styles.filterScrollView}>

        {/* Title */}
        <TouchableOpacity
          style={[ styles.filterTouchableOpacity, flexRow ]}
          onPress={() => setIsArtTypeDisplayed(e => !e)}
        >
          <Text style={[
            styles.filterText,
            fwBold,
            flex1,
            { fontSize: 20 }
          ]}>Types</Text>
          <Entypo
            name={isArtTypeDisplayed ? "chevron-thin-up" : "chevron-thin-down"}
            size={24}
            color={colors.black}
          />
        </TouchableOpacity>

        {/* Filter list */}
        { isArtTypeDisplayed && filters.map((filter: ArtTypeFilter) => (
          <View key={filter.category.toString()}>
            {/* Filter item */}
            <TouchableOpacity
              style={styles.filterTouchableOpacity}
              onPress={() => selectOrDeselect(filter.category)}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilters.includes(filter.category) ? colors.black : 'normal' }
              ]}>{ filter.category }</Text>
            </TouchableOpacity>

            {/* Subfilter list */}
            <View style={styles.subFilterList}>
              { selectedFilters.includes(filter.category) && filter.types.map((subFilter: any) => (
                <TouchableOpacity
                  key={subFilter?.type.toString()}
                  style={styles.subFilterTouchableOpacity}
                  onPress={() => selectOrDeselect(subFilter?.type, true)}
                >
                  <Text
                    style={{ color: selectedSubFilters.includes(subFilter?.type) ? colors.primary :  'normal' }}
                  >{ subFilter?.type }</Text>
                </TouchableOpacity>
              )) }
            </View>
          </View>
        )) }
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingHorizontal: 12
  },
  searchView: {
    alignItems: 'center',
    backgroundColor: colors.disabledBg,
    borderRadius: 50,
    flexDirection: 'row',
    marginBottom: 12
  },
  searchBar: {
    backgroundColor: colors.disabledBg,
    flex: 1,
    marginTop: 'auto',
    marginBottom: 'auto',
    borderRadius: 50,
    shadowColor: colors.transparent,
    marginHorizontal: 12,
    marginVertical: 12
  },
  filterScrollView: {
    flexGrow: 0,
    backgroundColor: colors.disabledBg,
    borderRadius: 20,
    paddingVertical: 12
  },
  filterTouchableOpacity: {
    padding: 11,
    paddingHorizontal: 32
  },
  filterText: {
    fontSize: 18
  },
  subFilterTouchableOpacity: {
    padding: 11
  },
  subFilterList: {
    backgroundColor: '#ddd',
    marginHorizontal: 12,
    borderRadius: 12
  }
});


export default SearchScreen;
