import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, AsyncStorage } from "react-native";
import {
  Container,
  Content,
  ListItem,
  Text,
  Icon,
  Body,
  Right,
} from "native-base";
import { Badge } from "react-native-elements";
import API from "../Lib/utils/db";

const { height } = Dimensions.get("window");

export default function PortalForm({ navigation }) {
  // const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  // const [txt, setTxt] = useState();
  // const [destino, setDestino] = useState();
  // const [idPedido, setIdPedido] = useState();

  const [data, setData] = useState([]);

  const changePoppop = () => {
    setIsVisibleLoading(false);
  };

  const getIdpedido = async () => {
    // const id_user = await AsyncStorage.getItem("id_user");
    const response = await API.get(`orders/?ordering=-id&format=json`);
    const resUser = response.data;
    setData(resUser); // Logs
  };
  //getIdpedido();

  useEffect(() => {
    //console.log("Valor del popup: ", isVisibleLoading)
    //if (!isVisibleLoading) {
    const interval = setInterval(() => {
      getIdpedido();
    }, 900);
    return () => clearInterval(interval);
    //}
  }, []);

  const HandleSeguimiento = (id) => {
    //console.log("Hizo clic");
    navigation.navigate("Estado", {
      Pedido: id,
    });
  };
  return (
    <Container>
      <Content>
        {/* {
          <Popup
            text={txt}
            isVisible={isVisibleLoading}
            changedEst={changePoppop}
            idPedido={idPedido}
          />
        } */}
        {data.map((datos) => (
          <ListItem key={datos.id} onPress={() => HandleSeguimiento(datos.id)}>
            <Body>
              <Text>Desde: {datos.emision}</Text>
              <Text>Destino: {datos.destino}</Text>
              <Text>Teléfono: {datos.telealt}</Text>
            </Body>
            <Right>
              {datos.estado == 7 && (
                <Badge status="success" value="Finalizado" />
              )}
              {datos.estado == 8 && <Badge status="error" value="Cancelado" />}
              {(datos.estado == 9 || datos.estado == 3) && (
                <Badge status="warning" value="En espera" />
              )}
              {datos.estado == 6 && <Badge status="primary" value="En ruta" />}
              {datos.estado == 4 && (
                <Badge status="primary" value="Confirmado" />
              )}
              {datos.estado == 5 && (
                <Badge status="primary" value="En camino" />
              )}
              {/* <Text>{datos.estado}</Text> */}

              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        ))}
      </Content>
    </Container>
  );
}
const styles = StyleSheet.create({
  input: {
    marginTop: 20,
  },
  form: {
    marginTop: 40,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 90,
    marginTop: 100,
    height: 200,
    width: 200,
  },

  butt: {
    marginTop: 30,
    alignItems: "center",
    color: "#FFFFFF",
    fontSize: 15,
  },
  txt: {
    marginTop: 20,
    color: "#FFFFFF",
    alignItems: "center",
    fontSize: 18,
  },
});
