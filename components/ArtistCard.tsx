import {NewsType} from "../constants/homeValues";
import {Image, StyleSheet, View} from "react-native";
import Card from "./Card";
import Title from "./Title";
import colors from "../constants/colors";

const ArtistCard = (item: NewsType) => (
  <Card style={styles.container}>
    <Image style={styles.image} />
      <Title size={18} style={{ marginTop: 'auto', color: '#fff' }}>{ item.title }</Title>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.sampleBg,
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