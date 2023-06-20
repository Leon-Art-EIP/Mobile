import {NewsType} from "../constants/homeValues";
import {Image, StyleSheet, View} from "react-native";
import Card from "./Card";
import Title from "./Title";

const ArtistCard = (item: NewsType) => (
  <Card style={styles.container}>
    <Image style={styles.image} />
    <View>
      <Title>{ item.title }</Title>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F00',
    margin: 0,
    width: 120,
    height: 150,
    position: "relative"
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 120,
    height: 120
  }
});

export default ArtistCard;