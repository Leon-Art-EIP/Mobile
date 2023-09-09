import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import InboxScreen from "../screens/InboxScreen";

const MessageNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this Navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="conversations" component={InboxScreen} options={options} />
      {/* <Stack.Screen */}
      {/*   name="conversation" */}
      {/*   component={ConversationScreen} */}
      {/*   options={options} */}
      {/* /> */}
    </Stack.Navigator>
  );
}

export default MessageNavigator;