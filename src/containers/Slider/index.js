import React, { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();

  // index = slide actuellement affichée
  const [index, setIndex] = useState(0);

  // On trie les éléments du slider (data.focus) du plus récent au plus ancien
  // new Date(b.date) - new Date(a.date) => tri descendante
  const byDateDesc = [...(data?.focus || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Debug : on vérifie l’ordre des slides dans la console quand les données arrivent
  useEffect(() => {
    console.log(
      "Ordre du carrousel (du plus récent au plus ancien) :",
      byDateDesc.map(e => ({ title: e.title, date: e.date }))
    );
  }, [data]); // s’exécute une seule fois quand data est chargé

  // Slider automatique : passe à la slide suivante toutes les 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      // Si on n’est pas encore à la dernière slide → index + 1
      // Sinon → on revient à la première (0)
      setIndex(index < byDateDesc.length - 1 ? index + 1 : 0);
    }, 5000);

    // Nettoyage : évite d’accumuler plusieurs timers
    return () => clearTimeout(timer);
  }, [index, byDateDesc.length]);
  // ⚠ dépendances importantes : on relance le timer quand index change
  // ou si le nombre de slides change

  return (
    <div className="SlideCardList">
      {/* On affiche une SlideCard par élément de byDateDesc */}
      {byDateDesc?.map((event, idx) => (
        // Un React.Fragment pour regrouper slide + pagination, avec une clé unique
        <React.Fragment key={event.title}>

          {/* Slide individuelle */}
          <div
            className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
          >
            <img src={event.cover} alt="forum" />

            {/* Description de la slide */}
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>

          {/* Pagination (petits ronds indicateurs) */}
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                  key={event.title}
                  type="radio"
                  name="radio-button"
                  checked={idx === radioIdx}
                  readOnly
                />
              ))}
            </div>
          </div>

        </React.Fragment>
      ))}
    </div>
  );
};


export default Slider;
