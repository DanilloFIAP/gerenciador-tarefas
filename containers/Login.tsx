/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useEffect, useState } from 'react';
import { executeRequest } from '../services/api';

type LoginProps = {
    setAccessToken(s:string) : void
}

export const Login : NextPage<LoginProps> = ({setAccessToken}) =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    let time = 5;

    const cleanInputs = () => {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    }

    const doRegister = async() => {
      try{
          if(!email || !password || !confirmPassword || !name){
              return setError('Favor preencher os campos.');
          }

          if (password !== confirmPassword) {
            return setError('Favor as senhas devem ser iguais.');
          }

          setLoading(true);

          const body = {
              name,
              email,
              password
          };

          const result = await executeRequest('user', 'POST', body);
          if (result && result.data){
              setError('');
              cleanInputs();
              setRegisterSuccess(true);
              const timer = setInterval(() => {
                if (time === 0) {
                  clearInterval(timer);
                  return setShowRegister(false);                                  
                }

                time -= 1;
              }, 1000);
          } else {
            setError('Ocorreu erro ao efetuar cadastro, tente novamente.');
          }
      } catch(e : any){
          console.log('Ocorreu erro ao efetuar cadastro:', e);
          if(e?.response?.data?.error){
              setError(e?.response?.data?.error);
          }else{
              setError('Ocorreu erro ao efetuar cadastro, tente novamente.');
          }
      }

      setLoading(false);
  }

    const doLogin = async() => {
        try{
            if(!email || !password){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                login: email,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
               localStorage.setItem('accessToken', result.data.token);
               localStorage.setItem('name', result.data.name);
               localStorage.setItem('email', result.data.email);
               setAccessToken(result.data.token);
            }
        } catch(e : any){
            console.log('Ocorreu erro ao efetuar login:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao efetuar login, tente novamente.');
            }
        }

        setLoading(false);
    }

    return (
        <div className='container-login'>
            <img src='/logo.svg' alt='Logo Fiap' className='logo'/>
            {
              !showRegister ? (
                <div className="form">
                  {error && <p>{error}</p>}
                  <div>
                      <img src='/mail.svg' alt='Login'/> 
                      <input type="text" placeholder="Login" 
                          value={email} onChange={e => setEmail(e.target.value)}/>
                  </div>
                  <div>
                      <img src='/lock.svg' alt='Senha'/> 
                      <input type="password" placeholder="Senha" 
                          value={password} onChange={e => setPassword(e.target.value)}/>
                  </div>
                  <div className="form-actions">
                    <button type='button' onClick={doLogin} disabled={loading}>{loading ? '...Carregando' : 'Login'}</button>
                    {!loading && <span onClick={() => {
                        cleanInputs();
                        setError('');
                        setShowRegister(true);
                      }}>
                        Cadastre-se
                      </span>
                    }
                  </div>
                </div>
              ) : (
                <div className="form">
                  {error && <p>{error}</p>}
                  {registerSuccess && (
                    <div className='success-msg'>
                      <p>Cadastro realizado com sucesso!</p> 
                      <p>Em alguns segundos você irá para a tela de login</p>
                    </div>
                  )}
                  <div>
                      <img src='/user-regular.svg' alt='Nome'/> 
                      <input type="text" placeholder="Nome" 
                          value={name} onChange={e => setName(e.target.value)}/>
                  </div>
                  <div>
                      <img src='/mail.svg' alt='Email'/> 
                      <input type="text" placeholder="Email" 
                          value={email} onChange={e => setEmail(e.target.value)}/>
                  </div>
                  <div>
                      <img src='/lock.svg' alt='Senha'/> 
                      <input type="password" placeholder="Senha" 
                          value={password} onChange={e => setPassword(e.target.value)}/>
                  </div>
                  <div>
                      <img src='/lock.svg' alt='Confirmação de Senha'/> 
                      <input type="password" placeholder="Confirmar Senha" 
                          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
                  </div>
                  <button type='button' onClick={doRegister} disabled={loading}>{loading ? '...Carregando' : 'Registrar'}</button>
                </div>
              )
            }
            

        </div>
    );
}