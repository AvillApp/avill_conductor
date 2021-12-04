import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, AsyncStorage } from "react-native";
import Timeline from "react-native-timeline-flatlist";
import {
  Container,
  Card,
  CardItem,
  Text,
  Body,
  Divider,
  Picker,
} from "native-base";
import { Rating, AirbnbRating } from "react-native-ratings";
import CustomHeader from "../CustomHeader";
import Popup from "../../Lib/plug/Popup";
import { ICONOS } from "../../Constans/imagenes";
// import { api } from "../../Lib/utils/db";
import API from "../../Lib/utils/db";
// import MapScreen from "./Maps";
import StepIndicator from "react-native-step-indicator";
import { Avatar, List } from "react-native-paper";

export default function Estado({ navigation }) {
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [txt, setTxt] = useState();
  // const [currentPosition, setcurrentPosition] = useState(2);
  const Direccion = navigation.getParam("Direccion");
  const id_pedido = navigation.getParam("Pedido");

  const [infoViaje, setInfoViaje] = useState({
    cliente: "",
    creado: "",
    emision: "",
    direccion: "",
    observacion: "",
    telefono: "",
    precio: "",
    tokenPush: "",
    conductor: "",
    id: "",
  });
  const [conductor, setConductor] = useState({
    nombre: "",
    id: "",
  });
  const [seguimiento, setSeguimiento] = useState(1); // Estado en espera
  const [seguiEstado, setSeguiEstado] = useState();

  //const title = "" + Direccion;
  const title = "Seguimiento de viaje";
  //console.log("Id de Pedido: ", navigation.getParam("Pedido"));

  const infoPedido = async (id) => {
    const response = await API.get(`orders/${id}/?format=json`);
    return response.data;
  };

  const Changed2Estado = async (est) => {
    setSeguiEstado(est);
    const pedido_change = {
      estado: est,
    };
    // console.log(pedido_change);
    const response = await API.put(`ordersup/${id_pedido}/`, pedido_change);
    let msg;
    if (est === 5) msg = "Conductor en camino";
    if (est === 6) msg = "En ruta del viaje";
    if (est === 7) msg = "Viaje finalizado, te esperamos pronto";
    NotifiyPush(infoViaje.tokenPush, msg);

    //console.log("resultado: ", response.data);
  };

  const NotifiyPush = async (tokenPush, body) => {
    // console.log("Ingresó aquí");
    // console.log("Token del conductor: ", tokenPush);
    const message = {
      to: tokenPush,
      sound: "default",
      title: "Avill",
      body: body,
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };
  // Para mostrar los logs y saber el estado del pedido
  const getInfo = async () => {
    //const id_pedido = await AsyncStorage.getItem("id_pedido");

    if (id_pedido) {
      const resUser = await infoPedido(id_pedido);
      const accountUser = await API.get(
        `accounts/${resUser.account}/?format=json`
      );
      // console.log(accountUser.data.tokenPush);

      if (infoViaje.creado === "") {
        setInfoViaje({
          cliente: resUser.account,
          creado: resUser.created,
          emision: resUser.emision,
          direccion: resUser.destino,
          observacion: resUser.indicacion,
          telefono: resUser.telealt,
          precio: resUser.precio,
          tokenPush: accountUser.data.tokenPush,
          id: resUser.id,
        });
        if (resUser.vehiculo !== null) {
          if (conductor.nombre === "") {
            setConductor({
              id: resUser.vehiculo.persona.id,
            });
          }
        }
      }
      // console.log("estado: ", resUser.estado);
      if (resUser.estado === 7 || resUser.estado === 8) {
        // Finalizado o cancelado
        // Viaje finalizaado
        setSeguimiento(5);
        setIsVisibleLoading(false);
        await AsyncStorage.removeItem("id_pedido");

        const data = await API.get(
          `ratting/order/?pedido=${id_pedido}&format=json`
        );
        //console.log("Info: de califiación pedido: ", data.data);

        if (data.data[0].puntos > 0) {
          setPuntos(data.data.puntos);
          setDisableRatting(true);
        }
      }
      if (resUser.estado === 6)
        // En viaje
        setSeguimiento(4);
      if (resUser.estado === 5)
        // En camino
        setSeguimiento(3);

      if (resUser.estado === 4) {
        // Confirmado
        setSeguimiento(2);
        setIsVisibleLoading(false);

        // Mandar notificación al cliente
      }
      if (resUser.estado === 3) {
        // En espera
        setSeguimiento(1);
        setIsVisibleLoading(true);
        setTxt(
          "¿Aceptar pedido? \n \n Destino:" +
            resUser.destino +
            "\n Indicacion: " +
            resUser.indicacion
        );
      }

      if (resUser.estado === 9) setIsVisibleLoading(false);
    }
  };

  // Para actualizar el estado de lo que va ocurriendo en el pedido.
  useEffect(() => {
    const interval = setInterval(() => {
      getInfo();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const labels = [
    "Solicitado",
    "Confirmado",
    "En camino",
    "Viajando",
    "Finalizado",
  ];
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: "#fe7013",
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: "#fe7013",
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: "#fe7013",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "#fe7013",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: "#fe7013",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: "#fe7013",
  };

  const [expanded, setExpanded] = useState(true);
  const [expanded2, setExpanded2] = useState(true);

  const handlePress = () => setExpanded(!expanded);
  const handlePress2 = () => setExpanded2(!expanded2);

  const [puntos, setPuntos] = useState(5);
  const [disableRatting, setDisableRatting] = useState(false);

  const ValuePuntos = (ratting) => {
    setPuntos(ratting);
  };

  const Calificar = async () => {
    const payloadAccount = {
      puntos: puntos,
      account: infoViaje.id,
      realizado_by: conductor.id,
    };

    // Registramos calificació al conductor
    await API.post(`ratting/account/`, payloadAccount);

    setDisableRatting(true);

    if (infoViaje.tokenPush !== "")
      NotifiyPush(
        infoViaje.tokenPush,
        "El conductor te ha calificado, esperamos que vuelvas!"
      );
    navigation.popToTop();
  };

  return (
    <Container style={{ flex: 1 }}>
      <CustomHeader
        navigation={navigation}
        title={title}
        isHome={false}
        isLogin={false}
      />
      <Popup
        text={txt}
        isVisible={isVisibleLoading}
        pedido={id_pedido}
        tokenPush={infoViaje.tokenPush}
        NotifiyPush={NotifiyPush}
      />
      <List.Section>
        <List.Accordion
          title="Info. del viaje"
          left={(props) => <List.Icon {...props} icon="folder" />}
          expanded={expanded}
          onPress={handlePress}
        >
          <Text>Cliente: {infoViaje.cliente}</Text>
          <Text>Creado el: {infoViaje.creado}</Text>
          <Text>Desde: {infoViaje.emision}</Text>
          <Text>Hacia: {infoViaje.direccion}</Text>
          <Text>Observación: {infoViaje.observacion}</Text>
          <Text>Telefono alternativo: {infoViaje.telefono}</Text>
        </List.Accordion>

        <List.Accordion
          title="Seguimiento"
          left={(props) => <List.Icon {...props} icon="folder" />}
          expanded={expanded2}
          onPress={handlePress2}
        >
          <StepIndicator
            customStyles={customStyles}
            currentPosition={seguimiento}
            labels={labels}
          />
        </List.Accordion>

        {seguimiento >= 2 && seguimiento <= 4 && (
          <View>
            <Text>{"\n Estado de viaje"}</Text>
            <Picker
              mode="dropdown"
              style={{ marginLeft: 10, width: 150 }}
              selectedValue={seguiEstado}
              onValueChange={(itemValue, itemIndex) =>
                Changed2Estado(itemValue)
              }
            >
              <Picker.Item key="0" label="Seleccione estado" value="0" />

              <Picker.Item key="1" label="En camino" value="5" />
              <Picker.Item key="2" label="Viajando" value="6" />
              <Picker.Item key="3" label="Finalizado" value="7" />
            </Picker>
          </View>
        )}
        {seguimiento === 5 && (
          <View style={styles.butt}>
            <AirbnbRating
              count={5}
              reviews={["Muy Mal", "Mal", "Regular", "Bien", "Excelente"]}
              defaultRating={puntos}
              size={20}
              isDisabled={disableRatting}
              onFinishRating={ValuePuntos}
            />
            <Text>{"\n"}</Text>
            {disableRatting === false && (
              <AppButton action={Calificar} title="Calificar Servicio" />
            )}
          </View>
        )}
      </List.Section>
    </Container>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  logo: {
    height: 64,
    width: 64,
  },
  conductor: {
    alignContent: "flex-end",
    justifyContent: "flex-end",
  },
  butt: {
    marginTop: 30,
    alignItems: "center",
    color: "#FFFFFF",
    fontSize: 15,
  },
});
