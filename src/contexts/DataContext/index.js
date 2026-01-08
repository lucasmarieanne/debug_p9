import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [last, setLast] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      const json = await api.loadData();
      setData(json);
      
      // On crée une nouvelle copie du tableau des événements avec .slice()
      // (important : pour NE PAS modifier json.events directement)
      const eventSortedDesc = json.events
        .slice()
        // On trie les événements par date décroissante
        // new Date(b.date) - new Date(a.date) => b plus récent que a
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      // Le premier élément après le tri est l’événement le plus récent
       setLast(eventSortedDesc[0]);

      // Affichage de l’événement le plus récent dans la console
      console.log("Dernier event :", last);
      
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        // last: data?.last,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
