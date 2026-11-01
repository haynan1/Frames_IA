// Route registry: the single source for navigation, titles and breadcrumbs.
export const navGroups = [
  {id: 'studio', label: 'Studio', routes: [
    {id: 'inicio', label: 'Visão geral', icon: 'home'},
    {id: 'como-usar', label: 'Como produzir', icon: 'compass'},
    {id: 'tomadas', label: 'Tomadas prontas', icon: 'film'},
    {id: 'studio', label: 'Studio de cenas', icon: 'studio'},
    {id: 'elenco', label: 'Elenco', icon: 'cast'},
    {id: 'direcoes', label: 'Direções de arte', icon: 'aperture'},
    {id: 'fila', label: 'Fila de imagens', icon: 'queue'}
  ]},
  {id: 'biblioteca', label: 'Biblioteca', routes: [
    {id: 'biblioteca', label: 'Biblioteca visual', icon: 'grid'},
    {id: 'camera', label: 'Atlas de câmera', icon: 'video'},
    {id: 'prompts', label: 'Prompts', icon: 'text'}
  ]},
  {id: 'aprender', label: 'Aprender', routes: [
    {id: 'guia', label: 'Manual de direção', icon: 'book'},
    {id: 'storyboard', label: 'Do frame ao filme', icon: 'film'},
    {id: 'laboratorio', label: 'Laboratório', icon: 'sliders'}
  ]},
  {id: 'sistema', label: 'Sistema', routes: [
    {id: 'modelos', label: 'Ferramentas de IA', icon: 'chip'},
    {id: 'qualidade', label: 'Controle de qualidade', icon: 'check'},
    {id: 'fontes', label: 'Fontes', icon: 'link'}
  ]}
];

export const routes = navGroups.flatMap(group => group.routes.map(route => ({...route, group: group.label})));
export const routeById = id => routes.find(route => route.id === id);
// Old links keep working after the production planner became the Studio.
export const routeAliases = {producao: 'studio'};
