import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Login from "../Screens/Account/Login";
import Register from "../Screens/Account/Register";
import { navOptionHandler } from "./Stacks";
// import Home from "../Screens/Home";

const authStack = createStackNavigator(
  {
    // Home: {
    //   screen: Home,
    //   navigationOptions: navOptionHandler,
    // },

    Login: {
      screen: Login,
      navigationOptions: navOptionHandler,
    },
    Register: {
      screen: Register,
      navigationOptions: navOptionHandler,
    },
  },
  { initialRouteName: "Login" }
);

export default authStack;
