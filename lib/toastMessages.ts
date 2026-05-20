import Toast from "react-native-toast-message";

const toastMessage = (message: string, type: string) => {
  switch (type) {
    case "success":
      Toast.show({
        type: "success",
        text1: message,
        position: "bottom",
        visibilityTime: 2000,
      });
      break;
    case "error":
      Toast.show({
        type: "error",
        text1: message,
        position: "bottom",
        visibilityTime: 2000,
      });
      break;
    default:
      Toast.show({
        type: "error",
        text1: "An unknown error occurred.",
        position: "bottom",
        visibilityTime: 2000,
      });
  }
};

export default toastMessage;
