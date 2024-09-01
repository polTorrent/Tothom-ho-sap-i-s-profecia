import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from './firebase';

const GestorDespesesViatge = () => {
  const [titol, setTitol] = useState("Viatge sense nom");
  const [editantTitol, setEditantTitol] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [nouParticipant, setNouParticipant] = useState('');
  const [despeses, setDespeses] = useState([]);
  const [novaDespesa, setNovaDespesa] = useState({ concepte: '', import: '', pagador: '' });
  const [editantDespesa, setEditantDespesa] = useState(null);

  useEffect(() => {
    setParticipants([]); // Clear participants on mount
    carregarDespeses();
  }, []);

  useEffect(() => {
    carregarDespeses();
  }, []);

  const carregarDespeses = async () => {
    const querySnapshot = await getDocs(collection(db, "despeses"));
    const dadesDespeses = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    setDespeses(dadesDespeses);
  };

  const afegirDespesa = async () => {
    if (novaDespesa.concepte && novaDespesa.import && novaDespesa.pagador) {
      await addDoc(collection(db, "despeses"), novaDespesa);
      await carregarDespeses();
      setNovaDespesa({ concepte: '', import: '', pagador: '' });
    }
  };

  const editarDespesa = async (id) => {
    if (editantDespesa) {
      await updateDoc(doc(db, "despeses", id), editantDespesa);
      setEditantDespesa(null);
      await carregarDespeses();
    }
  };

  const eliminarDespesa = async (id) => {
    await deleteDoc(doc(db, "despeses", id));
    await carregarDespeses();
  };

  const afegirParticipant = () => {
    if (nouParticipant && !participants.includes(nouParticipant)) {
      setParticipants([...participants, nouParticipant]);
      setNouParticipant('');
    }
  };

  const eliminarParticipant = (participantAEliminar) => {
    setParticipants(participants.filter(p => p !== participantAEliminar));
  };

  const calcularDeutes = () => {
    const total = despeses.reduce((sum, despesa) => sum + parseFloat(despesa.import), 0);
    const perPersona = total / participants.length;
    const deutes = Object.fromEntries(participants.map(p => [p, 0]));

    despeses.forEach(despesa => {
      deutes[despesa.pagador] += parseFloat(despesa.import);
    });

    return Object.fromEntries(
      Object.entries(deutes).map(([nom, pagat]) => [nom, pagat - perPersona])
    );
  };

  const deutes = calcularDeutes();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8 text-center">
        {editantTitol ? (
          <input
            type="text"
            value={titol}
            onChange={(e) => setTitol(e.target.value)}
            onBlur={() => setEditantTitol(false)}
            className="text-3xl font-bold text-center w-full p-2 border-b-2 border-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <h1 
            className="text-3xl font-bold cursor-pointer hover:text-blue-600" 
            onClick={() => setEditantTitol(true)}
          >
            {titol}
          </h1>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Participants</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {participants.map((participant, index) => (
            <div key={index} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
              <span>{participant}</span>
              <button 
                onClick={() => eliminarParticipant(participant)}
                className="ml-2 text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={nouParticipant}
            onChange={(e) => setNouParticipant(e.target.value)}
            placeholder="Nou participant"
            className="flex-grow p-2 border rounded-l"
          />
          <button 
            onClick={afegirParticipant}
            className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
          >
            Afegir
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Despeses</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Concepte</th>
              <th className="p-2 text-left">Import</th>
              <th className="p-2 text-left">Pagador</th>
              <th className="p-2 text-left">Accions</th>
            </tr>
          </thead>
          <tbody>
            {despeses.map((despesa) => (
              <tr key={despesa.id} className="border-b">
                <td className="p-2">
                  {editantDespesa?.id === despesa.id ? (
                    <input
                      type="text"
                      value={editantDespesa.concepte}
                      onChange={(e) => setEditantDespesa({...editantDespesa, concepte: e.target.value})}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    despesa.concepte
                  )}
                </td>
                <td className="p-2">
                  {editantDespesa?.id === despesa.id ? (
                    <input
                      type="number"
                      value={editantDespesa.import}
                      onChange={(e) => setEditantDespesa({...editantDespesa, import: e.target.value})}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    `${despesa.import} €`
                  )}
                </td>
                <td className="p-2">
                  {editantDespesa?.id === despesa.id ? (
                    <select
                      value={editantDespesa.pagador}
                      onChange={(e) => setEditantDespesa({...editantDespesa, pagador: e.target.value})}
                      className="w-full p-1 border rounded"
                    >
                      {participants.map((participant, index) => (
                        <option key={index} value={participant}>{participant}</option>
                      ))}
                    </select>
                  ) : (
                    despesa.pagador
                  )}
                </td>
                <td className="p-2">
                  {editantDespesa?.id === despesa.id ? (
                    <button 
                      onClick={() => editarDespesa(despesa.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button 
                      onClick={() => setEditantDespesa(despesa)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                    >
                      Editar
                    </button>
                  )}
                  <button 
                    onClick={() => eliminarDespesa(despesa.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <input
            type="text"
            value={novaDespesa.concepte}
            onChange={(e) => setNovaDespesa({...novaDespesa, concepte: e.target.value})}
            placeholder="Concepte"
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={novaDespesa.import}
            onChange={(e) => setNovaDespesa({...novaDespesa, import: e.target.value})}
            placeholder="Import"
            className="p-2 border rounded"
          />
          <select
            value={novaDespesa.pagador}
            onChange={(e) => setNovaDespesa({...novaDespesa, pagador: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">Selecciona pagador</option>
            {participants.map((participant, index) => (
              <option key={index} value={participant}>{participant}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={afegirDespesa}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Afegir Despesa
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Balanç Final</h2>
        <ul>
          {Object.entries(deutes).map(([participant, deute]) => (
            <li key={participant} className="mb-2 flex justify-between items-center">
              <span>{participant}</span>
              <span className={deute >= 0 ? "text-green-600" : "text-red-600"}>
                {deute.toFixed(2)} €
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GestorDespesesViatge;
