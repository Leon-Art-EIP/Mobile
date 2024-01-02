import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Conversation from "../screens/Conversation";
import InboxScreen from "../screens/InboxScreen";
import SingleOrder from "../screens/SingleOrder";
import OtherProfile from "../screens/OtherProfile";


const MessageNavigator = () => {
  // disables header for this Navigator
  const options = { headerShown: false };
  const Stack = createNativeStackNavigator();


  return (
    <Stack.Navigator>

      <Stack.Screen
        name="inbox"
        component={InboxScreen}
        options={options}
      />

      <Stack.Screen
        name="single_conversation"
        component={Conversation}
        options={options}
      />

      <Stack.Screen
        name="single_order"
        component={SingleOrder}
        options={options}
      />

      <Stack.Screen
        name="single_profile"
        component={OtherProfile}
        options={options}
      />

    </Stack.Navigator>
  );
}

export default MessageNavigator;
