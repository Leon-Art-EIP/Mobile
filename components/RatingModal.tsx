import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


type RatingModalProps = {
  isDisplayed: boolean;
  setDisplayed: (e: boolean) => void;
  setRating: (e: number) => void;
};


const RatingModal = ({
  isDisplayed = false,
  setDisplayed = () => {},
  setRating = () => {},
}: RatingModalProps) => {
  return (
    <SafeAreaView>

    </SafeAreaView>
  )
}


export default RatingModal;
