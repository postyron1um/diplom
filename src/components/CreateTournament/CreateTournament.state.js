export const initialState = {
  title: '',
  sportType: 'Другое',
  typeTournament: 'Круговой',
  tournamentDesc: '',
  startDate: '',
  endDate: '',
  errors: {
    title: '',
    sportType: '',
    typeTournament: '',
    tournamentDesc: '',
    startDate: '',
    endDate: '',
  },
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    case 'CLEAR_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: '' } };
    case 'RESET_FORM':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
export const typeTournamentMap = ['Круговой', 'На вылет'];
export const sportTypeOptions = [
  'Футбол',
  'Другое',
  'Баскетбол',
  'Теннис',
  'Волейбол',
  'Хоккей',
  'Бейсбол',
  'Гольф',
  'Бадминтон',
  'Бокс',
  'Автогонки',
  'Борьба',
  'Плавание',
  'Легкая атлетика',
  'Скейтбординг',
  'Сноубординг',
  'Фигурное катание',
  'Скейтинг',
  'Скалолазание',
  'Серфинг',
  'Боулинг',
].sort();
