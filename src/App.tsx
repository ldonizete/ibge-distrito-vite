import { useEffect, useState } from 'react'
import './App.css'
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScrollToTopButton from './components/buttonScroll';

function App() {
  const [data, setData] = useState<any>(null);
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [districts, setDistricts] = useState<{ nome: string; sigla: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [inicialLoading, setInicialLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setInicialLoading(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/distritos');
        if (!response.ok) {
          throw new Error('Erro ao carregar os dados');
        }
        const res = await response.json();
        
        setData(res);
      } catch (error) {
        console.log('Erro ao carregar os dados', error);
      } finally {
        setInicialLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (data && data.length > 0) {
      const uniqueDistricts: { [key: string]: string } = {};
      const result: { nome: string; sigla: string }[] = [];

      for (let i = 0; i < data.length && result.length < 27; i++) {
        const district = data[i];
        const UF = district.municipio.microrregiao.mesorregiao.UF
        const nome = UF.nome
        const sigla = UF.sigla;
        const key = `${nome}-${sigla}`;

        if (!uniqueDistricts[key]) {
          uniqueDistricts[key] = nome;
          result.push({ nome, sigla });
        }
      }

      result.sort((a, b) => {
        return a.nome.localeCompare(b.nome);
      });

      setDistricts(result);
    }
    
  }, [data]);

  const handleChange = (panel: string, estado: string) => 
  (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : null);

    if (isExpanded) {
      handlePanelClick(estado);
    } else (
      setCities([])
    )
  };

  const handlePanelClick = async (districtName: string) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const filteredCities = data
      .filter((district: any) => {
        const UF = district.municipio.microrregiao.mesorregiao.UF;
        const nome = UF.nome;
        return nome === districtName;
      })
      .map((district: any) => district.nome);

    setCities(filteredCities);

    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-24">Lista de Estados e suas cidades</h1>
      {
        inicialLoading ?
          <CircularProgress /> :
          districts.map((district, index) => (
            <Accordion
              key={index}
              expanded={expandedPanel === `panel${index}`}
              onChange={handleChange(`panel${index}`, district.nome)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index + 1}-content`}
                id={`panel${index + 1}-header`}
              >
                <div className='flex justify-between w-1/2'>
                  <Typography>Estado: <span className='font-bold'>{district.nome}</span></Typography>
                  <Typography className='mr-4'>Sigla: <span className='font-bold'>{district.sigla}</span></Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails className='bg-gray-50'>
                {
                  loading ?
                    <CircularProgress />
                    :
                    <ul className='flex flex-col items-start list-decimal list-inside'>
                      {cities.map((city, cityIndex) => (
                        <li
                          className='text-lg mb-1'
                          key={cityIndex}
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                }
              </AccordionDetails>
            </Accordion>
          ))}
      <ScrollToTopButton />
    </div>
  )
}

export default App
