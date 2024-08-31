import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit2, Check } from 'lucide-react';

const GestorDespesesViatge = () => {
  const [titol, setTitol] = useState("Tothom ho sap i es profecia");
  const [participants, setParticipants] = useState(["Pol", "Pau", "Marc"]);
  const [despeses, setDespeses] = useState([]);
  const [novaDespesa, setNovaDespesa] = useState({ concepte: '', import: '', pagador: '' });
  const [editantTitol, setEditantTitol] = useState(false);
  const [editantParticipants, setEditantParticipants] = useState(false);
  const [nouParticipant, setNouParticipant] = useState('');

  const afegirDespesa = () => {
    if (novaDespesa.concepte && novaDespesa.import && novaDespesa.pagador) {
      setDespeses([...despeses, { ...novaDespesa, id: Date.now() }]);
      setNovaDespesa({ concepte: '', import: '', pagador: '' });
    }
  };

  const eliminarDespesa = (id) => {
    setDespeses(despeses.filter(despesa => despesa.id !== id));
  };

  const afegirParticipant = () => {
    if (nouParticipant && !participants.includes(nouParticipant)) {
      setParticipants([...participants, nouParticipant]);
      setNouParticipant('');
    }
  };

  const eliminarParticipant = (participant) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  const calcularBalanc = () => {
    const total = despeses.reduce((sum, despesa) => sum + parseFloat(despesa.import), 0);
    const perPersona = total / participants.length;
    const balanc = Object.fromEntries(participants.map(p => [p, 0]));

    despeses.forEach(despesa => {
      balanc[despesa.pagador] += parseFloat(despesa.import);
    });

    return Object.fromEntries(
      Object.entries(balanc).map(([nom, valor]) => [nom, valor - perPersona])
    );
  };

  const balanc = calcularBalanc();

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div>
        {editantTitol ? (
          <div className="flex items-center">
            <input
              type="text"
              value={titol}
              onChange={(e) => setTitol(e.target.value)}
              className="text-2xl font-bold text-center"
            />
            <button onClick={() => setEditantTitol(false)} className="ml-2">
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <h2 className="text-2xl font-bold text-center mb-6">{titol}</h2>
            <button onClick={() => setEditantTitol(true)} className="ml-2" variant="ghost" size="sm">
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div>
        {editantParticipants ? (
          <div className="mb-4">
            <div className="mb-4">
              <input
                type="text"
                value={nouParticipant}
                onChange={(e) => setNouParticipant(e.target.value)}
                placeholder="Nou participant"
                className="mb-2"
              />
              <button onClick={afegirParticipant} className="px-4 py-2 text-white bg-green-500 rounded">
                Afegir Participant
              </button>
            </div>
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={participant}
                  onChange={(e) => {
                    const novaLlista = [...participants];
                    novaLlista[index] = e.target.value;
                    setParticipants(novaLlista);
                  }}
                  className="flex-grow"
                />
                <button onClick={() => eliminarParticipant(participant)} className="ml-2">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ))}
            <button onClick={() => setEditantParticipants(false)} className="mt-2">
              <Check className="h-4 w-4 mr-2" /> Guardar Participants
            </button>
          </div>
        ) : (
          <button onClick={() => setEditantParticipants(true)} className="mb-4" variant="outline">
            <Edit2 className="h-4 w-4 mr-2" /> Editar Participants
          </button>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            placeholder="Concepte"
            value={novaDespesa.concepte}
            onChange={(e) => setNovaDespesa({ ...novaDespesa, concepte: e.target.value })}
            className="flex-grow"
          />
          <input
            type="number"
            placeholder="Import"
            value={novaDespesa.import}
            onChange={(e) => setNovaDespesa({ ...novaDespesa, import: e.target.value })}
            className="w-24"
          />
          <select
            className="border rounded px-2 py-1"
            value={novaDespesa.pagador}
            onChange={(e) => setNovaDespesa({ ...novaDespesa, pagador: e.target.value })}
          >
            <option value="">Pagador</option>
            {participants.map((participant, index) => (
              <option key={index} value={participant}>{participant}</option>
            ))}
          </select>
          <button onClick={afegirDespesa} className="px-4 py-2 text-white bg-blue-500 rounded">
            Afegir Despesa
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Despeses</h3>
          {despeses.map(despesa => (
            <div key={despesa.id} className="flex justify-between items-center mb-2 p-2 border rounded">
              <div>{despesa.concepte}</div>
              <div>{despesa.import} €</div>
              <div>{despesa.pagador}</div>
              <button onClick={() => eliminarDespesa(despesa.id)} className="ml-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Balanç</h3>
          <div>
            {Object.entries(balanc).map(([participant, valor]) => (
              <div key={participant} className="flex justify-between">
                <span>{participant}</span>
                <span className={valor >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {valor.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestorDespesesViatge;
