import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArtTypeFilter, artTypeFilters } from '../constants/artTypes';
import colors from '../constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { mlAuto, mrAuto, fwBold, flex1, mtAuto, mbAuto, flexRow, mh4, cBlack } from '../constants/styles';
import Entypo from 'react-native-vector-icons/Entypo';
import { MainContext } from '../context/MainContext';
import { get } from '../constants/fetch';
import Button from '../components/buttons/Button';
import InfoModal from '../components/infos/InfoModal';
import Subtitle from '../components/text/Subtitle';
import Input from '../components/textInput/Input';


const SearchScreen = ({ navigation }: any) => {
  const [filters, setFilters] = useState<ArtTypeFilter[]>(artTypeFilters);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>([]);
  const [isArtTypeDisplayed, setIsArtTypeDisplayed] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [priceValues, setPriceValues] = useState<string>("0-1000");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error');  // State to track the type of the modal
  const context = useContext(MainContext);


  const selectOrDeselect = (filterName: string, isSubFilter = false) => {
    let newFilterArray: string[] = [];
    const array: any[] = isSubFilter ? selectedSubFilters : selectedFilters;

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
  };


  // Transform an array of subCategories into a single string, separated by ','
  const filtersToString = () => {
    if (selectedSubFilters.length === 0) {
      return "";
    }
    const filterString: string = selectedSubFilters.reduce(
      (prev: string, curr: string) => prev + ',' + curr
    );
    return `&artType=${filterString}`;
  };


  // Puts the arguments in the api URL and navigates to the page results
  const getSearchApi = () => {
    "explorer/search?searchTerm=dev&artPage=1&artLimit=10&artistPage=1&artistLimit=10";
    const args1 = `searchTerm=${search.toLowerCase()}${filtersToString()}`;
    const args2 = `&priceRange=${priceValues}`;
    const args3 = `&artPage=1&artLimit=100&artistPage=1&artistLimit=100`;
    const url: string = args1 + (priceValues === '0-1000' ? "" : args2) + args3;

    if (!search.trim()) {
      setModalMessage("Veuillez entrer un champ pour votre recherche.");
      setModalType('error');
      setModalVisible(true);
      return;
  }
    navigation.navigate('results', { url });
  };


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

    const newValue = values[0].toString() + "-" + values[1].toString();
    console.log('New price values: ', newValue);
    return setPriceValues(newValue);
  };


  const getPriceValues: () => number[] = () => {
    const min: string = priceValues.substring(0, priceValues.indexOf('-'));
    const max: string = priceValues.substring(priceValues.indexOf('-') + 1, priceValues.length);
    return [parseInt(min), parseInt(max)];
  };


  const clearFilters = () => {
    setPriceValues("0-1000");
    setSearch('');
    setSelectedSubFilters([]);
    ToastAndroid.show("Les filtres ont été réinitialisés", ToastAndroid.SHORT);
  };


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

      <View style={styles.searchView}>
        <Input
          onTextChanged={setSearch}
          placeholderTextColor={colors.disabledFg}
          placeholder="Rechercher..."
          style={styles.searchBar}
        />
        <FontAwesome
          name="search"
          size={24}
          color={!search ? colors.text : colors.black}
          style={{ ...mtAuto, ...mbAuto, marginHorizontal: 18 }}
          onPress={getSearchApi}
        />
      </View>

      <Subtitle style={{fontSize: 16, marginTop: 20, marginBottom: 20, color: colors.darkGreyBg, marginLeft: 12,}}>Prix</Subtitle>
      {/* Search price */}
      <View style={styles.searchView2}>
        <Text style={[mlAuto, mrAuto, cBlack]}>{ getPriceValues()[0] } €</Text>
        <MultiSlider
          values={getPriceValues()}
          max={5000}
          selectedStyle={{ backgroundColor: context?.userColor ?? colors.primary }}
          markerStyle={{ backgroundColor: context?.userColor ?? colors.primary }}
          onValuesChange={setPriceValuesFromSlider}
          sliderLength={Dimensions.get('window').width - 192}
          containerStyle={{ ...mlAuto, ...mrAuto }}
        />
        <Text style={[ mlAuto, mrAuto, cBlack ]}>{ getPriceValues()[1] } €</Text>
      </View>

      {/* Art types */}
      <ScrollView style={styles.filterScrollView}>

        {/* Title */}
        <TouchableOpacity
          style={[ styles.filterTouchableOpacity, flexRow ]}
          onPress={() => setIsArtTypeDisplayed(e => !e)}
        >
          <Subtitle style={[
            styles.filterText,
            fwBold,
            flex1,
          ]}>
            Types
          </Subtitle>
          <Entypo
            name={isArtTypeDisplayed ? "chevron-thin-down" : "chevron-thin-right"}
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
          value="Effacer"
          secondary
        />

        {/* Search button */}
        <Button
          style={[mh4, flex1]}
          onPress={getSearchApi}
          value="Rechercher"
        />
        <InfoModal
          isVisible={isModalVisible}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
          messageType={modalType}
        />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingHorizontal: 12
  },
  logo: {
    alignItems: 'center',
    borderColor: 'red',
    // backgroundColor: colors.disabledBg,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 12
  },
  searchView: {
    alignItems: 'center',
    borderColor: 'red',
    backgroundColor: colors.disabledBg,
    borderRadius: 50,
    flexDirection: 'row',
    marginBottom: 12
  },
  searchView2: {
    alignItems: 'center',
    borderColor: 'red',
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 25
  },
  searchBar: {
    backgroundColor: colors.disabledBg,
    flex: 1,
    marginTop: 'auto',
    marginBottom: 'auto',
    shadowColor: colors.transparent,
    marginHorizontal: 12,
    marginVertical: 12,
    fontSize: 16,
    color: colors.black
  },
  filterScrollView: {
    flexGrow: 0,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 12,
    marginBottom: 8
  },
  filterTouchableOpacity: {
    padding: 5,
    paddingHorizontal: 23,
    marginTop: 20,
  },
  filterText: {
    color: colors.black,
    fontSize: 20
  },
  subFilterTouchableOpacity: {
    padding: 11,

  },
  subFilterList: {
    backgroundColor: colors.white,
    marginHorizontal: 12,
    borderRadius: 12,
    marginLeft: 30,
  }
});


export default SearchScreen;