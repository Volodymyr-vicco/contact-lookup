'use client';
import React, { useEffect, useState } from "react";

const SHEET_ID = "1v8kK2LHmFUvd6YbuNIob6Y8hZfEiHgWT8kwErtN6GPE";
const API_KEY = "AIzaSyCa5sDs5pYz5OVvZNyRL9u3Rv4IorO-DfU";
const SHEET_NAME = "База клиентов";

export default function ContactLookup() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [matchFound, setMatchFound] = useState(false);
  const [contactId, setContactId] = useState<string | null>(null); // Состояние для ID
  const [firstName, setFirstName] = useState<string | null>(null); // Состояние для имени
  const [lastName, setLastName] = useState<string | null>(null); // Состояние для фамилии
  const [city, setCity] = useState<string | null>(null); // Состояние для города
  const [np, setNp] = useState<string | null>(null); // Состояние для НП
  const [orderNumber, setOrderNumber] = useState<string | null>(null); // Состояние для номера заказа
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        const rows = json.values;
        if (rows && rows.length > 0) {
          setHeaders(rows[0]);
          setData(rows.slice(1));
          setLoading(false);
        } else {
          setError("Нет данных на листе.");
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Ошибка загрузки данных: " + error.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (!selectedColumn || !searchValue) return;
    const columnIndex = headers.indexOf(selectedColumn);
    
    // Ищем строку, где найдено совпадение по значению
    const foundRow = data.find((row) => row[columnIndex] === searchValue);

    if (foundRow) {
      // Если найдено совпадение, то получаем данные из соответствующей строки
      const idIndex = headers.indexOf("ID");
      const firstNameIndex = headers.indexOf("Имя");
      const lastNameIndex = headers.indexOf("Фамилия");
      const cityIndex = headers.indexOf("Город");
      const npIndex = headers.indexOf("НП");
      const orderNumberIndex = headers.indexOf("Номер из-заказов");

      setContactId(foundRow[idIndex]);
      setFirstName(foundRow[firstNameIndex]);
      setLastName(foundRow[lastNameIndex]);
      setCity(foundRow[cityIndex]);
      setNp(foundRow[npIndex]);
      setOrderNumber(foundRow[orderNumberIndex]);
      
      setMatchFound(true);
    } else {
      setMatchFound(false);
      setContactId(null);
      setFirstName(null);
      setLastName(null);
      setCity(null);
      setNp(null);
      setOrderNumber(null);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Поиск или создание контакта</h1>

      {loading && <p>Загрузка данных...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <select
              className="p-2 border rounded"
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              <option value="">Выбрать колонку</option>
              {headers.length > 0 ? (
                headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))
              ) : (
                <option disabled>Нет доступных колонок</option>
              )}
            </select>

            <input
              className="p-2 border rounded"
              placeholder="Значение для поиска"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={handleSearch}
            >
              Проверить
            </button>
          </div>

          {searchValue && (
            <div className="p-4 border rounded mt-4">
              {matchFound ? (
                <>
                  <p className="text-green-600">Контакт найден ✅</p>
                  <p className="text-blue-600">ID: {contactId}</p>
                  <p className="text-blue-600">Имя: {firstName}</p>
                  <p className="text-blue-600">Фамилия: {lastName}</p>
                  <p className="text-blue-600">Город: {city}</p>
                  <p className="text-blue-600">НП: {np}</p>
                  <p className="text-blue-600">Номер из-заказов: {orderNumber}</p>
                </>
              ) : (
                <div>
                  <p className="text-red-600 mb-2">Контакт не найден ❌</p>
                  <button className="p-2 bg-green-500 text-white rounded">
                    Создать контакт
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
