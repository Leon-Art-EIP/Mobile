import Recat from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
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
const ml4: StyleProp<any> = { marginLeft: 4 };
const ml8: StyleProp<any> = { marginLeft: 8 };
const mr4: StyleProp<any> = { marginRight: 4 };
const mr8: StyleProp<any> = { marginRight: 8 };

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

// text
const fwBold: StyleProp<TextStyle> = { fontWeight: 'bold' };
const fwNormal: StyleProp<TextStyle> = { fontWeight: 'normal' };

// background color
const bgColor: StyleProp<any> = { backgroundColor: colors.bg };
const bgRed: StyleProp<any> = { backgroundColor: '#f00' };
const bgGrey: StyleProp<any> = { backgroundColor: colors.disabledBg };

export {
  flexRow,
  displayFlex,
  flex1,
  mlAuto,
  mrAuto,
  mtAuto,
  mbAuto,
  noVMargin,
  noMargin,
  noHMargin,
  noHPadding,
  noVPadding,
  noPadding,
  p4,
  p8,
  pt4,
  pt8,
  pb4,
  pb8,
  pl4,
  pl8,
  pr4,
  pr8,
  m4,
  m8,
  mt4,
  mt8,
  mb4,
  mb8,
  ml4,
  ml8,
  mr4,
  mr8,
  fwBold,
  fwNormal,
  bgColor,
  bgRed,
  bgGrey
};
