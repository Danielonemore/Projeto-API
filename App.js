import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

export default function App() {
  // Estados para armazenar os dados das APIs
  const [weatherData, setWeatherData] = useState(null);
  const [exchangeRateData, setExchangeRateData] = useState(null);
  const [sunriseSunsetData, setSunriseSunsetData] = useState(null);  // Nascer/Pôr do sol
  const [newsData, setNewsData] = useState(null);  // Notícias

  // Chaves de API 
  const weatherApiKey = 'b9d7f819e45c9d329189a343ddb36a9f';  
  const exchangeRateApiKey = 'bca7278856bc7977bb20896a';  
  const newsApiKey = '42b7c78de0cf41aea7c2ff0914605e7c';  

  // Função para buscar dados de clima
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Mogi das Cruzes&appid=${weatherApiKey}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do clima:', error);
    }
  };

  // Função para buscar dados de taxas de câmbio
  const fetchExchangeRateData = async () => {
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/USD`
      );
      setExchangeRateData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados de taxas de câmbio:', error);
    }
  };

  // Função para buscar dados do nascer e pôr do sol
  const fetchSunriseSunsetData = async () => {
    try {
      const response = await axios.get(
        `https://api.sunrise-sunset.org/json?lat=-23.5204&lng=-46.1854&formatted=0`
      );
      setSunriseSunsetData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do nascer/pôr do sol:', error);
    }
  };

  // Função para buscar notícias relacionadas ao clima
  const fetchNewsData = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=clima&language=pt&apiKey=${newsApiKey}`
      );
      setNewsData(response.data.articles);  // Corrigido o caminho da resposta
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      setNewsData(null);
    }
  };

  // useEffect: executa as funções ao carregar o componente
  useEffect(() => {
    fetchWeatherData();
    fetchExchangeRateData();
    fetchSunriseSunsetData(); // Nascer e pôr do sol
    fetchNewsData(); // Notícias
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Informações do Clima</Text>
      {weatherData ? (
        <View style={styles.weatherContainer}>
          <Text style={styles.title}>Cidade: {weatherData.name}</Text>
          <Text>Temperatura: {weatherData.main.temp}°C</Text>
          <Text>Condição: {weatherData.weather[0].description}</Text>
          <Text>Umidade: {weatherData.main.humidity}%</Text>
          <Text>Vento: {weatherData.wind.speed} m/s</Text>
        </View>
      ) : (
        <Text>Carregando dados do clima...</Text>
      )}

      <Text style={styles.header}>Taxas de Câmbio (USD)</Text>
      {exchangeRateData ? (
        <View style={styles.exchangeContainer}>
          <Text style={styles.title}>Taxa para EUR: {exchangeRateData.conversion_rates.EUR}</Text>
          <Text>Taxa para BRL: {exchangeRateData.conversion_rates.BRL}</Text>
          <Text>Taxa para GBP: {exchangeRateData.conversion_rates.GBP}</Text>
        </View>
      ) : (
        <Text>Carregando dados de taxas de câmbio...</Text>
      )}

      <Text style={styles.header}>Nascer e Pôr do Sol</Text>
      {sunriseSunsetData ? (
        <View style={styles.sunContainer}>
          <Text>Nascer do Sol: {new Date(sunriseSunsetData.results.sunrise).toLocaleTimeString()}</Text>
          <Text>Pôr do Sol: {new Date(sunriseSunsetData.results.sunset).toLocaleTimeString()}</Text>
        </View>
      ) : (
        <Text>Carregando dados do nascer/pôr do sol...</Text>
      )}

      <Text style={styles.header}>Últimas Notícias sobre o Clima</Text>
      {newsData ? (
        <View style={styles.newsContainer}>
          {newsData.map((article, index) => (
            <Text key={index}>{article.title}</Text>
          ))}
        </View>
      ) : (
        <Text>Carregando notícias...</Text>
      )}
      {!newsData && <Text>Não foi possível carregar as últimas notícias sobre o clima.</Text>}
    </ScrollView>
  );
}

// layout app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    flexWrap: 'wrap',
  },
  weatherContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    flex: 1,
  },
  exchangeContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffecb3',
    borderRadius: 10,
    flex: 1,
  },
  sunContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffe0b2',
    borderRadius: 10,
    flex: 1,
  },
  newsContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffccbc',
    borderRadius: 10,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#00796b',
  },
});
