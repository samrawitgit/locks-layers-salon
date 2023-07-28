import React from "react";
import { Platform } from "react-native";
import { useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { useHttpClient } from "../hooks/httpClient";

const AuthContext = React.createContext(null);

const TOKEN_KEY = "my_jwt";

// This hook will protect the route access based on user authentication.
// function useProtectedRoute(authenticated) {
//   const segments = useSegments();
//   const router = useRouter();

//   React.useEffect(() => {
//     const inAuthGroup = segments[0] === "(auth)";

//     if (
//       // If the user is not signed in and the initial segment is not anything in the auth group.
//       !authenticated &&
//       !inAuthGroup
//     ) {
//       // Redirect to the Login page.
//       router.replace("/login");
//     } else if (authenticated && inAuthGroup) {
//       // Redirect away from the Login page.
//       router.replace("/");
//     }
//   }, [authenticated, segments]);

//   return { router };
// }

function AuthProvider(props) {
  const [authState, setAuthState] = React.useState({
    token: null,
    authenticated: null,
    currentUser: null,
  });
  const { isLoading, setIsLoading, error, sendRequest, clearError } =
    useHttpClient();

  const router = useRouter();
  // console.log({ authState });

  // useProtectedRoute(authState.authenticated);

  React.useEffect(() => {
    // router.replace("/login");
    setIsLoading(true); // activate Loading screed
    let token;
    let expiryDate;
    let userId;

    if (["ios", "android"].includes(Platform.OS)) {
      SecureStore.getItemAsync("userId").then((res) => {
        console.log({ res });
        if (!res) {
          router.push("/login");
        }
        userId = res; //TODO: check it works
      });
      SecureStore.getItemAsync(TOKEN_KEY).then((res) => {
        console.log({ res });
        token = res; //TODO: check it works
      });

      // OLD FOR REFERENCE
      // const loadToken = async () => {
      //   const token = await SecureStore.getItemAsync(TOKEN_KEY);
      //   if (token) {
      //     setAuthState({ token: token, authenticated: true });
      //     router.replace("/");
      //   } else {
      //     router.replace("/login");
      //   }
      //   setIsLoading(false);
      // };
      // loadToken();
    } else {
      token = localStorage.getItem("token");
      expiryDate = localStorage.getItem("expiryDate"); //TODO: check expiry
      userId = localStorage.getItem("userId");
      if (!token || !userId) {
        router.push("/login");
      }
    }

    if (userId) {
      sendRequest(`/auth/user/${userId}`, "GET").then(({ data }) => {
        console.log({ data });
        if (token) {
          setAuthState({
            token: token,
            authenticated: true,
            currentUser: data.userData,
          });
          router.replace("/");
        } else {
          router.replace("/login");
        }
        setIsLoading(false);
      });
    }
  }, []);

  const login = async (email, password) => {
    console.log(email, password, { os: Platform.OS });
    if (!email || !password) {
      return { error: true, msg: "Enter valid credentials!" };
      // throw new Error("enter data you shmuck");
      // showPopUp({
      //   title: "Wrong credentials",
      //   content: "Insert valid credentials",
      // });
      // return;
    }
    try {
      const resData = await sendRequest(
        "/auth/login",
        "POST",
        {
          email: email,
          password: password,
        },
        {
          "Content-type": "application/json",
          // Authorization: "Bearer " + this.props.token, //Bearer is a convention
        }
      );
      console.log({ resData });

      // ... // only executes in case of res.ok
      setAuthState({
        token: resData.token,
        authenticated: true,
        currentUser: resData.user,
      });
      if (resData.error) {
        return { error: true, msg: resData.msg };
      }
      if (["ios", "android"].includes(Platform.OS)) {
        const secureStore = await SecureStore.setItemAsync(
          TOKEN_KEY,
          resData.data.token
        );
        console.log({ secureStore });
      } else {
        localStorage.setItem("token", resData.data.token);
        localStorage.setItem("userId", resData.data.user.id);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
      }
      return resData.data;
    } catch (err) {
      console.log(err);
      return { error: true, msg: err.message };
      // throw new Error("failed to authenticate");
      // showPopUp({ title: "Failed to authenticate", content: "try again" });
    }
  };

  const logout = async () => {
    if (["ios", "android"].includes(Platform.OS)) {
      // Delete token from storage
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("userId");
    }
    // Reset auth state
    setAuthState({ token: null, authenticated: false });
    router.replace("/login");
  };

  const register = async (
    name,
    email,
    password,
    confirmPassword,
    tel,
    location
  ) => {
    if (!email || !password || !confirmPassword || !name || !tel || !location) {
      // throw new Error("enter data you shmuck");
      return {
        error: true,
        msg: "Please enter all the data",
        missingData: [
          name,
          email,
          password,
          confirmPassword,
          tel,
          location,
        ].filter((el) => !el),
      };
    }
    try {
      // Check entered data

      const resData = await sendRequest(
        "/auth/signup",
        "POST",
        {
          email: email,
          password: password,
          confirmPassword: confirmPassword,
          name: name,
          tel: tel,
          location: location,
        },
        {
          "Content-type": "application/json",
          // "Authorization": 'Bearer ' + this.props.token //Bearer is a convention
        }
      );
      return resData;
    } catch (err) {
      return { error: true, msg: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register,
        authenticated: authState.authenticated,
        user: authState.currentUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
