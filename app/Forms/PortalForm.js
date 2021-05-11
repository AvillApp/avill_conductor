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
import Push from "../Screens/push";
import { api } from "../Lib/utils/db";
import Popup from "../Lib/plug/Popup";

const { height } = Dimensions.get("window");

export default function PortalForm({ navigation }) {
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [txt, setTxt] = useState();
  const [destino, setDestino] = useState();
  const [idPedido, setIdPedido] = useState();

  const [data, setData] = useState([]);

  const changePoppop = () => {
    setIsVisibleLoading(false)
  }

  const getIdpedido = async () => {


    const id_user = await AsyncStorage.getItem("id_user");
    const ped = await AsyncStorage.getItem("id_pedido");
    let sal=0;
    if(ped){
      if(ped!=undefined)
        navigation.navigate("Estado", { Direccion: destino, idPedido: idPedido });
      else
        sal =1;
    }else
      sal=1;
    
    //console.log("Pedido obenido actual", ped)

    if(sal==1){
      const infoUser = await fetch(
        `${api}pedidos/vehiculo/${id_user}?format=json`
      );
      const resUser = await infoUser.json();
      //console.log(resUser)
      setData(resUser); // Logs
  
      let estado;
      let destino;
      let precio;
      let tiempo;
      let indicacion;
      let pedido;
      resUser.map(dt => {
          estado = dt.estado;
          destino = dt.destino;
          tiempo = dt.tiempo;
          precio = dt.precio;
          indicacion=dt.indicacion;
          pedido = dt.id
      })
      
      if(pedido!=undefined){
  
         //console.log("tiene id  y es", pedido.toString())
         setIdPedido(pedido.toString())
         setDestino(destino)
  
        if(estado==3){
          setIsVisibleLoading(true);
          setTxt(
            "¿Aceptar pedido? \n \n Destino:" +
              destino +
              "\n Precio: " +
              precio +
              "\n Tiempo: " +
              tiempo +
              "\n Indicacion: " +
              indicacion
          );
        }
      }
      //else
      // console.log("No tiene id", pedido)
    }
    
  };
  //getIdpedido();

  useEffect(() => {
    //console.log("Valor del popup: ", isVisibleLoading)
    if (!isVisibleLoading){
      const interval = setInterval(() => {
      //  console.log("Algo jeisson")
          getIdpedido();
         //setIsVisibleLoading(true);
       }, 900);
       return () => clearInterval(interval)
    }
    
  }, [isVisibleLoading]);

  return (
      <Container>
        <Content>
        { <Popup text={txt} isVisible={isVisibleLoading} changedEst={changePoppop} idPedido={idPedido} /> }
          {data.map((datos) => 
            (  
          <ListItem key={datos.id}>
              <Body>
                <Text>{datos.vehiculo.placa}</Text>
                <Text>{datos.vehiculo.modelo}</Text>
              </Body>
              <Right>
                <Text>{datos.estado}
                </Text>
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
