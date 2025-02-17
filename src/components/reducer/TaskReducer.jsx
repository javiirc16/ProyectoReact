import React, { useReducer, useRef } from 'react';
import './Reducer.css';

export const TaskReducer = () => {
  const [tareas, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'add_task':
        return [...state, { id: state.length + 1, title: action.title }];
      case 'delete_task':
        return state.filter((tarea, index) => index !== action.index);
      default:
        return state;
    }
  }, []);

  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'add_task',
      title: inputRef.current.value,
    });
    inputRef.current.value = '';
  };

  return (
    <div className="contenedor">
      <h1>Lista de tareas</h1>
      <form onSubmit={handleSubmit}>
        <label className="task">Tarea</label>
        <input type="text" className="title" ref={inputRef} />
        <input className="addTask" type="submit" value="Agregar tarea" />
      </form>
      <div>
        {tareas &&
          tareas.map((tarea, index) => (
            <div key={index} className="task-item">
              <p className="taskName">
                {tarea.id}. {tarea.title}
              </p>
              <button
                className="deletebtn"
                onClick={() => dispatch({ type: 'delete_task', index: index })}
              >
                Eliminar
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};