import { Fab } from "@mui/material";
import { useEffect, useState } from "react";
import NavigationIcon from '@mui/icons-material/Navigation';

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
  
    // Verifica se a posição da rolagem da tela é maior do que a altura da janela de visualização
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  
    // Adiciona e remove o evento de rolagem quando o componente é montado ou desmontado
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    // Função para rolar para o topo da tela quando o botão é clicado
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Rola suavemente para o topo
      });
    };
  
    return (
      <Fab
        variant="extended"
        size="small"
        color="primary"
        className={`absoluteHard  ${isVisible ? 'block' : 'hidden'}`}
        onClick={scrollToTop}
      >
        <NavigationIcon />
        Topo
      </Fab>
    );
  };
  
  export default ScrollToTopButton;