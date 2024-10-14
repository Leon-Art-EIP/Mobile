import Recat from 'react';
import { ImageStyle, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import colors from './colors';

/*
  * This file offers many pre-written styles you can import directly
  * instead of writing it by yourself everytime. First time I do this,
  * may or may not be useful. We'll see.
*/

// flex boxes
const flexRow: StyleProp<ViewStyle> = { flexDirection: 'row' };
const displayFlex: StyleProp<ViewStyle> = { display: 'flex' };
const flex1: StyleProp<any> = { flex: 1 };

// align and justify
const asCenter: StyleProp<any> = { alignSelf: 'center' };
const acCenter: StyleProp<any> = { alignContent: 'center' };
const aiCenter: StyleProp<any> = { alignItems: 'center' };
const jcCenter: StyleProp<any> = { justifyContent: 'center' };
const jcStart: StyleProp<any> = { justifyContent: 'start' };
const jcEnd: StyleProp<any> = { justifyContent: 'end' };
const jcSA: StyleProp<any> = { justifyContent: 'space-around' };

// margins
const mlAuto: StyleProp<any> = { marginLeft: 'auto' };
const mrAuto: StyleProp<any> = { marginRight: 'auto' };
const mtAuto: StyleProp<any> = { marginTop: 'auto' };
const mbAuto: StyleProp<any> = { marginBottom: 'auto' };
const noVMargin: StyleProp<any> = { marginVertical: 0 };
const noHMargin: StyleProp<any> = { marginHorizontal: 0 };
const noMargin: StyleProp<any> = { margin: 0 };
const m4: StyleProp<any> = { margin: 4 };
const m8: StyleProp<any> = { margin: 8 };
const mt4: StyleProp<any> = { marginTop: 4 };
const mt8: StyleProp<any> = { marginTop: 8 };
const mb4: StyleProp<any> = { marginBottom: 4 };
const mb8: StyleProp<any> = { marginBottom: 8 };
const mb24: StyleProp<any> = { marginBottom: 24 };
const ml0: StyleProp<any> = { marginLeft: 0 };
const ml4: StyleProp<any> = { marginLeft: 4 };
const ml8: StyleProp<any> = { marginLeft: 8 };
const mr0: StyleProp<any> = { marginRight: 0 };
const mr4: StyleProp<any> = { marginRight: 4 };
const mr8: StyleProp<any> = { marginRight: 8 };
const mr20: StyleProp<any> = { marginRight: 20 };
const mh0: StyleProp<any> = { marginHorizontal: 0 };
const mh4: StyleProp<any> = { marginHorizontal: 4 };
const mh8: StyleProp<any> = { marginHorizontal: 8 };
const mh24: StyleProp<any> = { marginHorizontal: 24 };
const mv0: StyleProp<any> = { marginVertical: 0 };
const mv4: StyleProp<any> = { marginVertical: 4 };
const mv8: StyleProp<any> = { marginVertical: 8 };
const mv24: StyleProp<any> = { marginVertical: 24 };

// paddings
const noHPadding: StyleProp<any> = { paddingHorizontal: 0 };
const noVPadding: StyleProp<any> = { paddingVertical: 0 };
const noPadding: StyleProp<any> = { padding: 0 };
const p4: StyleProp<any> = { padding: 4 };
const p8: StyleProp<any> = { padding: 8 };
const pt4: StyleProp<any> = { paddingTop: 4 };
const pt8: StyleProp<any> = { paddingTop: 8 };
const pb4: StyleProp<any> = { paddingBottom: 4 };
const pb8: StyleProp<any> = { paddingBottom: 8 };
const pl4: StyleProp<any> = { paddingLeft: 4 };
const pl8: StyleProp<any> = { paddingLeft: 8 };
const pr4: StyleProp<any> = { paddingRight: 4 };
const pr8: StyleProp<any> = { paddingRight: 8 };
const ph0: StyleProp<any> = { paddingHorizontal: 0 };
const ph4: StyleProp<any> = { paddingHorizontal: 4 };
const ph8: StyleProp<any> = { paddingHorizontal: 8 };
const ph24: StyleProp<any> = { paddingHorizontal: 24 };
const pv0: StyleProp<any> = { paddingVertical: 0 };
const pv4: StyleProp<any> = { paddingVertical: 4 };
const pv8: StyleProp<any> = { paddingVertical: 8 };
const pv24: StyleProp<any> = { paddingVertical: 24 };

// text
const fwBold: StyleProp<TextStyle> = { fontWeight: 'bold' };
const fwNormal: StyleProp<TextStyle> = { fontWeight: 'normal' };
const taCenter: StyleProp<TextStyle> = { textAlign: 'center' };
const tavCenter: StyleProp<TextStyle> = { textAlignVertical: 'center' };
const taJustify: StyleProp<TextStyle> = { textAlign: 'justify' };
const taAuto: StyleProp<TextStyle> = { textAlign: 'auto' };
const taLeft: StyleProp<TextStyle> = { textAlign: 'left' };
const taRight: StyleProp<TextStyle> = { textAlign: 'right' };

// background color
const bgColor: StyleProp<any> = { backgroundColor: colors.bg };
const bgRed: StyleProp<any> = { backgroundColor: '#f00' };
const bgGrey: StyleProp<any> = { backgroundColor: colors.disabledBg };
const bgPlatinium: StyleProp<any> = { backgroundColor: colors.platinium };
const bgDisabled: StyleProp<any> = { backgroundColor: colors.disabledBg };
const bgOffer: StyleProp<any> = { backgroundColor: colors.offerBg };

// color
const cBlack: StyleProp<any> = { color: colors.black };
const cPrimary: StyleProp<any> = { color: colors.primary };
const cWhite: StyleProp<any> = { color: colors.white };
const cText: StyleProp<any> = { color: colors.text };
const cTextDark: StyleProp<any> = { color: colors.textDark };
const cDisabled: StyleProp<any> = { color: colors.disabledFg };
const cOffer: StyleProp<any> = { color: colors.offerFg };

// border radius
const br0: StyleProp<any> = { borderRadius: 0 };
const br5: StyleProp<any> = { borderRadius: 5 };
const br7: StyleProp<any> = { borderRadius: 7 };
const br12: StyleProp<any> = { borderRadius: 12 };
const br20: StyleProp<any> = { borderRadius: 20 };
const br50: StyleProp<any> = { borderRadius: 50 };


// Aspect
const aspVideo: StyleProp<any> = { aspectRatio: '16/9' };
const aspSquare: StyleProp<any> = { aspectRatio: '1/1' };
const aspImage: StyleProp<any> = { aspectRatio: '4/3' };

export {
  flexRow,
  displayFlex,
  flex1,
  asCenter, acCenter, aiCenter,
  jcEnd, jcCenter, jcStart, jcSA,
  mlAuto, mrAuto, mtAuto, mbAuto,
  noVMargin, noMargin, noHMargin,
  noHPadding, noVPadding, noPadding,
  p4, p8, pt4, pt8, pb4, pb8, pl4, pl8, pr4, pr8,
  pv0, pv4, pv8, pv24, ph0, ph4, ph8, ph24,
  m4, m8, mt4, mt8, mb4, mb8, mb24, ml0, ml4, ml8, mr0, mr4, mr8, mr20,
  mv0, mv4, mv8, mv24, mh0, mh4, mh8, mh24,
  fwBold, fwNormal, taCenter, taAuto, taRight, taJustify, taLeft, tavCenter,
  bgColor, bgRed, bgGrey, bgPlatinium, bgDisabled, bgOffer,
  br0, br5, br7, br12, br20, br50,
  cBlack, cWhite, cPrimary, cDisabled, cText, cTextDark, cOffer,
  aspVideo, aspSquare, aspImage
};
