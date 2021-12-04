import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, AsyncStorage } from "react-native";
import { Overlay } from "react-native-elements";
import { Content, Form, Item, Input, Label, Icon, Picker } from "native-base";
import AppButton from "../../Lib/plug/AppButton";
import { api } from "../../Lib/utils/db";
import axios from "axios";
import API from "../../Lib/utils/db";

export default function Loading(props) {
  const { isVisible, text, pedido, NotifiyPush, tokenPush } = props;
  const [precio, setPrecio] = useState();
  const [tiempo, setTiempo] = useState();
  const [vehiculoCondu, setVehiculoCondu] = useState([]);
  const [vehiculo, setVehiculo] = useState();

  const ChangedEstado = async (est, pre, time, vehi) => {
    const pedido_change = {
      estado: est,
      precio: pre,
      tiempo: time,
      vehiculo: vehi,
    };
    console.log(pedido_change);
    const response = await API.put(`ordersup/${pedido}/`, pedido_change);
    // console.log("resultado: ", response.data);
  };

  const CancelarViaje = async () => {
    const id_user = await AsyncStorage.getItem("id_user");

    // Enviamos primera información
    const titulo = "Cancelación de servicio";
    const descripcion = "El conductor ha cancelado el servicio";

    const logs_pedido = {
      title: titulo,
      description: descripcion,
      pedido: parseInt(pedido),
      realizado_by: parseInt(id_user),
    };
    if (vehiculo && tiempo && precio) {
      const response3 = await API.post(`activiorders/`, logs_pedido);
      NotifiyPush(tokenPush, "Pedido cancelado, vuelve a intentar");
      ChangedEstado(8, precio, tiempo, vehiculo); // Cancelar pedido
    }
  };

  const ConfirmarViaje = async () => {
    // const id_pedido = await AsyncStorage.getItem("id_pedido");
    const id_user = await AsyncStorage.getItem("id_user");

    // Enviamos primera información
    const titulo = "Vehiculo Confirmado";
    const descripcion = "Estamos en camino";

    const logs_pedido = {
      title: titulo,
      description: descripcion,
      pedido: parseInt(pedido),
      realizado_by: parseInt(id_user),
    };
    if (vehiculo && tiempo && precio) {
      const response3 = await API.post(`activiorders/`, logs_pedido);
      console.log("TokenPush", tokenPush);
      NotifiyPush(
        tokenPush,
        "El conductor ha confirmado tu viaje, ya vamos por ti"
      );
      ChangedEstado(9, precio, tiempo, vehiculo); // Por Confirmar pedido por parte del cliente
    }
  };

  useEffect(() => {
    const VehiculosCondu = async () => {
      const id_user = await AsyncStorage.getItem("id_user");

      const response5 = await API.get(`cars/?persona=${id_user}`);
      setVehiculoCondu(response5.data);
    };

    VehiculosCondu();
  }, []);

  const handleTipo = async (value) => {
    setVehiculo(value);
    // console.log("Valor del vehiculo: ", vehiculo);
  };

  // const ConfirmarViaje = async (pedido) => {
  //   //const id_pedido = await AsyncStorage.getItem("id_pedido");
  //   const id_user = await AsyncStorage.getItem("id_user");

  //   // Enviamos primera información
  //   const titulo = "Vehiculo Confirmado";
  //   const descripcion = "Estamos en camino";

  //   const logs_pedido = {
  //     title: titulo,
  //     description: descripcion,
  //     pedido: parseInt(pedido),
  //     realizado_by: parseInt(id_user),
  //   };
  //   console.log(logs_pedido);
  //   axios
  //     .post(`${api}pedidos_acti/create/`, logs_pedido)
  //     .then((response) => {
  //       //console.log(response)

  //       ChangedEstado(pedido, 5); // En camino pedido
  //       changedEst(false); // cambiar estado del popup
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,0, .5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
    >
      <View style={styles.form}>
        <Text>{"\n"}</Text>
        <Text>{"\n"}</Text>
        <Text>{"\n"}</Text>
        <Form>
          <Item>
            <Label>Precio: </Label>
            <Input
              style={{ fontSize: 20 }}
              onChange={(e) => setPrecio(e.nativeEvent.text)}
            />
          </Item>
          <Item>
            <Label>Tiempo: </Label>
            <Input onChange={(e) => setTiempo(e.nativeEvent.text)} />
          </Item>
          <Picker
            mode="dropdown"
            style={{ marginLeft: 10, width: 150 }}
            selectedValue={vehiculo}
            onValueChange={(itemValue, itemIndex) => handleTipo(itemValue)}
          >
            <Picker.Item key="0" label="Seleccione vehiculo" value="0" />
            {vehiculoCondu.map((serv) => (
              <Picker.Item
                key={serv.id}
                label={serv.placa + "" + serv.marca}
                value={serv.id}
              />
            ))}
          </Picker>
        </Form>
      </View>
      <View style={styles.view}>
        {/* {text && <Text style={styles.text}>{text}</Text>}
        <Text>{"\n"}</Text> */}
        <AppButton title="CONFIRMAR" action={() => ConfirmarViaje()} />
        <Text>{"\n"}</Text>
        <AppButton title="CANCELAR" action={() => CancelarViaje()} />
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: 500,
    width: 600,
    backgroundColor: "#fff",
    borderColor: "#00a680",
    borderWidth: 2,
    borderRadius: 10,
  },
  form: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#00a680",
    textTransform: "uppercase",
    marginTop: 10,
  },
});
