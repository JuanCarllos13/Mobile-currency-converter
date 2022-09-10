import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import Picker from './src/components/Picker';
import api from './src/services/api'

export default function App() {
  const [moeda, setmoeda] = useState([])
  const [loading, setLoadding] = useState(true)

  const [moedaSelecionada, setMoedaSelecionada] = useState(null)
  const [moeadaValor, setMoedaValor] = useState(0)
  const [valorMoeda, setValorMoeda] = useState(null)
  const [valorConvertido, setalorConvertido] = useState(0)


  useEffect(() => {
    async function loadMoeda() {
      const response = await api.get('all')
      let arrayMoeda = []
      Object.keys(response.data).map((key) => {
        arrayMoeda.push({
          key: key,
          label: key,
          value: key
        })
      })
      setmoeda(arrayMoeda)
      setLoadding(false)
    }
    loadMoeda()
  }, [])

  async function Converter() {
    if (moedaSelecionada === null || moeadaValor === '') {
      alert("Por favor Selecione uma moeda")
      return;
    }

    // USD-BRl ele delvolve quanto é 1 dolár convertido pra reais
    const response = await api.get(`all/${moedaSelecionada}-BRL`)
    // console.log(response.data[moedaSelecionada].ask)

    let resultado = (response.data[moedaSelecionada].ask * parseFloat(moeadaValor))
    setalorConvertido(`R$ ${resultado.toFixed(2)}`)
    setValorMoeda(moeadaValor)

    //Fechar o teclado caso esteja aberto
    Keyboard.dismiss()
 
  }


  if (loading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <ActivityIndicator color={'white'} size={45} />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>

        <View style={styles.areaMoeda}>
          <Text style={styles.title}>Selecione sua moeda</Text>
          <Picker moedas={moeda} onChange={(moeda) => setMoedaSelecionada(moeda)} />
        </View>

        <View style={styles.areaValor}>
          <Text style={styles.title}>Selecione um valor para converter em (R$) </Text>

          <TextInput
            placeholder='EX: 150'
            style={styles.input}
            keyboardType='numeric'
            onChangeText={(valor) => setMoedaValor(valor)}
          />
        </View>


        <TouchableOpacity style={styles.botaoArea} onPress={Converter}>
          <Text style={styles.botaoText} >Converter</Text>
        </TouchableOpacity>

        {valorConvertido !== 0 && (

          <View style={styles.result} >
            <Text style={styles.valorConvertido}>
              {valorMoeda}  {moedaSelecionada}
            </Text>
            <Text style={[styles.valorConvertido, { fontSize: 18, margin: 10 }]}>
              Corresponde a
            </Text>
            <Text style={styles.valorConvertido}>
              {valorConvertido}
            </Text>
          </View>
        )}

      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    alignItems: 'center',
    paddingTop: 40,
    marginTop: 50,
  },
  areaMoeda: {
    width: '90%',
    backgroundColor: '#F9f9f9',
    paddingTop: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: 1
  },
  title: {
    color: 'black',
    fontSize: 15,
    paddingTop: 5,
    paddingLeft: 5
  },
  areaValor: {
    width: '90%',
    backgroundColor: '#F9f9f9',
    paddingBottom: 9,
    paddingTop: 9
  },
  input: {
    width: '100%',
    padding: 10,
    height: 45,
    fontSize: 20,
    marginTop: 9,
    color: '#000'
  },
  botaoArea: {
    width: '90%',
    backgroundColor: '#Fb4b57',
    height: 45,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoText: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
  },
  result: {
    width: '90%',
    backgroundColor: 'white',
    marginTop: 35,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25
  },
  valorConvertido: {
    fontSize: 39,
    fontWeight: 'bold',
    color: '#000'
  }
});
