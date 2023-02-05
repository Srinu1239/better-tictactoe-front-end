import { useEffect, useState } from 'react';
import { BaseResponse } from '../interfaces';
import { UpdateInfoRequest } from '../interfaces';
import './Form.css'

//initial values in state
const initialValues: UpdateInfoRequest  = {
  name: '',
  age: 0,
  married: '',
  dob: new Date()
}

export function Form() {
  
  const [status, setStatus] = useState<'INITIAL' | 'SEND_DATA' | 'SENDING_DATA' | 'DATA_SENDED' | 'ERROR_SENDING_DATA'>();
  const [values, setValues] = useState<UpdateInfoRequest>(initialValues);
  const [data , setData] = useState<BaseResponse>();

  //sending data to backend
  useEffect(() => {
    if(status === 'SEND_DATA') {
      setStatus('SENDING_DATA');
      console.log()
      fetch('http://localhost:3001/form/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      .then((rawResponse) => {
        if([200, 201].includes(rawResponse.status)) {
          return rawResponse.json();
        } else {
          throw new Error();
        }        
      })
      .then((response: BaseResponse) => {
        setStatus('DATA_SENDED');
        setData(response);
      })
      .catch(e => {
        setStatus('ERROR_SENDING_DATA');
      })
    }
  }, [status,values]);


  // form submission handling
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setStatus('SEND_DATA')
  }

  

  //checking status of data
  if (status === 'ERROR_SENDING_DATA') {
    return (
      <div>
        <h1>ERRORE INVIO DATI</h1>
        <button onClick={() => setStatus('INITIAL')}>RIPROVA</button>
      </div>
    );
  }

  if(status === 'SEND_DATA' || status === 'SENDING_DATA') {
    return (
      <div>
        <h1>INVIO IN CORSO</h1>
        <button onClick={() => setStatus('INITIAL')}>ANNULLA</button>
      </div>
    );
  }

  if(status === 'DATA_SENDED') {
    return (<div>
        {data?.success === true && <h1>DATI INVIATI VALIDI</h1>}
        {data?.success === false && <h1>DATI INVIATI NON VALIDI</h1> }
        <button onClick={() => setStatus('INITIAL')}>INVIA UN ALTRO VALORE</button>
    </div>)
  }

  return (
    <div>
    <div className='form'>
      <h1>INSERISCI IL FORM DATA</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: <input 
        type="text" 
        id='name' 
        name='name' 
        value={values.name} 
        onChange={(e) => setValues({...values, name: e.target.value})} />
        </label>

        <label htmlFor="age">Age: <input 
        type="number" 
        id='age' 
        name='age' 
        value={values.age} 
        onChange={(e) => setValues({...values, age: Number(e.target.value)})} />
        </label>

        <label htmlFor="marrital_status">Marital Status:</label>
        <label>
          <input 
          type="radio" 
          id='married' 
          name='marrital_status' 
          value="Married" 
          checked={values.married === "Married"} 
          onChange={(e) => setValues({...values, married: e.target.value})} /> 
          Married 
        </label>
        <label>
          <input 
          type="radio" 
          id='single'  
          name='marrital_status' 
          value="Single" 
          checked={values.married === "Single"} 
          onChange={(e) => setValues({...values, married: e.target.value})} /> 
          Single 
        </label>

        <label htmlFor="dob">Date of Birth: 
          <input 
          type="date" 
          id='dob' 
          name='dob' 
          onChange={(e) => setValues({...values, dob: new Date(e.target.value)})} />
        </label>

        <button type='submit'>VALIDA</button>
        <ul>
          <li>Name length should be between 5 and 50</li>
          <li>Age should be between 1 and 150</li>
          <li>If Age less than 18 then Marital status should be single</li>
          <li>Age and dob should be coherent</li>
        </ul>
      </form>
        
    </div>
    </div>
    
  );
}
