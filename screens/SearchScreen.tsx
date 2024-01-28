import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArtTypeFilter, artTypeFilters } from '../constants/artTypes';
import colors from '../constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { mlAuto, mrAuto, fwBold, flex1, mtAuto, mbAuto, flexRow, mh8, mt8, bgRed, mh4, mb8 } from '../constants/styles';
import Entypo from 'react-native-vector-icons/Entypo';
import { MainContext } from '../context/MainContext';
import { get } from '../constants/fetch';
import Button from '../components/Button';

const SearchScreen = ({ navigation }: any) => {
  const [filters, setFilters] = useState<ArtTypeFilter[]>(artTypeFilters);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>([]);
  const [isArtTypeDisplayed, setIsArtTypeDisplayed] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [priceValues, setPriceValues] = useState<string>("0-1000");
  const context = useContext(MainContext);


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

    if (isSubFilter) {
      setSelectedSubFilters([ ...newFilterArray ]);
      // not the best thing but this only way I found to trigger rerender
      return setSelectedFilters((curr) => [ ...curr ]);
    }
    return setSelectedFilters([ ...newFilterArray ]);
  }


  // Transform an array of subCategories into a single string, separated by ','
  const filtersToString = () => {
    if (selectedSubFilters.length === 0) {
      return "";
    }
    let filterString: string = selectedSubFilters.reduce(
      (prev: string, curr: string) => prev + ',' + curr
    );
    return `&artType=${filterString}`
  }


  // Puts the arguments in the api URL and navigates to the page results
  const getSearchApi = () => {
    let args1: string = `searchTerm=${search}${filtersToString()}`;
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


  const clearFilters = () => {
    setPriceValues("0-1000");
    /* setSelectedFilters([]); */
    setSelectedSubFilters([]);
    ToastAndroid.show("Les filtres ont été réinitialisés", ToastAndroid.SHORT);
  }


  useEffect(() => console.log(selectedSubFilters), [selectedSubFilters]);
  useEffect(() => console.log(selectedFilters), [selectedFilters]);


  useEffect(() => {
    // Get art filters from back-end
    get(
      "/api/explorer/art-types",
      context?.token,
      (res: any) => setFilters(res?.data),
      () => ToastAndroid.show("Error getting art types", ToastAndroid.SHORT)
    );
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.bg} barStyle="dark-content" />

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
          onPress={getSearchApi}
        />
      </View>

      {/* Search price */}
      <View style={styles.searchView}>
        <Text style={[mlAuto, mrAuto]}>{ getPriceValues()[0] } €</Text>
        <MultiSlider
          values={getPriceValues()}
          max={1000}
          selectedStyle={{ backgroundColor: colors.primary }}
          markerStyle={{ backgroundColor: colors.primary }}
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
            { fontSize: 17 }
          ]}>Types</Text>
          <Entypo
            name={isArtTypeDisplayed ? "chevron-thin-up" : "chevron-thin-down"}
            size={24}
            color={colors.black}
          />
        </TouchableOpacity>

        {/* Filter list */}
        { isArtTypeDisplayed && filters.map((filter: ArtTypeFilter) => (
          <View
            key={filter.category.toString()}
            style={{ marginTop: 15 }}
          >
            {/* Filter item */}
            <TouchableOpacity
              style={styles.filterTouchableOpacity}
              onPress={() => selectOrDeselect(filter.category)}
            >
              <Text style={styles.filterText}>{ filter.category }</Text>
            </TouchableOpacity>

            {/* Subfilter list */}
            <View style={styles.subFilterList}>
              { selectedFilters.includes(filter.category) && filter.types.map((subFilter: string) => (
                <TouchableOpacity
                  key={subFilter}
                  style={styles.subFilterTouchableOpacity}
                  onPress={() => selectOrDeselect(subFilter, true)}
                >
                  <Text
                    style={{ color: selectedSubFilters.includes(subFilter) ? colors.primary :  colors.black }}
                  >{ subFilter }</Text>
                </TouchableOpacity>
              )) }
            </View>
          </View>
        )) }
      </ScrollView>

      <View style={[flexRow, mtAuto]}>
        {/* Clear filters */}
        <Button
          style={[mh4, flex1]}
          onPress={clearFilters}
          value="Clear filters"
          secondary
        />

        {/* Search button */}
        <Button
          style={[mh4, flex1]}
          onPress={getSearchApi}
          value="Search"
        />
      </View>
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
    marginVertical: 12,
    fontSize: 16,
  },
  filterScrollView: {
    flexGrow: 0,
    backgroundColor: colors.disabledBg,
    borderRadius: 20,
    paddingVertical: 12,
    marginBottom: 8
  },
  filterTouchableOpacity: {
    padding: 5,
    paddingHorizontal: 23,
  },
  filterText: {
    fontSize: 18
  },
  subFilterTouchableOpacity: {
    padding: 11
  },
  subFilterList: {
    backgroundColor: '#e1E1E1',
    marginHorizontal: 12,
    borderRadius: 12
  }
});


export default SearchScreen;
