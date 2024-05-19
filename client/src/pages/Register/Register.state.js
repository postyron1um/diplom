import { useReducer } from 'react';

// Начальное состояние формы
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  tel: '',
  password: '',
  errors: {
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    password: '',
  },
};

// Редюсер для обновления состояния формы и обработки ошибок ввода
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };
    default:
      return state;
  }
};

// Hook для использования редюсера формы
const useFormReducer = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Установка значения поля формы
  const setFieldValue = (field, value) => {
    dispatch({ type: 'SET_FIELD_VALUE', field, value });
  };

  // Установка ошибки поля формы
  const setFieldError = (field, error) => {
    dispatch({ type: 'SET_FIELD_ERROR', field, error });
  };

  return {
    state,
    setFieldValue,
    setFieldError,
  };
};

export default useFormReducer;
