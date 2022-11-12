/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useState } from 'react';
import { executeRequest } from '../services/api';

type LoginProps = {
    setAccessToken(s:string) : void
}

export const Login : NextPage<LoginProps> = () =>{

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const doRegister = async() => {
        try{
            if(!email || !password){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                name,
                email,
                password
            };

            const result = await executeRequest('user', 'POST', body);
            if (result && result.data){
               setRegisterSuccess(true);
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

    return (
        <div className='container-login'>
            <img src='/logo.svg' alt='Logo Fiap' className='logo'/>
            <div className="form">
                {error && <p>{error}</p>}
                {registerSuccess && <p>Cadastro realizado com sucesso! Em alguns segundos você irá para a tela de login</p>}
                <div>
                    <img src='/mail.svg' alt='Nome'/> 
                    <input type="text" placeholder="Nome" 
                        value={name} onChange={e => setName(e.target.value)}/>
                </div>
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
                <div>
                    <img src='/lock.svg' alt='Confirmação de Senha'/> 
                    <input type="password" placeholder="Confirmar Senha" 
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
                </div>
                <button type='button' onClick={doRegister} disabled={loading}>{loading ? '...Carregando' : 'Registrar'}</button>
            </div>
        </div>
    );
}