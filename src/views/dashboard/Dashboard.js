import React from 'react'
import WeeklyView from './../../components/WeeklyView'

const Dashboard = () => {

  const weekDates = ["18/12/2024", "19/12/2024", "20/12/2024", "21/12/2024", "22/12/2024", "23/12/2024", "24/12/2024"];

  const activities = {
    0: [
      { id: 1, type: "semeadura", details: "Semeadura do lote #1" },
      { id: 2, type: "irrigacao", details: "Irrigação do lote #1" },
    ],
    1: [{ id: 3, type: "irrigacao", details: "Irrigação do lote #2" }],
    3: [{ id: 4, type: "colheita", details: "Colheita do lote #3" }],
    4: [{ id: 5, type: "limpeza", details: "Limpeza de bandejas" }],
  };

  return (
    <div>
      <h1>Visão Semanal de Atividades</h1>
      <WeeklyView activities={activities} weekDates={weekDates}/>
    </div>
  )
}

export default Dashboard
