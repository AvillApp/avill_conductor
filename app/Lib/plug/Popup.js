import React from "react";
import { StyleSheet, View, Text, AsyncStorage } from "react-native";
import { Overlay } from "react-native-elements";
import AppButton from "../../Lib/plug/AppButton";
import { api } from "../../Lib/utils/db";
import axios from "axios";

export default function Loading(props) {
  const { isVisible, text, changedEst, idPedido} = props;

  const ChangedEstado = async (pedido, est) => {

    const pedido_change = {
      'estado': est, // cancelado
    }

    axios.put(`${api}pedidos/update_estado/${pedido}/`, pedido_change)
       .then(response => {
       // console.log(response)

      
       
       }).catch(error=>{
         console.log(error)
       })
         //Guadamos el id del pedido 
       await AsyncStorage.setItem("id_pedido", pedido);
  }

  const CancelarViaje = async (pedido) => {
    //const id_pedido = await AsyncStorage.getItem("id_pedido");
    const id_user = await AsyncStorage.getItem("id_user");

    // Enviamos primera información
    const titulo = "Cancelación de servicio"
    const descripcion = "El conductor ha cancelado el servicio"

    const logs_pedido = {
     "title": titulo,
     "description": descripcion,
     "pedido": parseInt(pedido),
     "realizado_by": parseInt(id_user)
    }

    axios.post(`${api}pedidos_acti/create/`, logs_pedido)
       .then(response => {
        console.log(response)
        
          ChangedEstado(pedido,4) // Cancelar pedido
          changedEst(false) // cambiar estado del popup
         
         
       }).catch(error=>{
         console.log(error)
       })
  };

  const ConfirmarViaje = async (pedido) => {
    //const id_pedido = await AsyncStorage.getItem("id_pedido");
    const id_user = await AsyncStorage.getItem("id_user");

    // Enviamos primera información
    const titulo = "Vehiculo Confirmado"
    const descripcion = "Estamos en camino"

    const logs_pedido = {
      "title": titulo,
      "description": descripcion,
      "pedido": parseInt(pedido),
      "realizado_by": parseInt(id_user)
     }
     console.log(logs_pedido)
     axios.post(`${api}pedidos_acti/create/`, logs_pedido)
        .then(response => {
          //console.log(response)

          ChangedEstado(pedido,5)// En camino pedido
          changedEst(false) // cambiar estado del popup
          
        }).catch(error=>{
          console.log(error)
        })
  };
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,0, .5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
    >
      <View style={styles.view}>
        {text && <Text style={styles.text}>{text}</Text>}
        <Text>{"\n"}</Text>
        {/* {precio && <Text>Costo: ${precio}</Text>} */}
        <AppButton title="CONFIRMAR" action={()=> ConfirmarViaje(idPedido)} />
        <Text>{"\n"}</Text>
        <AppButton title="CANCELAR" action={()=> CancelarViaje(idPedido)} />
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: 400,
    width: 400,
    backgroundColor: "#fff",
    borderColor: "#00a680",
    borderWidth: 2,
    borderRadius: 10,
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
