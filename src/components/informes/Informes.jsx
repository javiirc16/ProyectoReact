import React, { useState } from 'react';
import './Informes.css';
import { jsPDF } from 'jspdf';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Informes = () => {
  const [difficulty, setDifficulty] = useState('');
  const [heroType, setHeroType] = useState('');
  const [filteredChampions, setFilteredChampions] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);


  const parseCSV = (text) => {
    // Divide el texto en líneas y filtra las líneas vacías
    const lines = text.split('\n').filter(line => line.trim() !== '');
  
    // La primera línea contiene los encabezados de las columnas
    const headers = lines[0].split(',').map(header => header.trim());
  
    // Procesa cada línea de datos (excepto la primera) y crea un objeto para cada línea
    return lines.slice(1).map(line => {
      // Divide la línea en valores y elimina los espacios en blanco
      const values = line.split(',').map(value => value.trim());
  
      // Crea un objeto donde las claves son los encabezados y los valores son los datos correspondientes
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {});
    });
  };

  const handlePrint = async () => {
    try {
      const response = await fetch('200125_LoL_champion_data.csv');
      if (!response.ok) throw new Error(`Error al cargar CSV: ${response.status}`);

      const text = await response.text();
      const parsedData = parseCSV(text);

      const filtered = parsedData.filter(champion => 
        (difficulty ? champion.difficulty === difficulty : true) &&
        (heroType ? champion.herotype === heroType : true)
      );

      setFilteredChampions(filtered);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error al cargar el archivo CSV:', error);
    }
  };

  const generatePDF = () => {
    if (filteredChampions.length === 0) {
      alert("No hay datos para generar el informe.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(11);
    doc.text(`Javier Rodríguez Castellano`, 12, 10)

    // Título del PDF
    doc.setFont("times", "bold");
    doc.setFontSize(20);
    const title = "INFORME DE CAMPEONES DE LEAGUE OF LEGENDS";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;
    const yPositionTitle = 22;
    doc.text(title, xPosition, yPositionTitle);

    // Añadir una línea debajo del título
    doc.setDrawColor(125, 67, 232);
    doc.setLineWidth(1.5);
    doc.line(20, yPositionTitle + 5, pageWidth - 20, yPositionTitle + 5);


    // Encabezado
    doc.setFontSize(16);
    doc.setFont("helvetica", "italic");
    const headerText = "Este informe contiene información principal sobre los campeones de League of Legends";
    const headerLines = doc.splitTextToSize(headerText, pageWidth - 40);
    const headerYPosition = 40;
    headerLines.forEach((line, index) => {
      const lineWidth = doc.getTextWidth(line);
      const lineXPosition = (pageWidth - lineWidth) / 2;
      doc.text(line, lineXPosition, headerYPosition + (index * 10));
    });

    let yPosition = headerYPosition + (headerLines.length * 10) + 10;


    filteredChampions.forEach((champ, index) => {
      // Verificar si hay suficiente espacio en la página actual
      if (yPosition + 50 > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Nombre: ${champ.apiname}`, 20, yPosition);
      doc.text(`Título: ${champ.title}`, 20, yPosition + 10);
      doc.text(`Dificultad: ${champ.difficulty}`, 20, yPosition + 20);
      doc.text(`Tipo de Héroe: ${champ.herotype}`, 20, yPosition + 30);
      
      // Ajustar la línea divisoria
      if (index === filteredChampions.length - 1) {
        doc.setDrawColor(125, 67, 232);
        doc.setLineWidth(1.5);
      } else {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
      }
      doc.line(20, yPosition + 35, 190, yPosition + 35);

      yPosition += 50;
    });

    const totalHeroes = filteredChampions.length;
    const heroTypes = [...new Set(filteredChampions.map(champ => champ.herotype))].join(', ');
    const heroDifficulties = [...new Set(filteredChampions.map(champ => champ.difficulty))].join(', ');

    const heroTypeMap = {
      "Assassin": "Asesino",
      "Fighter": "Luchador",
      "Mage": "Mago",
      "Support": "Soporte",
      "Tank": "Tanque",
      "Marksman": "Tirador"
    };

    const heroTypeText = heroTypeMap[heroTypes] || "No especificado";


    const difficultyText = heroDifficulties === "1" ? "Fácil" : heroDifficulties === "2" ? "Media" : heroDifficulties === "3" ? "Difícil" : "No especificada";


    const finalY = yPosition + 10;
    doc.setFontSize(13);
    doc.text(`Este informe ha sido generado según la dificultad y tipo de campeón seleccionados`, 20, finalY);
    doc.text(`La dificultad seleccionada ha sido: ${difficultyText}`, 20, finalY + 10);
    doc.text(`El tipo de campeón seleccionado ha sido: ${heroTypeText}`, 20, finalY + 20);
    doc.text(`Se han obtenido como resultado un total de ${totalHeroes} campeones`, 20, finalY + 30);


    // Guardar el PDF
    doc.save("Informe_CampeonesLOL_Javier.pdf");
  };

  // Datos para el gráfico de barras
  const altTypeCounts = filteredChampions.reduce((acc, champ) => {
    acc[champ.alttype] = (acc[champ.alttype] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(altTypeCounts),
    datasets: [
      {
        label: 'Personajes según su tipo alternativo',
        data: Object.values(altTypeCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico circular
  const resourceCounts = filteredChampions.reduce((acc, champ) => {
    acc[champ.resource] = (acc[champ.resource] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(resourceCounts),
    datasets: [
      {
        label: 'Cantidad de personajes por recurso',
        data: Object.values(resourceCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="informes-container">
      <h2>Generar Informe</h2>
      <div className="form-results-container">
        <div className="form-container">
          <form>
            <div className="form-group">
              <label htmlFor="difficulty">Dificultad:</label>
              <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="">Selecciona una dificultad</option>
                <option value="1">Fácil</option>
                <option value="2">Media</option>
                <option value="3">Difícil</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="heroType">Tipo de Campeón:</label>
              <select id="heroType" value={heroType} onChange={(e) => setHeroType(e.target.value)}>
                <option value="">Selecciona un tipo de campeón</option>
                <option value="Assassin">Asesino</option>
                <option value="Fighter">Luchador</option>
                <option value="Mage">Mago</option>
                <option value="Support">Soporte</option>
                <option value="Tank">Tanque</option>            
                <option value="Marksman">Tirador</option>
              </select>
            </div>
            <button className="imprimir" type="button" onClick={handlePrint}>Imprimir</button>
            <button className="pdf" type="button" onClick={generatePDF}>Generar PDF</button>
          </form>
          {searchPerformed && (filteredChampions.length > 0 ? (
            <div className="results">
              <h3>Resultados:</h3>
              <ul>
                {filteredChampions.map((champion, index) => (
                  <li key={index}>{champion.apiname} - {champion.title}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="no-results">
              <h3>No hay resultados disponibles</h3>
            </div>
          ))}
        </div>
        {searchPerformed && (
          <div className="charts-container">
            <div className="charts">
              <h3>Gráfico de Barras</h3>
              <Bar data={barData} />
              <h3>Gráfico Circular</h3>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};