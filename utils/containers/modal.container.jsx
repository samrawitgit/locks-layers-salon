import React from "react";
import { Button, Dialog, Modal, Portal, Text } from "react-native-paper";
import { ScrollView, View } from "react-native";

const ModalContext = React.createContext(null);

function ModalProvider({ children, containerStyle = {} }) {
  const [state, setState] = React.useState({
    show: false,
    title: "",
    content: null,
    secondScrollView: false,
    onDismissModal: () => {},
    style: {},
    dismissable: true,
  });

  const show = ({
    title,
    content,
    secondScrollView = false,
    onDismissModal = () => {},
    style = {},
    dismissable = true,
  }) => {
    setState({
      show: true,
      title,
      content,
      secondScrollView,
      onDismissModal,
      style,
      dismissable,
    });
  };

  const hide = () => {
    setState({
      show: false,
      title: "",
      content: null,
      secondScrollView: false,
      onDismissModal: () => {},
      style: {},
      dismissable: true,
    });
  };

  if (Object.keys(containerStyle).length != 0) {
    // extract width values
  }

  return (
    <ModalContext.Provider value={{ showModal: show, hideModal: hide, state }}>
      {children}
      {state.show && state.secondScrollView && (
        <Dialog
          className="modal-modal"
          visible={state.show}
          onDismiss={hide}
          dismissable={state.dismissable}
          style={{
            height: "60vh",
            width: "70vw",
            left: "9vw",
            display: "grid",
            gridTemplateAreas: `"title title " "title1 title2" "scroll1 scroll2" ". footer"`,
            justifyContent: "space-evenly",
            justifyItems: "center",
          }}
        >
          <Dialog.Title style={{ gridArea: "title" }}>
            {state.title}
          </Dialog.Title>
          <Dialog.Title style={{ gridArea: "title1" }}>
            {state.content.title}
          </Dialog.Title>
          {state.secondScrollView && (
            <Dialog.Title style={{ gridArea: "title2" }}>
              {state.secondScrollView.title}
            </Dialog.Title>
          )}
          <Dialog.ScrollArea style={{ gridArea: "scroll1" }}>
            <ScrollView>
              <Dialog.Content>{state.content.content}</Dialog.Content>
            </ScrollView>
          </Dialog.ScrollArea>
          {state.secondScrollView && (
            <Dialog.ScrollArea style={{ gridArea: "scroll2" }}>
              <ScrollView>
                <Dialog.Content>
                  {state.secondScrollView.content}
                </Dialog.Content>
              </ScrollView>
            </Dialog.ScrollArea>
          )}
          <Dialog.Actions style={{ gridArea: "footer", justifySelf: "end" }}>
            <Button
              onPress={() => {
                hide();
                state.onDismissModal();
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      )}
      {state.show && !state.secondScrollView && (
        <Dialog
          className="modal-modal"
          visible={state.show}
          onDismiss={hide}
          dismissable={state.dismissable}
          style={{
            ...state.style,
            width: "70vw",
            left: "9vw",
            justifyContent: "center",
          }}
        >
          <Dialog.Title>{state.title}</Dialog.Title>
          <Dialog.Content>{state.content}</Dialog.Content>
          <Dialog.Actions style={{ gridArea: "footer", justifySelf: "end" }}>
            <Button
              onPress={() => {
                hide();
                state.onDismissModal();
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      )}
      {/* <Modal
          className="modal-modal"
          visible={state.show}
          onDismiss={hide}
          contentContainerStyle={{
            boxShadow: "none",
            height: "10vh",
            width: "70vw",
            ...containerStyle,
          }}
          style={{
            height: "10vh",
            width: "70vw",
            backgroundColor: "rgb(231, 224, 236)",
            left: "15vw",
            top: "10vh",
          }}
        > */}
    </ModalContext.Provider>
  );
}

export { ModalContext, ModalProvider };
