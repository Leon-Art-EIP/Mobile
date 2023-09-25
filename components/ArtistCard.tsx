// import {NewsType} from "../constants/homeValues";
// import {Image, StyleSheet, View, TouchableOpacity} from "react-native";
// import Card from "./Card";
// import Title from "./Title";
// import colors from "../constants/colors";

// interface ArtistCardProps {
//   onPress?: () => void;
// }

// const ArtistCard = ({
//   onPress = () => {},
//   style = {},
//   value = "Click here",
//   textStyle = {},
//   secondary = false,
//   tertiary = false,
//   disabled = false
// }: ArtistCardProps) => (
//   <TouchableOpacity
//     accessibilityRole="button"
//     onPress={onPress}
//     disabled={disabled}
//     style={[
//       styles.primaryContainerStyle,
//       secondary && styles.secondaryContainerStyle,
//       tertiary && styles.tertiaryContainerStyle,
//       style
//     ]}
//   >
//     <Text style={[
//       styles.primaryTextStyle,
//       secondary && styles.secondaryTextStyle,
//       tertiary && styles.tertiaryTextStyle,
//       textStyle
//     ]}>
//       { value }
//     </Text>
//   </TouchableOpacity>
// )
// const ArtistCard = ({ item, path }: ArtistCardProps) => {
//   const handleClick = () => {
//     if (path) {
//       // Rediriger vers l'autre page
//       // Par exemple, en utilisant React Navigation :
//       // navigation.navigate('ArtistDetails', {
//       //   artist: item,
//       // });
//     } else {
//       // Appeler la fonction onPress
//       onPress();
//     }
//   };

//   return (
//     <Card style={styles.container} onPress={handleClick}>
//       <Image style={styles.image} />
//       <Title size={18} style={{ marginTop: 'auto', color: '#fff' }}>{item.title}</Title>
//     </Card>
//   );
// };

// // const ArtistCard = (
// //   item: NewsType, path: string) => (
// //     <Card style={styles.container}>
// //       <Image style={styles.image} />
// //         <Title size={18} style={{ marginTop: 'auto', color: '#fff' }}>{ item.title }</Title>
// //     </Card>
// // );

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.sampleBg,
//     margin: 0,
//     width: 120,
//     height: 150,
//     position: "relative"
//   },
//   image: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: 120,
//     height: 120
//   }
// });

// export default ArtistCard;

/////////////////////////////////////////////////

import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import colors from '../constants/colors';
import {NewsType} from "../constants/homeValues";
import Card from "./Card";
import Title from "./Title";

interface ArtistCardProps {
  onPress?: () => void;
  item: NewsType;
  path: string;
}

const ArtistCard = ({
  onPress = () => {},
  item,
  path,
}: ArtistCardProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    onPress={onPress}
  >
    <Card style={styles.container}>
      <Image style={styles.image} />
      <Title size={18} style={{ marginTop: 'auto', color: '#fff' }}>{ item.title }</Title>
    </Card>
  </TouchableOpacity>
)

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
export type { ArtistCardProps };
