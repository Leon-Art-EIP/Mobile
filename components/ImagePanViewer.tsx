import React, { useRef } from "react"
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Animated, Dimensions, Image, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";


const NOT_FOUND = "https://qph.cf2.quoracdn.net/main-qimg-1a4bafe2085452fdc55f646e3e31279c-lq";


type ImagePanViewerProps = {
  source: string | undefined;
  style?: StyleProp<ViewStyle>;
};


const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max);
}

const { width, height } = Dimensions.get('screen');


const ImagePanViewer = ({
  style = {},
  source = undefined
}: ImagePanViewerProps) => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  const pan = Gesture.Pan()
  .minDistance(1)
  .onStart(() => {
    prevTranslationX.value = translationX.value;
    prevTranslationY.value = translationY.value;
  })
  .onUpdate((event) => {
    const maxTranslateX = width / 2 - 50;
    const maxTranslateY = height / 2 - 50;

    translationX.value = clamp(
      prevTranslationX.value + event.translationX,
      -maxTranslateX,
      maxTranslateX
    );
    translationY.value = clamp(
      prevTranslationY.value + event.translationY,
      -maxTranslateY,
      maxTranslateY
    );
  })
  .runOnJS(true);


  return (
    <GestureDetector
      gesture={Gesture.Pan()}
    >
      <Animated.View style={[
        style,
        animatedStyles,
      ]}>
        <Image
          source={{ uri: source ?? NOT_FOUND }}
          style={styles.image}
        />
      </Animated.View>
    </GestureDetector>
  )
}


const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%'
  }
});


export default ImagePanViewer;
