import React, { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
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
import API from "../../Lib/utils/db";
import CustomHeader from "../CustomHeader";

export default function MisViajes({ navigation }) {
  const [data, setData] = useState([]);
  const getIdpedido = async () => {
    const id_user = await AsyncStorage.getItem("id_user");

    const response = await API.get(
      `orders/?search=${id_user}&estado=7&format=json`
    );
    setData(response.data); // Logs
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getIdpedido();
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <CustomHeader
        navigation={navigation}
        title="Mis viajes"
        isHome={false}
        isLogin={false}
      />
      <Content>
        {data.map((datos) => (
          <ListItem>
            <Body>
              <Text>Destino:{datos.destino}</Text>
              <Text>Costo: {datos.precio}</Text>
            </Body>
            <Right>
              <Badge status="success" value="Finalizado" />
            </Right>
          </ListItem>
        ))}
      </Content>
    </Container>
  );
}
