import React, { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Tri des événements du plus récent au plus ancien
  const byDateDesc = [...(data?.focus || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Vérifie dans la console que les données sont bien récupérées et triées
  useEffect(() => {
    if (byDateDesc.length > 0) {
      console.log("Slides chargées :", byDateDesc.map(e => ({ title: e.title, date: e.date })));
    }
  }, [data]);

  // Avance automatiquement à la slide suivante toutes les 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex(index < byDateDesc.length - 1 ? index + 1 : 0);
    }, 5000);

    return () => clearTimeout(timer); // nettoyage avant chaque re-render
  }, [index, byDateDesc.length]);

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <React.Fragment key={event.title}>

          <div className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}>
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>

          {/* Indicateurs de pagination, un par slide */}
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                  // key={radioIdx}
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx}
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