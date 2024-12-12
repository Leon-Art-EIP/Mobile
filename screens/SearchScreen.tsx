import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArtTypeFilter, artTypeFilters } from '../constants/artTypes';
import colors from '../constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { mlAuto, mrAuto, fwBold, flex1, mtAuto, mbAuto, flexRow, mh4, cBlack, br12, cTextDark, aiCenter, mh0, mv4, mv0, bgOffer, bgGrey, ph4, ph8, pv4, ph0, pv0, mh8, mv8, ph24, displayFlex, pv8, br50, mv24, cPrimary, mb8 } from '../constants/styles';
import { MainContext } from '../context/MainContext';
import Button from '../components/buttons/Button';
import InfoModal from '../components/infos/InfoModal';
import Subtitle from '../components/text/Subtitle';
import Card from '../components/cards/Card';


const SearchScreen = ({ navigation }: any) => {
  const [filters, setFilters] = useState<ArtTypeFilter[]>(artTypeFilters);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(undefined);
  const [selectedSubFilter, setSelectedSubFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [priceValues, setPriceValues] = useState<string>("0-1000");
  const [isForSale, setIsForSale] = useState<boolean | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error');  // State to track the type of the modal
  let _inputRef: TextInput | null = null;
  const context = useContext(MainContext);


  interface SubfilterType {
    type: string;
    selected: boolean
  }


  const getFilterSubfilters = (filtername: string): string[] => {
    const el: ArtTypeFilter | undefined = filters.find(
      (f: ArtTypeFilter) => f.category === filtername
    );
    return el ? el.types.map((s: SubfilterType) => s.type) : [];
  }


  // Puts the arguments in the api URL and navigates to the page results
  const getSearchApi = () => {
    navigation.navigate('results', { url: getQueryString() });
  };


  // Returns a string with the query that is to be sent to the back end
  const getQueryString = () => {
    const queryParams = [
      !!search ? `searchTerm=${search.toLowerCase()}` : "",
      !!selectedSubFilter ? `artType=${selectedSubFilter}` : "",
      !!priceValues ? `priceRange=${priceValues}` : "",
      isForSale !== undefined ? `isForSale=${isForSale}` : "",
      "artPage=1",
      "artLimit=50",
      "artistPage=1",
      "artistLimit=20"
    ];

    const queryString: string = queryParams.filter(Boolean).join("&");
    console.log('query string: ', queryString);
    return !!queryString ? `${queryString}` : "";
  }

  useEffect(() => {
    if (!selectedFilter) {
      setSelectedSubFilter(undefined);
    }
  }, [selectedFilter]);


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
    setSelectedSubFilter("");
    setSelectedFilter('');

    if (!!_inputRef) {
      _inputRef.clear();
    }

    ToastAndroid.show(
      "Les filtres ont été réinitialisés",
      ToastAndroid.SHORT
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.bg} barStyle="dark-content" />

      <View style={styles.searchView}>
        <TextInput
          ref={ref => _inputRef = ref}
          onChangeText={setSearch}
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

      <Subtitle style={styles.subtitle}>
        Prix
      </Subtitle>

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

      {/* Available to sell */}
      <View style={[flexRow, aiCenter, mh4, mv0, ph4, pv4]}>
        <Text style={[cTextDark, flex1, mh8, mv8]}>
          Disponible à la vente
        </Text>

        <View style={[
          flexRow, ph8, pv4, mh8, br12, ph0, pv0,
          { backgroundColor: colors.disabledBg }
        ]}>

          {/* No option */}
          <TouchableOpacity
            style={[isForSale === false && bgOffer, ph8, pv4, br12]}
            onPress={() => setIsForSale(false)}
          >
            <Text style={cTextDark}>
              Non
            </Text>
          </TouchableOpacity>

          {/* Doesn't matter option */}
          <TouchableOpacity
            style={[isForSale === undefined && bgOffer, ph8, pv4, br12]}
            onPress={() => setIsForSale(undefined)}
          >
            <Text style={cTextDark}>
              Peu importe
            </Text>
          </TouchableOpacity>

          {/* Yes option */}
          <TouchableOpacity
            style={[isForSale === true && bgOffer, ph8, pv4, br12]}
            onPress={() => setIsForSale(true)}
          >
            <Text style={cTextDark}>
              Oui
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Art types */}
      <View style={[displayFlex, flexRow, mv24, { flexWrap: 'wrap' }]}>
        {/* Filter list */}
        { filters.map((filter: ArtTypeFilter) => (
          <TouchableOpacity
            key={filter.category.toString()}
            style={[
              br50, ph24, pv8, mv4, mh4,
              { backgroundColor: filter.category === selectedFilter ? colors.offerBg : colors.disabledBg }
            ]}
            onPress={() => setSelectedFilter(
              (c) => c === filter.category ? undefined : filter.category)
            }
          >
            <Text style={{
              fontSize: 14,
              color: filter.category === selectedFilter ? colors.offerFg : colors.textDark
            }}>
              { filter.category }
            </Text>
          </TouchableOpacity>
        )) }
      </View>

      { !!selectedFilter && (
        <Card style={[mh4]}>
          <Subtitle style={[cTextDark, mb8]}>
            Sous-catégories
          </Subtitle>

          <View style={[flexRow, { flexWrap: 'wrap' }, pv0, ph0]}>
            { getFilterSubfilters(selectedFilter).map((subfilter: string) => (
              <TouchableOpacity
                key={subfilter}
                style={[
                  mh4, ph24, br50, pv8,
                  selectedSubFilter === subfilter && bgOffer
                ]}
                onPress={() => setSelectedSubFilter(
                  (c) => c === subfilter ? undefined : subfilter)
                }
              >
                <Text
                  key={subfilter}
                  style={selectedSubFilter === subfilter ? { color: colors.offerFg } : cTextDark }
                >
                  { subfilter }
                </Text>
              </TouchableOpacity>
            )) }
          </View>
        </Card>
      ) }

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
    marginHorizontal: 24,
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
  filterText: {
    color: colors.textDark,
    fontSize: 14
  },
  subFilterTouchableOpacity: {
    padding: 11,

  },
  subFilterList: {
    backgroundColor: colors.white,
    marginHorizontal: 12,
    borderRadius: 12,
    marginLeft: 30,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
    color: colors.darkGreyBg,
    marginLeft: 12
  }
});


export default SearchScreen;
